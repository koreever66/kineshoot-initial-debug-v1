# Node 2 Upper-Arm Open Case

Parametric JSCAD model for the second-node upper-arm enclosure.

```text
revision: N2-CASE-OPEN-V1
body outer size: 125 x 75 x 32 mm
internal nominal: 120 x 70 x 23.5 mm
top: open perimeter fence, no lid
arm circumference input: 300 mm relaxed / 317 mm flexed
bottom cradle sagitta: 6 mm
strap interface: two external stations, direct 50 mm strap
```

## Commands

```bash
npm install
npm run build
npm run render
npm run serve
```

- `build`: exports STL, 3MF, and the layout manifest into `out/`.
- `render`: uses local Chrome or Edge through Playwright Core to create isometric, top, and side PNG previews.
- `serve`: starts the interactive Three.js viewer.

The shell model excludes electronic modules. Module blocks in the viewer and manifest are mechanical placeholders only.

Measured inputs currently applied:

```text
lateral upper-arm width: 100 mm
ESP32 envelope: 63.6 x 27.94 x 12 mm
TPS61088 maximum height: 11 mm
battery safe envelope: 43 x 30 x 15 mm
dual Type-C opening: one 32 x 7 mm rectangular slot
strap natural / comfortable length: 500 mm / 680-700 mm
```

The ICM maximum bent height measured by the user is 32 mm. The current model assumes the ICM is laid sideways and its 4P cable is routed flat. Verify the installed height after that routing before the final print; if it exceeds 23.5 mm above the deck, raise the fence parameter.

## Generated Files

```text
out/node2_open_top_v1.stl
out/node2_open_top_v1.3mf
out/node2_open_top_v1_manifest.json
out/node2_open_top_v1_preview_iso.png
out/node2_open_top_v1_preview_top.png
out/node2_open_top_v1_preview_side.png
```

The current model keeps the fixed electrical interface unchanged:

```text
ICM VCC       <- ESP32 3V3
ICM GND       <- ESP32 GND
ICM SDI/SDA   <- GPIO8
ICM SCLK/SCL  <- GPIO9
ICM NCS       -> 3V3
ICM AD0       -> GND
address       = 0x68
clock         = 50kHz
WHO_AM_I      = 0xEA
```
