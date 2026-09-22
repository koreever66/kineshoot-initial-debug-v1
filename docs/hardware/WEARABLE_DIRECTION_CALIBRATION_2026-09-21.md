# Wearable Direction Calibration - 2026-09-21

## Hardware State

The sensor enclosure and wrist fixation are now stable enough for direction
calibration:

```text
wrist position: approximately 4 cm from wrist toward elbow
body +Y: toward the hand
body +Z: toward the back of the hand
body +X: ulnar direction
```

The enclosure is wider at the base and narrower at the top. This shape must be
retained in the mechanical documentation because it introduces known
face-alignment errors during desktop calibration.

## Confirmed Sensor Mounting

```text
body +X -> sensor -Y
body +Y -> sensor -Z
body +Z -> sensor +X
```

The mapping was independently confirmed by:

```text
wearable wrist rotations
desktop face-down tests
controlled rotations around body X, Y, and Z
```

## Desktop Calibration Data

Session: `session_20260921_015500`

The first capture was discarded by the operator. The remaining nine captures
passed timestamp continuity and saturation checks. The measured residual tilt
includes both the table tilt of approximately 2 degrees toward 324-326 degrees
and the enclosure-face angle.

## Mechanical Rules

- Do not rotate or remount the IMU relative to the wrist strap.
- Keep the cable strain relief away from the sensor enclosure.
- Mark the +Y hand direction and +Z back-of-hand direction on the enclosure.
- Keep the enclosure orientation identical between sessions.
- Record any strap or enclosure change as a new calibration event.

## Next Validation

At the court:

```text
hold the starting posture for 2 seconds
record several static and shooting captures
keep body heading unchanged within one comparison group
record body heading separately when court direction matters
```
