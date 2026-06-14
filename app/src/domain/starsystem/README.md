# Starsystem Module

## Overview

The `starsystem` module is a staging area for an astrophysics-informed star system generator.
Its long-term goal is to generate usable fictional systems for science-fiction RPGs and export them to external visualization tools, starting with Celestia.

The current implementation stops at stellar hierarchy generation.
It produces a single, binary, or triple star hierarchy with generated stellar masses and exposes that hierarchy as JSON.
Planetary systems, dwarf planets, moons, rings, asteroid belts, selected asteroids, and export files are planned but not implemented yet.
The target canonical astronomical model is now documented as a hybrid JSON structure with first-class bodies, orbits, and co-orbital groups.

## How to Run or Integrate

The current public entry point is `GET /api/1.0/starsystem`.
The endpoint validates the `lang` query parameter and returns a hierarchy-first response rooted at `root`.

Inside the app, the generation flow is currently:

1. `StarSystemController`
2. `StarSystemGenerator`
3. `StarHierarchyGenerator`
4. `StarSystem`

## Configuration or Environment

The module currently has no dedicated runtime configuration.
It relies on the application-wide validation configuration for supported languages.

The current generator uses probabilistic heuristics for:

- primary star mass
- multiplicity (`single`, `binary`, `triple`)
- binary separation (`close`, `wide`)
- triple layout
- stellar mass ratios

These heuristics are an interim model and are expected to evolve as the module moves closer to astrophysical targets.

## Short Examples

Illustrative response shape:

```jsonc
{
  "root": {
    "kind": "binary",
    "separation": "wide",
    "primary": {
      "kind": "single",
      "star": {
        "mass": "<Mass value object>",
      },
    },
    "secondary": {
      "kind": "binary",
      "separation": "close",
      "primary": {
        "kind": "single",
        "star": {
          "mass": "<Mass value object>",
        },
      },
      "secondary": {
        "kind": "single",
        "star": {
          "mass": "<Mass value object>",
        },
      },
    },
  },
}
```

At the moment, the hierarchy shape is stable, but the final external JSON representation of `Mass` still needs to be formalized before the module can treat it as a stable public contract.
The documented canonical model should therefore be read as the target contract shape, not as the exact wire format already returned by the current endpoint.

## Links to Deeper Docs

- [Architecture](./docs/Architecture.md)
- [API](./docs/API.md)
- [Integration](./docs/Integration.md)
- [Examples](./docs/Examples.md)
- [ADR](./docs/ADR.md)
