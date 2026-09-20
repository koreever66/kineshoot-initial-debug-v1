# H2 Wearable Fixation Runbook - 2026-09-20

Baseline:

```text
hardware_revision = H2
software_validated_commit = 3db2b5d
interface_revision = I1
ICM address = 0x68
I2C clock = 50kHz
WHO_AM_I = 0xEA
```

This stage changes only mechanical fixation, cable routing, and strain relief. Do not change firmware, tools, data format, connector pinout, `NCS`, or `AD0`.

## 0. Dry-Fit Enclosure Decision

On 2026-09-20, the dry-fit enclosure changed from the soft pouch to the already purchased transparent plastic storage box:

```text
approx. 10 x 7 x 2.3cm
```

The box is currently the mechanical dry-fit enclosure. It is not yet the final production enclosure.

Rules for this box:

- Keep all modules on one layer; do not stack ESP32, boost module, and battery into a three-layer sandwich.
- Place ESP32 with the BOOT, RST, and RGB side facing the transparent lid.
- Mark and drill a small BOOT access hole only after the final dry fit.
- The transparent lid is the RGB visibility window; no second LED and no firmware change.
- If the box presses the forearm or slides, add EVA to the skin side and use the 5cm strap plus a second anti-slip strap or Velcro base.
- Keep the box away from the wrist crease and elbow crease.
- Charge TP4057 with the box open or with a deliberate charging-access opening; do not charge in a closed, unattended box.
- Use grommets, silicone tubes, or heat-shrink sleeves in every cable exit hole.
- Keep the 4P connector latch serviceable; do not glue the connector into the box.

## 1. Pre-Fixation Gate

- [ ] Battery switch OFF.
- [ ] Computer USB disconnected.
- [ ] Charging power bank disconnected.
- [ ] The verified battery/boost chain is not modified.
- [ ] Take before-fixation photos of the wrist unit, forearm unit, and cable path.

Keep the fixed interface unchanged:

```text
ICM VCC       <- ESP32 3V3
ICM GND       <- ESP32 GND
ICM SDI/SDA   <- GPIO8
ICM SCLK/SCL  <- GPIO9
ICM NCS       -> 3V3
ICM AD0       -> GND
```

## 2. Wrist Sensor Unit

- [ ] Put 2mm EVA on the skin-facing side of the ICM box.
- [ ] Keep the ICM box near the wrist at 2 to 4cm from the wrist crease toward the elbow.
- [ ] Mark one arrow on the box toward the elbow and keep that orientation every time.
- [ ] Route the cable out of the elbow-side or forearm-side of the box, not the palm/ball side.
- [ ] Add a 1 to 2cm service loop inside or immediately outside the box.
- [ ] Anchor the cable to the box before it reaches the soldered ICM pins.
- [ ] Use the 3.8cm strap with the verified nonstandard wrap method.
- [ ] Confirm the box does not press the wrist crease or collide with the palm during wrist flexion.

Pass criteria:

- [ ] No movement after a gentle 5-second tug on the cable.
- [ ] Connector latch remains fully engaged.
- [ ] Wrist flexion and extension do not make the box hit the hand.
- [ ] Cable does not rub the skin or form a sharp bend at the box exit.

## 3. Forearm Battery and Main-Control Unit

Recommended single-layer layout inside the 10 x 8cm pouch:

```text
Near wrist: TPS61088, SS-12E07G4 switch, TP4057
Middle:     ESP32-S3
Near elbow: 500mAh battery
```

- [ ] Keep modules in one layer where possible.
- [ ] Put EVA or thin foam between the battery, PCB modules, and pouch wall.
- [ ] Keep the battery close to the elbow to reduce weight near the wrist.
- [ ] Keep all exposed solder joints covered by heat shrink or Kapton tape.
- [ ] Keep the switch accessible without opening the whole pouch.
- [ ] Keep USB-C and BOOT/RGB accessible for maintenance.
- [ ] Anchor the battery wires so battery weight does not pull on TP4057 pads.
- [ ] Anchor the boost input/output wires so the switch and connectors do not carry tension.

Pass criteria:

- [ ] Pouch does not slide down the forearm during a gentle arm raise.
- [ ] No module presses into the elbow crease.
- [ ] USB-C port is not loaded by the cable when connected.
- [ ] No battery protection-board corner presses directly on a PCB.

## 4. Cable Strain Relief

- [ ] Leave a 1 to 2cm service loop at each end of the 4P cable.
- [ ] Anchor the 4P cable near the ICM box.
- [ ] Anchor the 4P cable near the ESP32.
- [ ] Do not let the soldered ICM pins take the cable tension.
- [ ] Do not let the PH2.0 connector be the mechanical stop.
- [ ] Keep the cable away from the switch handle, battery edge, and sharp PCB corners.
- [ ] Do not cover the PH2.0 latch; it must still unplug for service.
- [ ] Use tape, Velcro, or small zip ties, but do not overtighten and crush the wires.

## 5. Post-Fixation Electrical Checks

Power OFF first:

- [ ] `NCS` to `VCC` still conducts.
- [ ] `AD0` to `GND` still conducts.
- [ ] `VCC` to `GND` does not conduct.
- [ ] The four 4P lines remain in the fixed order.
- [ ] Battery polarity has not changed.

Power ON with battery:

- [ ] TPS61088 VOUT approximately 5.0V.
- [ ] ESP32 5V at or above approximately 4.85V.
- [ ] ICM VCC approximately 3.3V.
- [ ] RGB blue is stable.
- [ ] No reset during gentle cable movement.

## 6. Post-Fixation Capture Validation

Only after mechanical fixation and electrical checks pass, run:

```text
3 static captures
2 small arm-raise captures
```

Every file must remain:

```text
approximately 2269 rows
sample rate approximately 226.9Hz
maximum interval below 10ms
no gaps of 20ms or more
no empty file
no partial file
no saturation
no reset
write_failed = 0
```

If any capture fails, inspect cable strain relief and connector locking before changing any firmware.

## 7. Shared Handoff Result Format

Write the following to `shared/handoffs/hardware.md` when fixation is complete:

```text
hardware_commit:
fixation_date:
wrist_unit: pass/fail
forearm_unit: pass/fail
strain_relief: pass/fail
NCS_to_VCC:
AD0_to_GND:
ICM_VCC:
ESP32_5V:
TPS61088_VOUT:
static_captures:
arm_raise_captures:
reset_count:
write_failed_count:
remaining_risks:
```
