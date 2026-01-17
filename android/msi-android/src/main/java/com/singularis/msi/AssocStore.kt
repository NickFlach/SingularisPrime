package com.singularis.msi

import java.util.concurrent.ConcurrentHashMap
import kotlin.math.sqrt

/**
 * Associative state store for MSI.
 * Manages key-value pairs with optional vector embeddings for semantic search.
 * 
 * v1: In-memory with simple brute-force vector search.
 * Future: HNSW index, FAISS, USearch, SQLite FTS + embeddings.
 */
internal class AssocStore {

    // space -> key -> value
    private val store = ConcurrentHashMap<String, ConcurrentHashMap<String, AssocValue>>()

    /**
     * Puts a value into associative memory.
     * @param space The memory space (namespace)
     * @param key The key
     * @param value The value with optional embedding bytes
     */
    fun put(space: String, key: String, value: AssocValue) {
        val spaceMap = store.computeIfAbsent(space) { ConcurrentHashMap() }
        spaceMap[key] = value
    }

    /**
     * Gets a value from associative memory.
     * @return The value, or null if not found
     */
    fun get(space: String, key: String): AssocValue? {
        return store[space]?.get(key)
    }

    /**
     * Queries associative memory.
     * If vector is provided, performs cosine similarity search.
     * Otherwise returns arbitrary top-k entries.
     * 
     * @param space The memory space
     * @param query Query parameters (k, vector, predicate)
     * @return List of results sorted by relevance
     */
    fun query(space: String, query: AssocQuery): List<AssocResult> {
        val spaceMap = store[space] ?: return emptyList()

        // If vector query, perform similarity search
        if (query.vector != null) {
            return vectorQuery(spaceMap, query.vector, query.k)
        }

        // If predicate, apply filter
        if (query.predicate != null) {
            return predicateQuery(spaceMap, query.predicate, query.k)
        }

        // Default: return arbitrary top-k
        return spaceMap.entries
            .take(query.k)
            .map { (k, v) -> AssocResult(key = k, score = null, value = v) }
    }

    /**
     * Forgets a key or applies a forgetting policy.
     * @param keyOrPolicy Either a specific key to forget, or "all" to clear the space
     */
    fun forget(space: String, keyOrPolicy: String) {
        val spaceMap = store[space] ?: return

        when (keyOrPolicy) {
            "all" -> spaceMap.clear()
            "oldest" -> forgetOldest(spaceMap, 1)
            else -> {
                // Check for "oldest:N" pattern
                if (keyOrPolicy.startsWith("oldest:")) {
                    val n = keyOrPolicy.substringAfter(":").toIntOrNull() ?: 1
                    forgetOldest(spaceMap, n)
                } else {
                    // Treat as specific key
                    spaceMap.remove(keyOrPolicy)
                }
            }
        }
    }

    /**
     * Vector similarity search using cosine similarity.
     * v1: Brute force O(n). Future: ANN index.
     */
    private fun vectorQuery(
        spaceMap: ConcurrentHashMap<String, AssocValue>,
        queryVector: FloatArray,
        k: Int
    ): List<AssocResult> {
        return spaceMap.entries
            .mapNotNull { (key, value) ->
                // Try to interpret value.bytes as float vector
                val valueVector = bytesToFloatArray(value.bytes)
                if (valueVector != null && valueVector.size == queryVector.size) {
                    val score = cosineSimilarity(queryVector, valueVector)
                    AssocResult(key = key, score = score, value = value)
                } else {
                    null
                }
            }
            .sortedByDescending { it.score }
            .take(k)
    }

    /**
     * Predicate-based query.
     * v1: Simple "meta.key=value" matching.
     */
    private fun predicateQuery(
        spaceMap: ConcurrentHashMap<String, AssocValue>,
        predicate: String,
        k: Int
    ): List<AssocResult> {
        // Parse "key=value" predicate
        val parts = predicate.split("=", limit = 2)
        if (parts.size != 2) {
            // Invalid predicate, return all
            return spaceMap.entries.take(k)
                .map { (key, value) -> AssocResult(key = key, value = value) }
        }

        val (metaKey, metaValue) = parts
        return spaceMap.entries
            .filter { (_, value) -> value.meta[metaKey] == metaValue }
            .take(k)
            .map { (key, value) -> AssocResult(key = key, value = value) }
    }

    /**
     * Forgets the N oldest entries by timestamp.
     */
    private fun forgetOldest(spaceMap: ConcurrentHashMap<String, AssocValue>, n: Int) {
        val oldest = spaceMap.entries
            .sortedBy { it.value.tsNanos ?: Long.MAX_VALUE }
            .take(n)
            .map { it.key }

        oldest.forEach { spaceMap.remove(it) }
    }

    /**
     * Converts bytes to float array (assumes little-endian IEEE 754).
     */
    private fun bytesToFloatArray(bytes: ByteArray): FloatArray? {
        if (bytes.size % 4 != 0) return null
        val floats = FloatArray(bytes.size / 4)
        for (i in floats.indices) {
            val bits = (bytes[i * 4].toInt() and 0xFF) or
                    ((bytes[i * 4 + 1].toInt() and 0xFF) shl 8) or
                    ((bytes[i * 4 + 2].toInt() and 0xFF) shl 16) or
                    ((bytes[i * 4 + 3].toInt() and 0xFF) shl 24)
            floats[i] = Float.fromBits(bits)
        }
        return floats
    }

    /**
     * Computes cosine similarity between two vectors.
     */
    private fun cosineSimilarity(a: FloatArray, b: FloatArray): Float {
        var dot = 0f
        var normA = 0f
        var normB = 0f
        for (i in a.indices) {
            dot += a[i] * b[i]
            normA += a[i] * a[i]
            normB += b[i] * b[i]
        }
        val denom = sqrt(normA) * sqrt(normB)
        return if (denom > 0f) dot / denom else 0f
    }

    /**
     * Checks if a space exists.
     */
    fun spaceExists(space: String): Boolean = store.containsKey(space)

    /**
     * Gets count of entries in a space.
     */
    fun spaceSize(space: String): Int = store[space]?.size ?: 0

    /**
     * Lists all spaces.
     */
    fun listSpaces(): List<String> = store.keys.toList()

    /**
     * Lists all keys in a space.
     */
    fun listKeys(space: String): List<String> = store[space]?.keys?.toList() ?: emptyList()

    /**
     * Clears all spaces.
     */
    fun clear() {
        store.clear()
    }

    /**
     * Clears a specific space.
     */
    fun clearSpace(space: String) {
        store[space]?.clear()
    }
}
