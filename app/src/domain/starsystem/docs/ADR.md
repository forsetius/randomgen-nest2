# Starsystem ADR

## Accepted Decisions

### Hierarchy-First Stellar Model

The module uses a hierarchy-first stellar model rooted at `StarHierarchyNode`.
This replaces the removed `innerSystem` / `outerSystem` structure.

Reason:

- binary and triple systems are easier to represent honestly as nested relationships
- future orbital and planetary rules can attach to a clearer dynamical structure

### JSON as the Main Output Format

JSON is the primary output format for generated systems.
Exporter-specific outputs should be derived from that generated data.

Reason:

- JSON is the easiest format to inspect, test, persist, and adapt
- Celestia export is important, but it is a projection, not the source of truth

### Hybrid Canonical Astronomical Model

The target JSON model should use:

- one top-level `system` record
- first-class `bodies`
- first-class `orbits`
- first-class `coOrbitalGroups`

Reason:

- nested stellar systems need explicit barycenters
- explicit orbit records are easier to validate and export than implicit tree edges
- co-orbital objects such as trojans should be representable without inventing a full resonance-analysis subsystem

### Astrophysics-Informed But RPG-Usable

The generator is intended to follow current astrophysical understanding while remaining useful for RPG scenario design.

Reason:

- the generator must produce systems that feel believable
- the output also needs to carry gameplay-relevant descriptive data

## Working Assumptions

- support for single, binary, and triple systems is the immediate stellar scope
- Celestia is the first export target
- future exporters such as SpaceEngine are possible but not currently planned in detail
- the astronomical object catalog now includes stars, barycenters, planets, dwarf planets, moons, ring systems, asteroid belts, and selected minor bodies
- general resonance modeling is deferred; targeted co-orbital grouping is in scope

## Deferred Decisions

The following decisions are intentionally deferred to the next documentation step:

- the full catalog of generated object types
- which documented canonical properties are mandatory at generation time
- how bigint-backed value objects become stable public JSON values
- which additional RPG-facing descriptive properties should exist above the astronomical layer
- how Celestia-specific file fields are derived from canonical generated data
