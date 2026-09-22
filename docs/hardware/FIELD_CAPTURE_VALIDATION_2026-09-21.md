# Field Capture Validation - 2026-09-21

## Result

The wearable H2 hardware completed a same-player court shooting session on 2026-09-21.

```text
session: session_20260921_185918
captures exported: 13
capture_001: excluded as invalid by the operator
accepted captures: 12
```

The 12 accepted captures passed file-level row-count, timing-gap, sequence, and
saturation checks in the software workflow.

## Current Capture Contract

```text
F4 record duration: 15 seconds
sample rate: approximately 226.9Hz
expected rows: approximately 3403-3404
empty/partial file: rejected
acceleration saturation: none in accepted files
gyroscope saturation: none in accepted files
```

## Hardware State

```text
wrist sensor enclosure: fixed
forearm box and module fixation: fixed for field use
four-wire ICM interface: preserved
ICM address: 0x68
WHO_AM_I: 0xEA
battery + TP4057 + SS-12E07G4 + TPS61088 + ESP32: validated
```

LED transitions were used for the initial video/IMU synchronization workflow.
The initial phase alignment is software-side evidence and remains open for
release-frame and shot-outcome mapping.

## Next Hardware Step

Wait for the upper-arm IMU accessory, then prepare Node 2:

```text
upper-arm enclosure
independent protected battery B2
independent TP4057, switch, TPS61088, and ESP32 path
keep Node 1 and Node 2 power and ground independent unless software defines a synchronization connection
verify each node separately before dual-node capture
```

Do not claim synchronized joint angles, ball release speed, or complete dual-node
validation until Node 2 is assembled and validated.
