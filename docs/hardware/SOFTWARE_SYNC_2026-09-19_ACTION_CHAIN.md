# Software Sync - 2026-09-19 Action-Chain Validation

Software branch: `codex/software-data`

Software commit: `1ec5968`

## Purpose

Synchronize the hardware repository with the latest software-side validation
results before strap fixation and component embedding.

## Latest Validated Setup

```text
ESP32-S3
ICM-20948 at 0x68 / WHO_AM_I 0xEA
ICM VCC <- ESP32 3V3
ICM GND <- ESP32 GND
ICM SDI/SDA <- GPIO8
ICM SCLK/SCL <- GPIO9
ICM NCS -> 3V3
ICM AD0 -> GND
5 V power bank
BOOT-button capture trigger
```

The latest action-chain session contains six valid captures:

```text
static x2
slow arm raise x1
one simulated shot x1
two simulated shots x1
two squats x1
```

Each file has approximately 2269 rows, approximately 226.9 Hz sample rate, no
gaps of 20 ms or more, and no acceleration or gyroscope saturation.

## Hardware-Side Mechanical Requirements

- Preserve the current soldered four-wire connection.
- Add strain relief before the cable enters the ESP32 or ICM.
- Keep the sensor module mechanically isolated from the power bank.
- Secure the power bank so its cable cannot pull the ESP32 connector.
- Keep USB-C, BOOT, and RGB LED accessible.
- Do not coat solder joints directly with hot glue.
- Mark sensor orientation on the strap or enclosure.
- After assembly, repeat NCS-to-3V3, AD0-to-GND, and VCC-to-GND checks.

## Acceptance After Fixation

Before court shooting, repeat:

```text
3 static captures
2 arm-raise captures
```

All five captures must pass sample count, gap, saturation, and file-size checks.
If any capture fails, inspect the cable path before proceeding to dynamic
shooting.
