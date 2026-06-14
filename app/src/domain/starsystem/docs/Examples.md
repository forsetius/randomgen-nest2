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

## Example of a Planned Canonical JSON Shape

The following is still a target example, not the current live endpoint response.
It shows how the agreed astronomical model can represent explicit bodies, orbits, and a co-orbital group:

```jsonc
{
  "system": {
    "id": "sys-helios",
    "name": "Helios",
    "rootBodyId": "body-helios-barycenter",
    "referenceEpoch": "J2000",
    "defaultLengthUnit": "au",
    "defaultAngleUnit": "deg",
    "defaultTimeUnit": "day",
    "bodyIds": [
      "body-helios-barycenter",
      "body-helios-a",
      "body-helios-b",
      "body-thalassa",
      "body-thalassa-trojan-1",
      "body-thalassa-rings",
    ],
    "orbitIds": [
      "orbit-helios-a",
      "orbit-helios-b",
      "orbit-thalassa",
      "orbit-thalassa-trojan-1",
    ],
    "coOrbitalGroupIds": ["coorb-thalassa-trojans"],
  },
  "bodies": [
    {
      "id": "body-helios-barycenter",
      "type": "barycenter",
      "name": "Helios AB",
      "memberBodyIds": ["body-helios-a", "body-helios-b"],
      "computedMass": "<Mass value object>",
    },
    {
      "id": "body-helios-a",
      "type": "star",
      "name": "Helios A",
      "orbitId": "orbit-helios-a",
      "mass": "<Mass value object>",
      "shape": {
        "meanRadius": "<Length value object>",
      },
      "stellarType": "G2V",
      "luminosity": "<Luminosity value>",
    },
    {
      "id": "body-helios-b",
      "type": "star",
      "name": "Helios B",
      "orbitId": "orbit-helios-b",
      "mass": "<Mass value object>",
      "shape": {
        "meanRadius": "<Length value object>",
      },
      "stellarType": "K4V",
      "luminosity": "<Luminosity value>",
    },
    {
      "id": "body-thalassa",
      "type": "planet",
      "name": "Thalassa",
      "orbitId": "orbit-thalassa",
      "mass": "<Mass value object>",
      "shape": {
        "meanRadius": "<Length value object>",
      },
      "compositionClass": "rocky",
      "parentStarIds": ["body-helios-a", "body-helios-b"],
      "coOrbitalGroupId": "coorb-thalassa-trojans",
      "coOrbitalRole": "primary",
    },
    {
      "id": "body-thalassa-trojan-1",
      "type": "minorBody",
      "name": "Thalassa Trojan 1",
      "orbitId": "orbit-thalassa-trojan-1",
      "mass": "<Mass value object>",
      "shape": {
        "meanRadius": "<Length value object>",
      },
      "minorBodyClass": "trojan",
      "coOrbitalGroupId": "coorb-thalassa-trojans",
      "coOrbitalRole": "trojanLeading",
    },
    {
      "id": "body-thalassa-rings",
      "type": "ringSystem",
      "name": "Thalassa Rings",
      "hostBodyId": "body-thalassa",
      "innerRadius": "<Length value object>",
      "outerRadius": "<Length value object>",
      "compositionClass": "icy",
    },
  ],
  "orbits": [
    {
      "id": "orbit-helios-a",
      "primaryBodyId": "body-helios-barycenter",
      "orbitingBodyId": "body-helios-a",
      "kind": "keplerian",
      "frame": "barycentric",
      "epoch": "J2000",
      "semiMajorAxis": "<Length value object>",
      "eccentricity": 0.1,
      "inclination": 0,
      "longitudeOfAscendingNode": 0,
      "argumentOfPeriapsis": 0,
      "meanAnomalyAtEpoch": 0,
      "siderealPeriod": "<Period value object>",
    },
    {
      "id": "orbit-helios-b",
      "primaryBodyId": "body-helios-barycenter",
      "orbitingBodyId": "body-helios-b",
      "kind": "keplerian",
      "frame": "barycentric",
      "epoch": "J2000",
      "semiMajorAxis": "<Length value object>",
      "eccentricity": 0.1,
      "inclination": 180,
      "longitudeOfAscendingNode": 0,
      "argumentOfPeriapsis": 180,
      "meanAnomalyAtEpoch": 180,
      "siderealPeriod": "<Period value object>",
    },
    {
      "id": "orbit-thalassa",
      "primaryBodyId": "body-helios-barycenter",
      "orbitingBodyId": "body-thalassa",
      "kind": "keplerian",
      "frame": "barycentric",
      "epoch": "J2000",
      "semiMajorAxis": "<Length value object>",
      "eccentricity": 0.02,
      "inclination": 1.3,
      "longitudeOfAscendingNode": 30,
      "argumentOfPeriapsis": 210,
      "meanAnomalyAtEpoch": 45,
      "siderealPeriod": "<Period value object>",
    },
    {
      "id": "orbit-thalassa-trojan-1",
      "primaryBodyId": "body-helios-barycenter",
      "orbitingBodyId": "body-thalassa-trojan-1",
      "kind": "keplerian",
      "frame": "barycentric",
      "epoch": "J2000",
      "semiMajorAxis": "<Length value object>",
      "eccentricity": 0.03,
      "inclination": 1.1,
      "longitudeOfAscendingNode": 31,
      "argumentOfPeriapsis": 205,
      "meanAnomalyAtEpoch": 105,
      "siderealPeriod": "<Period value object>",
    },
  ],
  "coOrbitalGroups": [
    {
      "id": "coorb-thalassa-trojans",
      "centralBodyId": "body-helios-barycenter",
      "referenceBodyId": "body-thalassa",
      "referenceOrbitId": "orbit-thalassa",
      "pattern": "trojan",
      "memberBodyIds": ["body-thalassa", "body-thalassa-trojan-1"],
    },
  ],
}
```

This example intentionally omits settlement, infrastructure, and narrative layers.
