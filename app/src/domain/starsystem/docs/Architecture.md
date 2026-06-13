# Starsystem Architecture

## Purpose

The module is intended to become a domain-level generator of complete star systems that satisfy two constraints at the same time:

1. astrophysical plausibility based on current knowledge
2. practical usefulness for RPG worldbuilding and downstream export

The module should eventually generate:

- stellar hierarchies for single, binary, and triple systems
- planets and dwarf planets
- moons and rings
- asteroid belts and selected notable asteroids
- the data needed for JSON output
- the data needed for Celestia source-file export

Other exporters or renderers may be added later, but they are out of scope for the current stage.

## Current State

The implemented part is intentionally narrow.
The generator currently builds only the stellar hierarchy and the stellar masses required to describe that hierarchy.

Implemented today:

- hierarchy-first `StarSystem` aggregate
- `SingleStarNode` and `BinaryStarNode`
- single, close binary, wide binary, and two triple layouts expressed as trees
- generated star masses with a minimum stellar mass guard
- JSON DTO rooted at `root`

Not implemented yet:

- stellar physical properties beyond mass
- orbital parameters
- planetary bodies
- minor bodies
- habitable-zone or climate reasoning
- export adapters

## Structural Direction

The current code already establishes the main boundary that future work should preserve:

- `domain/`
  Holds the domain model and value objects.
- `generator/`
  Holds procedural generation logic and factories.
- `dto/`
  Holds public transport shapes for the HTTP boundary.
- `types/`
  Holds supporting contracts used by the module.
- `util/`
  Holds small reusable generation helpers.

Planned extensions should build on top of the stellar hierarchy instead of reviving the removed `innerSystem` / `outerSystem` model.

## Target Model Layers

The likely long-term layering is:

1. stellar hierarchy generation
2. stellar physical characterization
3. orbit and stability modeling
4. planetary and minor-body generation
5. output adapters for JSON and Celestia

This order matters because downstream objects depend on the topology, masses, and dynamical constraints created upstream.

## Design Constraints

- Keep controllers thin and generation logic in services or generators.
- Preserve explicit module boundaries.
- Prefer JSON as the canonical internal export shape for generated results.
- Treat Celestia export as a projection of generated domain data, not as the primary domain model.
- Record only data that is either astrophysically necessary or required by the target use cases.

## Next Documentation Step

The next planned documentation step is to define which generated object types exist and which data fields each object must carry for:

- astrophysical consistency
- RPG usability
- Celestia export
