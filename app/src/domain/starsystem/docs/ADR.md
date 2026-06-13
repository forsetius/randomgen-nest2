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

### Astrophysics-Informed But RPG-Usable

The generator is intended to follow current astrophysical understanding while remaining useful for RPG scenario design.

Reason:

- the generator must produce systems that feel believable
- the output also needs to carry gameplay-relevant descriptive data

## Working Assumptions

- support for single, binary, and triple systems is the immediate stellar scope
- Celestia is the first export target
- future exporters such as SpaceEngine are possible but not currently planned in detail
- object and field inventories below the stellar layer are still undecided

## Deferred Decisions

The following decisions are intentionally deferred to the next documentation step:

- the full catalog of generated object types
- the exact JSON schema beyond the current stellar hierarchy
- which astrophysical properties are mandatory for each object
- which RPG-facing descriptive properties are mandatory for each object
- how Celestia-specific metadata maps from canonical generated data
