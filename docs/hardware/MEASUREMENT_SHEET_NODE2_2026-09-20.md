# Node 2 3D Enclosure Measurement Sheet - 2026-09-20

Target: upper-arm node enclosure for the second independent IMU node.

Use millimeters. Measure actual installed parts where possible. If a solder joint, connector, or wire bend increases the envelope, include it in the measured value.

## 1. Upper-Arm Geometry

Record the intended arm and orientation:

```text
left or right arm:
case center distance from elbow: ____ mm
case long-axis direction: parallel to humerus
outer/lateral side position:
preferred case length: ____ mm
preferred case width around arm: ____ mm
preferred maximum thickness: ____ mm
upper-arm circumference at case center: ____ mm
upper-arm circumference at center - 30mm: ____ mm
upper-arm circumference at center + 30mm: ____ mm
```

If possible, make a simple paper/cardboard mock shell and record whether the curved inner surface follows the arm without bridging or pinching.

## 2. ESP32-S3 Module

```text
PCB length: ____ mm
PCB width: ____ mm
PCB thickness: ____ mm
maximum height including header pins: ____ mm
maximum height including USB-C shell: ____ mm
overall envelope length including USB-C: ____ mm
overall envelope width: ____ mm
overall envelope thickness: ____ mm
COM USB-C center from nearest end: ____ mm
COM USB-C center from nearest side: ____ mm
USB-OTG USB-C center from nearest end: ____ mm
BOOT button center from nearest end/side: ____ mm
RST button center from nearest end/side: ____ mm
GPIO48 RGB center from nearest end/side: ____ mm
antenna keep-out area: ____ mm x ____ mm
preferred face toward lid:
```

Important:

- identify the `COM` USB-C port used for flashing/export
- keep the antenna area clear of battery, metal, and dense wiring
- keep BOOT, RST, and RGB accessible

## 3. ICM-20948 Module

```text
length: ____ mm
width: ____ mm
PCB thickness: ____ mm
height with soldered header/pins: ____ mm
height with 4P connector mated: ____ mm
4P cable exit direction in final assembly:
mounting-hole spacing:
clearance needed around NCS/AD0 jumpers: ____ mm
clearance needed around 4P latch: ____ mm
```

The ICM should have its own low-profile pocket or foam-isolated sub-shell.

## 4. TPS61088 Boost Module

```text
PCB length: ____ mm
PCB width: ____ mm
PCB thickness: ____ mm
maximum height including inductor: ____ mm
terminal type: solder pad / KF301 / other
maximum height including terminals: ____ mm
VIN pad location from board corner: ____ mm / ____ mm
VOUT pad location from board corner: ____ mm / ____ mm
GND pad locations from board corner: ____ mm / ____ mm
input/output wire bend envelope: ____ mm
```

Keep ventilation space around the boost module.

## 5. TP4057 Charging Module

```text
PCB length: ____ mm
PCB width: ____ mm
PCB thickness: ____ mm
height including Type-C shell: ____ mm
Type-C opening dimensions: ____ mm x ____ mm
Type-C center from nearest corner: ____ mm / ____ mm
BAT pad group positions: ____ mm
required service access for charging: open lid / side opening
```

## 6. SS-12E07G4 Switch

```text
body length: ____ mm
body width: ____ mm
body height without handle: ____ mm
handle extra height: ____ mm
pin spacing: ____ mm
required handle travel: ____ mm
desired handle access: lid slot / side slot
```

## 7. Battery B2

```text
length including protection board: ____ mm
width including protection board: ____ mm
thickness including protection board: ____ mm
wire exit side:
wire length available: ____ mm
connector envelope: ____ mm
preferred battery position in case: shoulder/proximal end
```

The battery must not be compressed, folded, or placed directly over the ESP32 antenna.

## 8. Connectors and Wiring Volume

```text
wire gauge:
number of power wires:
number of 4P signal wires:
maximum bundle diameter: ____ mm
preferred minimum bend radius: ____ mm
estimated folded wire volume: ____ mm^3
number of service loops:
service-loop length at ICM: ____ mm
service-loop length at ESP32: ____ mm
```

Sketch or photograph the proposed wire path before measuring the bundle.

## 9. Enclosure Features

- [ ] curved arm-facing surface
- [ ] separate ICM pocket
- [ ] battery pocket
- [ ] boost-module ventilation
- [ ] ESP32 COM USB-C opening
- [ ] BOOT opening
- [ ] RST opening
- [ ] RGB visibility window
- [ ] switch access slot
- [ ] 4P cable exit with strain relief
- [ ] removable lid with M2.5 heat-set inserts
- [ ] antenna plastic-only zone
- [ ] two arm-band slots or attachment points

## 10. Print and Assembly Constraints

```text
printer build volume: ____ x ____ x ____ mm
preferred material: PETG / ASA / PA12 / other
nozzle diameter: ____ mm
layer height: ____ mm
available screw/insert size:
printer or print service:
tolerance preference:
```

## 11. Photos to Provide

- ICM module top and bottom with ruler
- ESP32 top, bottom, USB-C end, and button end with ruler
- TPS61088 top, bottom, input/output ends with ruler
- TP4057 top and bottom with ruler
- switch side and pin view with ruler
- battery with protection-board side and wire exit with ruler
- proposed wire path or paper mock shell on the upper arm

## 12. CAD Deliverables After Measurements

The hardware conversation can produce:

```text
parametric enclosure model
preview images
STL / 3MF print files
STEP file when a CAD export is available
opening-position diagram
assembly and service-access diagram
```

The design will remain mechanical-only. Firmware, I2C address, NCS/AD0, data format, and multi-node synchronization stay outside this document.
