# ESP32 Replacement, BLE Trigger, and Mobile App - 2026-10-01

## Replacement Event

The previous wrist-node ESP32-S3 failed while triggering capture 6. The operator reported a burning smell. The original red power LED and GPIO48 RGB LED no longer illuminated, and visible damage was found around the BOOT-key area. Power was removed immediately and the board was retired.

The spare ESP32-S3 DevKitC-1 N16R8 originally reserved for Node 2 was installed in the wrist-node position.

The electrical interface did not change:

```text
ICM VCC       -> ESP32 3V3
ICM GND       -> ESP32 GND
ICM SDI/SDA   -> GPIO8
ICM SCLK/SCL  -> GPIO9
ICM NCS       -> 3V3
ICM AD0       -> GND
BOOT trigger  -> GPIO0 to GND
RGB status    -> GPIO48
I2C address   -> 0x68
I2C clock     -> 50 kHz
WHO_AM_I      -> 0xEA
```

Initial bring-up was performed with USB only. The battery, TP4057, power switch, and TPS61088 were disconnected during flashing and first validation.

## BLE and App Integration

Firmware now advertises only the custom BLE control service:

```text
Name: KineShoot-Cam
Service UUID: 6b1d0001-9a3f-4d2a-8f6f-6b1d00000001
Characteristic UUID: 6b1d0002-9a3f-4d2a-8f6f-6b1d00000002
Command 0x01: start capture
```

The iPhone app starts video recording, waits one second to record the blue-light pre-roll, then writes `0x01` to the ESP32. The ESP32 performs the same capture routine used by the BOOT fallback.

Expected serial handshake:

```text
BLE_CONTROL_READY,name=KineShoot-Cam,...
BLE_CONNECTED
BLE_COMMAND,capture
CAPTURE_START,file=/capture_001.csv,seconds=10
CAPTURE_DONE,...
```

The current app build is `KineShootRemote 1.5.1 (8)`, with 1080p60, front/rear switching, zoom, a 1-second blue pre-roll, and a 14-second recording window.

## Verification on the Replaced Board

The replacement board completed:

- USB flashing and serial initialization
- ICM-20948 initialization at `0x68`
- repeated 10-second captures
- LittleFS CSV and telemetry writes
- BOOT-triggered capture
- BLE-triggered capture from the iPhone app
- RGB state changes visible in 60 fps video

One verified alignment session is:

```text
session_20261001_034814/capture_001.csv
2268 rows, 9.9904 s, 226.92 Hz
```

The corresponding 15.61-second 1080p60 video shows the green write-complete LED at approximately `12.526 s`. Telemetry reports `11.535 s` from capture start to write completion, giving an estimated IMU start at approximately `0.991 s` in the video, consistent with the configured 1-second blue pre-roll.

## Hardware Notes and Next Checks

- Green indicates that the CSV and telemetry write completed; it is not the physical end of the player's motion.
- Keep the camera aimed and focused on the device before pressing Start so the blue-to-red transition is recorded.
- Do not connect USB and the battery-boost output at the same time.
- Inspect the replacement board area after repeated captures for heating, connector strain, or intermittent resets.
- Secure the replacement board and strain-relieve the I2C/power wiring inside the enclosure.
- Run a battery-powered BLE capture series and compare sample continuity, reset count, and RGB behavior to the USB-powered baseline.
- Record the next enclosure revision or fastening change if the replacement board dimensions alter the current wrist-node fit.

