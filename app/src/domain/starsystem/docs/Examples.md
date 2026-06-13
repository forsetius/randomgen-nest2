# Starsystem Examples

## Current API Call

Example request:

```text
GET /api/1.0/starsystem?lang=en
```

Example response:

```jsonc
{
  "root": {
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
}
```

This example focuses on the hierarchy shape.
The exact public JSON form of `Mass` is still to be finalized.

## Interpreting Triple Systems

The current DTO does not have a dedicated `triple` node.
Instead, a triple system is encoded as a binary node whose `primary` or `secondary` child is itself another binary node.

Example shape:

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

## Example of a Future Documentation Topic

The following is not implemented yet.
It shows the kind of richer output that later documentation will need to specify:

```json
{
  "system": {
    "stars": [],
    "planets": [],
    "dwarfPlanets": [],
    "moons": [],
    "rings": [],
    "asteroidBelts": [],
    "selectedAsteroids": [],
    "exports": {
      "celestia": {}
    }
  }
}
```

This placeholder exists only to frame the next design step: deciding object categories and the required data for each category.
