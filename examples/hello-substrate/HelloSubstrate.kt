package com.singularis.examples

import com.singularis.msi.*
import kotlinx.coroutines.*

/**
 * Hello Substrate - First cognitive program on Singularis Prime
 * 
 * This example demonstrates:
 * 1. Creating a sandboxed domain with capabilities
 * 2. Spawning cognitive lanes (execution contexts)
 * 3. Publishing and subscribing to events
 * 4. Using associative memory for embeddings
 * 5. Basic attention/perception loop
 */

fun main() = runBlocking {
    println("╔══════════════════════════════════════════════════════════╗")
    println("║          SINGULARIS PRIME - Hello Substrate              ║")
    println("║              AI-Native Operating System                  ║")
    println("╚══════════════════════════════════════════════════════════╝")
    println()

    // Initialize the substrate
    val msi = AndroidMsi(this)
    
    // Bootstrap: verify substrate meets requirements
    val version = msi.version()
    val caps = msi.capabilities()
    
    println("[BOOT] Substrate v${version}")
    println("[BOOT] Lanes: ${caps.lanes.min}-${caps.lanes.max ?: "∞"}")
    println("[BOOT] State Model: ${caps.state.model}")
    println("[BOOT] Clock Model: ${caps.clock.model}")
    println("[BOOT] Security: ${caps.security.model}")
    println()

    // ==========================================================================
    // PHASE 1: Create Domain (Capability Container)
    // ==========================================================================
    
    println("[DOMAIN] Creating 'Scout' domain...")
    
    val scoutDomain = msi.domainCreate(
        DomainManifest(
            name = "Scout",
            grants = listOf(
                Grant.Events("sensor/"),
                Grant.Events("percept/"),
                Grant.Events("attention/"),
                Grant.Assoc("working", Grant.Perms.RW),
                Grant.Clock
            ),
            seal = true
        )
    )
    
    println("[DOMAIN] Scout domain created: $scoutDomain")
    println()

    // ==========================================================================
    // PHASE 2: Register Entrypoints (Cognitive Loops)
    // ==========================================================================
    
    // Perception Lane: Processes sensor events into perceptions
    msi.registerEntrypoint("Perception") { laneId ->
        println("[LANE:Perception] Started (id: $laneId)")
        
        val sub = msi.eventSubscribe(scoutDomain, "sensor/")
        var count = 0
        
        while (count < 10) { // Process 10 events then exit
            val event = msi.eventWait(sub, timeoutNanos = 5_000_000_000L) // 5 sec timeout
            
            if (event != null) {
                count++
                println("[LANE:Perception] Received sensor event: ${event.topic}")
                
                // Transform sensor data into perception
                val perception = "PERCEPT:${String(event.payload)}"
                
                // Emit perception event
                msi.eventPublish(
                    scoutDomain,
                    "percept/frame",
                    perception.toByteArray(),
                    QoS.BEST_EFFORT,
                    mapOf("source" to event.topic, "ts" to msi.clockNowNanos().toString())
                )
                
                println("[LANE:Perception] Emitted perception #$count")
            } else {
                println("[LANE:Perception] Timeout waiting for sensor event")
            }
        }
        
        println("[LANE:Perception] Completed after $count events")
    }

    // Memory Lane: Stores perceptions in associative memory
    msi.registerEntrypoint("MemoryWeave") { laneId ->
        println("[LANE:MemoryWeave] Started (id: $laneId)")
        
        val sub = msi.eventSubscribe(scoutDomain, "percept/")
        var stored = 0
        
        while (stored < 10) {
            val event = msi.eventWait(sub, timeoutNanos = 10_000_000_000L)
            
            if (event != null) {
                stored++
                
                // Create a simple "embedding" (in reality, use NNAPI)
                val key = "mem_${msi.clockNowNanos()}"
                val embedding = createSimpleEmbedding(event.payload)
                
                // Store in associative memory
                msi.assocPut(
                    scoutDomain,
                    "working",
                    key,
                    AssocValue(
                        bytes = embedding,
                        meta = mapOf(
                            "source" to (event.meta["source"] ?: "unknown"),
                            "content" to String(event.payload)
                        )
                    )
                )
                
                println("[LANE:MemoryWeave] Stored memory #$stored: $key")
            }
        }
        
        println("[LANE:MemoryWeave] Completed after storing $stored memories")
    }

    // Attention Lane: Queries memory based on context
    msi.registerEntrypoint("Attention") { laneId ->
        println("[LANE:Attention] Started (id: $laneId)")
        
        // Wait for memories to accumulate
        delay(3000)
        
        repeat(3) { queryNum ->
            println("[LANE:Attention] Query #${queryNum + 1}: Retrieving top 3 memories...")
            
            val results = msi.assocQuery(
                scoutDomain,
                "working",
                AssocQuery(k = 3)
            )
            
            println("[LANE:Attention] Found ${results.size} memories:")
            results.forEachIndexed { idx, result ->
                val content = result.value?.meta?.get("content") ?: "?"
                println("  [${idx + 1}] ${result.key}: $content")
            }
            
            delay(2000)
        }
        
        println("[LANE:Attention] Completed")
    }

    // ==========================================================================
    // PHASE 3: Spawn Lanes
    // ==========================================================================
    
    println("[SPAWN] Starting cognitive lanes...")
    println()

    val perceptionLane = msi.laneSpawn(
        scoutDomain,
        "Perception",
        LanePolicy(priority = LanePolicy.Priority.HIGH, energyBudget = LanePolicy.EnergyBudget.BALANCED)
    )

    val memoryLane = msi.laneSpawn(
        scoutDomain,
        "MemoryWeave",
        LanePolicy(priority = LanePolicy.Priority.NORMAL, energyBudget = LanePolicy.EnergyBudget.LOW)
    )

    val attentionLane = msi.laneSpawn(
        scoutDomain,
        "Attention",
        LanePolicy(priority = LanePolicy.Priority.NORMAL)
    )

    println("[SPAWN] Lanes spawned:")
    println("  - Perception: $perceptionLane")
    println("  - MemoryWeave: $memoryLane")
    println("  - Attention: $attentionLane")
    println()

    // ==========================================================================
    // PHASE 4: Simulate Sensor Events
    // ==========================================================================
    
    println("[SENSOR] Starting sensor simulation...")
    println()

    // Simulate sensor events (in real app: CameraX, SensorManager, etc.)
    launch {
        val sensorTypes = listOf("camera", "gyro", "accel", "audio", "touch")
        
        repeat(10) { i ->
            delay(500) // 500ms between events
            
            val sensorType = sensorTypes[i % sensorTypes.size]
            val payload = "data_${i}_from_$sensorType"
            
            // Publish directly (host context has all permissions)
            msi.eventPublish(
                null, // Host context
                "sensor/$sensorType",
                payload.toByteArray(),
                QoS.BEST_EFFORT
            )
            
            println("[SENSOR] Published: sensor/$sensorType -> $payload")
        }
        
        println("[SENSOR] Simulation complete")
    }

    // ==========================================================================
    // PHASE 5: Wait and Report
    // ==========================================================================
    
    // Wait for all lanes to complete
    delay(15000)

    println()
    println("[STATS] Substrate Statistics:")
    msi.stats().forEach { (key, value) ->
        println("  $key: $value")
    }

    // Cleanup
    println()
    println("[SHUTDOWN] Shutting down substrate...")
    msi.shutdown()
    
    println()
    println("╔══════════════════════════════════════════════════════════╗")
    println("║              Hello Substrate Complete!                   ║")
    println("╚══════════════════════════════════════════════════════════╝")
}

/**
 * Creates a simple "embedding" from bytes.
 * In production: Use NNAPI, TensorFlow Lite, or custom model.
 */
private fun createSimpleEmbedding(data: ByteArray): ByteArray {
    // Simple hash-based embedding (128 floats = 512 bytes)
    val embedding = FloatArray(128) { i ->
        var hash = 0
        data.forEachIndexed { j, b ->
            hash = hash * 31 + b.toInt() + i + j
        }
        (hash % 1000) / 1000f
    }
    
    // Convert to bytes
    val bytes = ByteArray(embedding.size * 4)
    embedding.forEachIndexed { i, f ->
        val bits = f.toBits()
        bytes[i * 4] = (bits and 0xFF).toByte()
        bytes[i * 4 + 1] = ((bits shr 8) and 0xFF).toByte()
        bytes[i * 4 + 2] = ((bits shr 16) and 0xFF).toByte()
        bytes[i * 4 + 3] = ((bits shr 24) and 0xFF).toByte()
    }
    
    return bytes
}
