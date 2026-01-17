package com.singularis.msi

import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * Addressable state store for MSI.
 * Manages named byte buffer regions with read/write permissions.
 * 
 * v1: In-memory buffers. Future: mmap, ASharedMemory, Room persistence.
 */
internal class StateStore {

    private data class Region(
        val name: String,
        val perms: Grant.Perms,
        val buf: ByteArray,
        var dirty: Boolean = false
    )

    private val regions = ConcurrentHashMap<StateHandle, Region>()

    /**
     * Maps a new state region.
     * @param name Human-readable name for the region
     * @param bytes Size in bytes
     * @param perms Read or Read/Write permissions
     * @return Handle to the mapped region
     */
    fun map(name: String, bytes: Int, perms: Grant.Perms): StateHandle {
        require(bytes > 0) { "State region must have positive size" }
        
        val handle = UUID.randomUUID().toString()
        regions[handle] = Region(
            name = name,
            perms = perms,
            buf = ByteArray(bytes)
        )
        return handle
    }

    /**
     * Reads from a state region.
     * @throws IllegalArgumentException if offset/len out of bounds
     * @throws IllegalStateException if handle unknown
     */
    fun read(handle: StateHandle, offset: Int, len: Int): ByteArray {
        val region = regions[handle] ?: error("Unknown state handle: $handle")
        require(offset >= 0 && len >= 0) { "Offset and length must be non-negative" }
        require(offset + len <= region.buf.size) { 
            "Read out of bounds: offset=$offset, len=$len, size=${region.buf.size}" 
        }
        return region.buf.copyOfRange(offset, offset + len)
    }

    /**
     * Writes to a state region.
     * @throws IllegalArgumentException if offset/data out of bounds or read-only
     * @throws IllegalStateException if handle unknown
     */
    fun write(handle: StateHandle, offset: Int, data: ByteArray) {
        val region = regions[handle] ?: error("Unknown state handle: $handle")
        require(region.perms == Grant.Perms.RW) { "State region is read-only: ${region.name}" }
        require(offset >= 0) { "Offset must be non-negative" }
        require(offset + data.size <= region.buf.size) { 
            "Write out of bounds: offset=$offset, dataLen=${data.size}, size=${region.buf.size}" 
        }
        
        System.arraycopy(data, 0, region.buf, offset, data.size)
        region.dirty = true
    }

    /**
     * Commits state to durable storage.
     * v1: No-op (in-memory only). Future: persist to file/DB.
     */
    fun commit(handle: StateHandle) {
        val region = regions[handle] ?: error("Unknown state handle: $handle")
        // v1: Mark as committed (no actual persistence)
        region.dirty = false
        // Future: Write to file, Room DB, or ASharedMemory
    }

    /**
     * Gets region name by handle.
     */
    fun regionName(handle: StateHandle): String = regions[handle]?.name ?: "?"

    /**
     * Gets region permissions by handle.
     */
    fun regionPerms(handle: StateHandle): Grant.Perms = regions[handle]?.perms ?: Grant.Perms.R

    /**
     * Gets region size by handle.
     */
    fun regionSize(handle: StateHandle): Int = regions[handle]?.buf?.size ?: 0

    /**
     * Checks if region exists.
     */
    fun exists(handle: StateHandle): Boolean = regions.containsKey(handle)

    /**
     * Checks if region is dirty (modified since last commit).
     */
    fun isDirty(handle: StateHandle): Boolean = regions[handle]?.dirty ?: false

    /**
     * Unmaps a state region.
     */
    fun unmap(handle: StateHandle) {
        regions.remove(handle)
    }

    /**
     * Returns count of mapped regions (for debugging).
     */
    fun regionCount(): Int = regions.size

    /**
     * Clears all regions.
     */
    fun clear() {
        regions.clear()
    }

    /**
     * Lists all handles.
     */
    fun listHandles(): List<StateHandle> = regions.keys.toList()
}
