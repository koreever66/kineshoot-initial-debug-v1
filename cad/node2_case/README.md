# Node 2 Upper-Arm Open Case

Parametric JSCAD model for the second-node upper-arm enclosure.

```text
revision: N2-CASE-OPEN-V1
body outer size: 125 x 75 x 26 mm
internal nominal: 120 x 70 x 17.5 mm
top: open perimeter fence, no lid
arm circumference assumption: 340 mm
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
