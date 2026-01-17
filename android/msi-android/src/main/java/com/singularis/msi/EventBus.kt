package com.singularis.msi

import kotlinx.coroutines.channels.Channel
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Topic-prefix based event bus for MSI events.
 * Supports pub/sub with prefix matching.
 */
internal class EventBus {
    
    private data class Sub(
        val id: SubId,
        val prefix: String,
        val filter: String?,
        val channel: Channel<Event>
    )

    private val subscriptions = CopyOnWriteArrayList<Sub>()

    /**
     * Creates a new subscription for events matching the given prefix.
     * @param prefix Topic prefix to match (e.g., "sensor/" matches "sensor/camera", "sensor/gyro")
     * @param filter Optional filter expression (reserved for future use)
     * @return Pair of subscription ID and channel to receive events
     */
    fun subscribe(prefix: String, filter: String? = null): Pair<SubId, Channel<Event>> {
        val id = UUID.randomUUID().toString()
        val channel = Channel<Event>(capacity = Channel.BUFFERED)
        subscriptions.add(Sub(id, prefix, filter, channel))
        return id to channel
    }

    /**
     * Publishes an event to all matching subscriptions.
     * Uses prefix matching: subscription prefix "sensor/" matches topic "sensor/camera"
     */
    fun publish(event: Event) {
        subscriptions.forEach { sub ->
            if (event.topic.startsWith(sub.prefix)) {
                // Apply filter if present (v1: simple exact match on meta fields)
                if (sub.filter == null || matchesFilter(event, sub.filter)) {
                    sub.channel.trySend(event) // Best effort; upgrade QoS later
                }
            }
        }
    }

    /**
     * Gets the channel for a subscription ID.
     */
    fun channelFor(subId: SubId): Channel<Event>? {
        return subscriptions.firstOrNull { it.id == subId }?.channel
    }

    /**
     * Removes a subscription and closes its channel.
     */
    fun unsubscribe(subId: SubId) {
        val sub = subscriptions.firstOrNull { it.id == subId } ?: return
        subscriptions.remove(sub)
        sub.channel.close()
    }

    /**
     * Simple filter matching (v1: key=value format)
     */
    private fun matchesFilter(event: Event, filter: String): Boolean {
        // v1: Simple "key=value" filter on meta
        val parts = filter.split("=", limit = 2)
        if (parts.size != 2) return true // Invalid filter = pass through
        val (key, value) = parts
        return event.meta[key] == value
    }

    /**
     * Returns count of active subscriptions (for debugging)
     */
    fun subscriptionCount(): Int = subscriptions.size

    /**
     * Clears all subscriptions (for cleanup)
     */
    fun clear() {
        subscriptions.forEach { it.channel.close() }
        subscriptions.clear()
    }
}
