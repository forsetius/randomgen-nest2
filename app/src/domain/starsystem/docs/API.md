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
That future JSON contract will likely include data for:

- stars and stellar subsystems
- orbital relationships
- planets and dwarf planets
- moons
- rings
- asteroid belts
- selected individual minor bodies
- metadata needed by exporters such as Celestia

This future contract is not defined yet and should be documented only after the object inventory and field requirements are agreed.

## Compatibility Note

The module no longer exposes the removed `innerSystem` / `outerSystem` response model.
Current and future work should assume the hierarchy-first API shape.
