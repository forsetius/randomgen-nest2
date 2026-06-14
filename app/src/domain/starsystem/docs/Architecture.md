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
- the data needed for Celestia `.ssc` source-file export

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

The documentation now defines the intended canonical astronomical model so that future implementation work can target an agreed data shape.

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

## Canonical Astronomical Model

The canonical output model should use a hybrid structure:

- one top-level `system` record
- one normalized `bodies` collection
- one normalized `orbits` collection
- one normalized `coOrbitalGroups` collection

The intended shape is:

```jsonc
{
  "system": {
    "id": "sys-example",
    "name": "Example",
    "rootBodyId": "body-root-barycenter",
    "referenceEpoch": "J2000",
    "defaultLengthUnit": "au",
    "defaultAngleUnit": "deg",
    "defaultTimeUnit": "day",
    "bodyIds": [],
    "orbitIds": [],
    "coOrbitalGroupIds": [],
  },
  "bodies": [],
  "orbits": [],
  "coOrbitalGroups": [],
}
```

This preserves the readability of a single system root while keeping bodies and orbits independently addressable.
That matters for:

- binary and triple stellar hierarchies with barycenters
- moons and nested subsystems
- rings and belts
- future export to Celestia, which benefits from explicit orbital and rotational data per object
- co-orbital objects such as trojans or other libration-point populations

## Canonical Object Catalog

The astronomical layer should cover these object types:

- `barycenter`
- `star`
- `planet`
- `dwarfPlanet`
- `moon`
- `ringSystem`
- `asteroidBelt`
- `minorBody`

Notes:

- `barycenter` is a first-class body because nested multi-star and multi-body systems need an explicit dynamical root.
- `minorBody` is the generic individual-body type for asteroids, comets, trojans, and similar small objects that deserve standalone records.
- `ringSystem` and `asteroidBelt` are modeled as explicit bodies or structures in the canonical layer so that later exporters can reason about them directly instead of reconstructing them from prose-like metadata.

## Target Model Layers

The likely long-term layering is:

1. stellar hierarchy generation
2. stellar physical characterization
3. orbit and stability modeling
4. planetary and minor-body generation
5. canonical JSON serialization
6. output adapters such as Celestia

This order matters because downstream objects depend on the topology, masses, and dynamical constraints created upstream.

## Design Constraints

- Keep controllers thin and generation logic in services or generators.
- Preserve explicit module boundaries.
- Prefer JSON as the canonical internal export shape for generated results.
- Treat Celestia export as a projection of generated domain data, not as the primary domain model.
- Record only data that is either astrophysically necessary or required by the target use cases.

## Canonical Field Inventory

This section lists the parameters that the canonical astronomical model should be able to carry.
It is a target inventory, not a claim that all values are already generated.

### `system`

- `id`
- `name`
- `rootBodyId`
- `referenceEpoch`
- `defaultLengthUnit`
- `defaultAngleUnit`
- `defaultTimeUnit`
- `bodyIds`
- `orbitIds`
- `coOrbitalGroupIds`

### Common `body` Fields

Every record in `bodies` should have:

- `id`
- `type`
- `name`
- `displayName`

Physical bodies should additionally carry these fields when they are meaningful for the object type:

- `orbitId`
- `mass`
- `shape.meanRadius`

Optional cross-cutting fields should exist when they are meaningful for the object type:

- `shape.equatorialRadius`
- `shape.polarRadius`
- `siderealRotationPeriod`
- `axialTilt`
- `poleOrientation.rightAscension`
- `poleOrientation.declination`
- `poleOrientation.epoch`
- `primeMeridianAngleAtEpoch`
- `albedo`
- `coOrbitalGroupId`
- `coOrbitalRole`
- `visualClass`

These fields are included because they are useful both for astronomy-aware generation and for later Celestia `.ssc` export, especially radius, orbit, pole, rotation, and ring-sizing data.

### `star`

In addition to the common body fields:

- `stellarType`
- `spectralClass`
- `luminosityClass`
- `luminosity`
- `effectiveTemperature`
- `metallicity`
- `age`
- `isVariable`
- `colorIndex`
- `absoluteMagnitude`

### `barycenter`

In addition to the common body fields where meaningful:

- `memberBodyIds`
- `computedMass`

`barycenter` records may omit surface-like or appearance-like fields such as albedo, radii, or rotation when the generator treats them as not physically meaningful.

### `planet`, `dwarfPlanet`, `moon`, `minorBody`

In addition to the common body fields:

- `compositionClass`
- `surfaceGravity`
- `density`
- `escapeVelocity`
- `equilibriumTemperature`
- `surfaceTemperature`
- `surfaceClass`
- `parentStarIds`
- `atmosphere.present`
- `atmosphere.pressure`
- `atmosphere.composition`
- `atmosphere.breathability`
- `hydrosphere.surfaceLiquidFraction`
- `hydrosphere.surfaceIceFraction`

Additional `minorBody` fields:

- `minorBodyClass`
- `absoluteMagnitude`
- `colorClass`

### `ringSystem`

- `id`
- `type`
- `name`
- `displayName`
- `hostBodyId`
- `innerRadius`
- `outerRadius`
- `thickness`
- `ringPlaneSource`
- `opticalDepth`
- `compositionClass`
- `textureHint`
- `color`

`ringSystem` should not be forced into a normal Keplerian orbit record if the ring is simply part of the host body's equatorial system.

### `asteroidBelt`

- `id`
- `type`
- `name`
- `displayName`
- `hostBodyId`
- `innerRadius`
- `outerRadius`
- `meanRadius`
- `thickness`
- `estimatedTotalMass`
- `dominantCompositionClass`
- `estimatedObjectCount`
- `containsSelectedMinorBodies`
- `distributionProfile`

### `orbit`

Orbits are first-class records.
Each orbit should have:

- `id`
- `primaryBodyId`
- `orbitingBodyId`
- `kind`
- `frame`
- `epoch`
- `semiMajorAxis`
- `eccentricity`
- `inclination`
- `longitudeOfAscendingNode`
- `argumentOfPeriapsis`
- `meanAnomalyAtEpoch`
- `siderealPeriod`

Derived or redundant-but-useful orbit fields may also be stored:

- `periapsisDistance`
- `apoapsisDistance`
- `orbitClass`
- `stabilityClass`

### `coOrbitalGroup`

The model should represent co-orbital populations without introducing a general resonance system.
Each co-orbital group should have:

- `id`
- `centralBodyId`
- `referenceBodyId`
- `referenceOrbitId`
- `pattern`
- `memberBodyIds`

Expected `coOrbitalRole` values include:

- `primary`
- `trojanLeading`
- `trojanTrailing`
- `l4`
- `l5`
- `l3`
- `horseshoe`
- `quasiSatellite`
- `coOrbitalOther`

## Next Documentation Step

The next planned documentation step is to decide:

- which of the documented canonical fields are mandatory at generation time
- which values may be derived later
- how bigint-backed value objects such as `Mass` become stable JSON transport values
- how later export adapters map canonical data into consumer-specific formats
