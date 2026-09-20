# Software Sync - 2026-09-19 Action-Chain Validation

Software branch: `codex/software-data`

Software commit at action-chain validation: `1ec5968`

Latest validated software commit: `3db2b5d`

Last pushed software remote head at review time: `276b312`

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

## Battery and Boost Integration Sequence

The current power bank remains the validated capture baseline. Do not replace
it with the battery until the following sequence passes.

Target main path:

```text
3.7 V protected battery
-> TP4057 charge module BAT+ / BAT-
-> SS-12E07G4 3 A main switch on battery positive
-> TPS61088 fixed 5 V boost input
-> TPS61088 5 V output to ESP32 5V and GND
```

`SS12D07VG4` must not carry the main boost input current. It is only allowed in
the low-current P-MOSFET fallback control path.

Validation order:

1. Measure battery polarity and open-circuit voltage before connection.
   Expected approximately 3.0-4.2 V.
2. Connect only the battery to TP4057. Do not connect ESP32 or TPS61088 yet.
3. Charge through TP4057 and verify charging current is approximately 500 mA
   and final battery voltage is approximately 4.2 V.
4. Verify the TP4057 BAT+ / BAT- output polarity and voltage.
5. Add the SS-12E07G4 switch in the battery-positive main path.
6. Connect the switched battery output to TPS61088 input.
7. Verify TPS61088 no-load output is 5.00 V before connecting ESP32.
8. Apply a short 0.5-1 A load test. Output should remain at or above about
   4.85 V and the switch temperature should remain acceptable.
9. Connect TPS61088 5 V output only to ESP32 5V and GND. Never connect boost
   output to ESP32 3V3 or ICM VCC.
10. Confirm ESP32 boot has no brownout and ICM VCC remains approximately 3.3 V.
11. Run three static captures and two arm-raise captures on battery power.
12. Keep the power bank available as fallback until all five captures pass.

TP4057 does not provide load sharing. The ESP32 load must be switched off while
charging. Never connect USB 5 V and battery-boost 5 V to the ESP32 at the same
time.
