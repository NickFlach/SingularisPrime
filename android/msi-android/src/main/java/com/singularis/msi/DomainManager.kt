package com.singularis.msi

import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * Manages capability domains for MSI.
 * Domains provide sandboxed capability namespaces for lanes, state, and events.
 */
internal class DomainManager {

    private data class Domain(
        val name: String,
        val grants: MutableList<Grant>,
        var sealed: Boolean
    )

    private val domains = ConcurrentHashMap<DomainId, Domain>()

    /**
     * Creates a new domain with the given manifest.
     * @return The domain ID
     */
    fun create(manifest: DomainManifest): DomainId {
        val id = UUID.randomUUID().toString()
        domains[id] = Domain(
            name = manifest.name,
            grants = manifest.grants.toMutableList(),
            sealed = manifest.seal
        )
        return id
    }

    /**
     * Grants additional capability to a domain.
     * @throws IllegalStateException if domain is sealed or doesn't exist
     */
    fun grant(domain: DomainId, grant: Grant) {
        val d = domains[domain] ?: error("Unknown domain: $domain")
        if (d.sealed) error("Domain is sealed: ${d.name}")
        d.grants.add(grant)
    }

    /**
     * Seals a domain, preventing further capability grants.
     */
    fun seal(domain: DomainId) {
        val d = domains[domain] ?: error("Unknown domain: $domain")
        d.sealed = true
    }

    /**
     * Checks if a domain has a specific capability.
     * @param domain Domain ID (null = host/root context with all permissions)
     * @param want The capability being requested
     * @return true if allowed
     */
    fun allowed(domain: DomainId?, want: Grant): Boolean {
        // Null domain = host/root context (app itself) - has all permissions
        if (domain == null) return true

        val d = domains[domain] ?: return false

        return d.grants.any { g ->
            when {
                // Events: check prefix containment
                g is Grant.Events && want is Grant.Events ->
                    want.topicPrefix.startsWith(g.topicPrefix) ||
                    g.topicPrefix.startsWith(want.topicPrefix) ||
                    want.topicPrefix == g.topicPrefix

                // State: check name match and permissions
                g is Grant.State && want is Grant.State ->
                    g.name == want.name && (g.perms == Grant.Perms.RW || g.perms == want.perms)

                // Assoc: check space match and permissions
                g is Grant.Assoc && want is Grant.Assoc ->
                    g.space == want.space && (g.perms == Grant.Perms.RW || g.perms == want.perms)

                // Clock: simple presence check
                g is Grant.Clock && want is Grant.Clock -> true

                // Accel: check specific accelerator
                g is Grant.Accel && want is Grant.Accel -> g.which == want.which

                else -> false
            }
        }
    }

    /**
     * Gets domain name by ID.
     */
    fun getName(domain: DomainId): String? = domains[domain]?.name

    /**
     * Checks if domain exists.
     */
    fun exists(domain: DomainId): Boolean = domains.containsKey(domain)

    /**
     * Checks if domain is sealed.
     */
    fun isSealed(domain: DomainId): Boolean = domains[domain]?.sealed ?: false

    /**
     * Returns count of domains (for debugging).
     */
    fun domainCount(): Int = domains.size

    /**
     * Lists all domain IDs.
     */
    fun listDomains(): List<DomainId> = domains.keys.toList()

    /**
     * Removes a domain (for cleanup).
     */
    fun remove(domain: DomainId) {
        domains.remove(domain)
    }

    /**
     * Clears all domains.
     */
    fun clear() {
        domains.clear()
    }
}
