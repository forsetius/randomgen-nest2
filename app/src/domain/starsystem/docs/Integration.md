# Starsystem Integration

## Current NestJS Integration

The module currently exposes generation through `StarSystemController`.
The request is validated with Zod-based request parsing and then passed to `StarSystemGenerator`.

Current flow:

1. HTTP request reaches `StarSystemController`
2. request query is validated by `StarSystemRequestSchema`
3. controller calls `StarSystemGenerator.generate()`
4. generator delegates to `StarHierarchyGenerator`
5. the generated `StarSystem` is returned through the current DTO boundary

## Current Internal Dependencies

The present generator depends only on:

- random generation helpers in `util/`
- value objects in `domain/valueObjects/`
- the hierarchy model in `domain/stellarHierarchy/`

There are no current exporter integrations and no dedicated configuration for the module itself.

## Planned Downstream Integrations

The target product direction introduces at least two downstream integration paths:

1. JSON output for application and tooling consumption
2. Celestia export for visualization

Both paths should consume the same canonical astronomical model rather than separate source data structures.

Celestia export should be implemented as a dedicated adapter layer that consumes generated domain data.
It should not leak Celestia-specific file concerns into the core stellar or planetary generation rules.

## Likely Future Integration Points

As the module grows, it will probably need explicit boundaries for:

- deterministic seeding or reproducible random generation
- canonical-model serialization
- exporter-specific mapping
- template-driven rendering of generated objects
- optional future exporters such as SpaceEngine

Those boundaries are expected to sit outside the core domain model and consume canonical generated data rather than own it.

## Canonical Data Expected by Exporters

The future Celestia adapter is expected to depend on canonical data such as:

- explicit body identifiers and names
- explicit orbit records with classical orbital elements
- radius data
- rotational and pole-orientation data
- albedo or closely related visual defaults
- ring dimensions and composition hints

That data should live in the canonical astronomical layer because it is still meaningful outside Celestia, even if the final `.ssc` field mapping remains exporter-specific.
