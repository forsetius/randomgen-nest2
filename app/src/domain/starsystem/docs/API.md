# Starsystem API

## Current HTTP Surface

The current public endpoint is:

```text
GET /api/1.0/starsystem
```

Current query parameters:

- `lang`
  Supported application language.
  Optional; defaults to the application default language.

## Current Response Contract

The current response is intentionally minimal and contains only the generated stellar hierarchy:

```ts
interface StarDto {
  mass: Mass;
}

interface SingleStarNodeDto {
  kind: 'single';
  star: StarDto;
}

interface BinaryStarNodeDto {
  kind: 'binary';
  separation: 'close' | 'wide';
  primary: StarHierarchyNodeDto;
  secondary: StarHierarchyNodeDto;
}

type StarHierarchyNodeDto = SingleStarNodeDto | BinaryStarNodeDto;

interface StarSystemResponseDto {
  root: StarHierarchyNodeDto;
}
```

Triple systems are represented by nesting a binary node inside another binary node.

## Current Semantics

- `root`
  The top-level stellar hierarchy node for the generated system.
- `kind`
  Distinguishes a leaf star from a composite binary node.
- `separation`
  Describes the binary relation currently used by the generator.
- `mass`
  The only stellar physical quantity currently exposed.

## Serialization Note

The hierarchy-first response shape is already established in the controller and DTOs.
However, the final JSON serialization contract for bigint-backed value objects such as `Mass` is not documented as stable yet.

That means the current API documentation should be read as:

- the hierarchy structure is intentional
- the transport representation of value objects still needs explicit finalization

## Planned Evolution

The eventual JSON output is expected to become the main serialized representation of a generated system.
That future JSON contract is expected to use a canonical astronomical model with top-level collections for `system`, `bodies`, `orbits`, and `coOrbitalGroups`.

Illustrative target shape:

```ts
interface CanonicalStarSystemJson {
  system: {
    id: string;
    name: string;
    rootBodyId: string;
    referenceEpoch: string;
    defaultLengthUnit: string;
    defaultAngleUnit: string;
    defaultTimeUnit: string;
    bodyIds: string[];
    orbitIds: string[];
    coOrbitalGroupIds: string[];
  };
  bodies: CanonicalBodyJson[];
  orbits: CanonicalOrbitJson[];
  coOrbitalGroups: CanonicalCoOrbitalGroupJson[];
}
```

The target canonical contract should be able to represent:

- `barycenter`
- `star`
- `planet`
- `dwarfPlanet`
- `moon`
- `ringSystem`
- `asteroidBelt`
- `minorBody`

It should also carry first-class orbit records and co-orbital grouping metadata for objects such as trojans or other libration-point bodies.

Detailed field inventory lives in [Architecture](./Architecture.md).

## Canonical Semantics

The planned canonical API model should follow these rules:

- every standalone astronomical object gets a stable body `id`
- every orbiting object references its orbit through `orbitId`
- every orbit record names both `primaryBodyId` and `orbitingBodyId`
- barycenters are represented explicitly as bodies rather than inferred on the fly
- co-orbital objects do not share one literal orbit record by definition; they may instead reference comparable individual orbit records and a shared `coOrbitalGroupId`

This keeps the model explicit enough for dynamical reasoning and future Celestia `.ssc` export without hardwiring exporter-specific fields into the public transport contract today.

## Compatibility Note

The module no longer exposes the removed `innerSystem` / `outerSystem` response model.
Current work should keep the hierarchy-first stellar semantics, even if the future canonical JSON contract normalizes them into `rootBodyId`, `bodies`, and `orbits`.
The current HTTP endpoint still returns only the minimal stellar-hierarchy DTO, so the canonical contract above is a documented target rather than an already-live response schema.
