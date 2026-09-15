# Software Baseline Reference

This file records the software baseline consumed by the hardware repository. The software repository remains the source of truth.

```text
software_baseline_id = KB-2026-09-15-H1-F4-I1
software_repository  = koreever66/kineshoot-initial-debug-v2
software_branch      = codex/software-data
software_commit      = eaf0e02f5c7a5d5046c68f914c662767ae544779
interface_revision   = I1
hardware_revision    = H2
```

## Read-Only Copies

The following files were copied from the fixed software commit into `reference/software-baseline/`:

| File | Source path | Git blob SHA |
|---|---|---|
| `CANONICAL_BASELINE.md` | `docs/CANONICAL_BASELINE.md` | `b7be0894064837dbcb38891269f8795f6bfdca8e` |
| `INTERFACE.md` | `docs/INTERFACE.md` | `3be05d0db3987bb673ee5159f1239849516053bf` |
| `project.json` | `project.json` | `4e9d042032dbe7b47f5d5ae87cf21e37db2b0cb8` |

These copies are read-only references. Hardware changes must not modify them.

## Fixed Interface

```text
ESP32-S3 GPIO8  <-> ICM-20948 SDI / SDA
ESP32-S3 GPIO9  <-> ICM-20948 SCLK / SCL
ESP32-S3 3V3    <-> ICM-20948 VCC
ESP32-S3 GND    <-> ICM-20948 GND
ESP32-S3 3V3    <-> ICM-20948 NCS
ESP32-S3 GND    <-> ICM-20948 AD0

I2C address: 0x68
I2C clock:   50 kHz
WHO_AM_I:    0xEA
```

## Prohibited

- Do not use `0x69` or `0x0C` as the long-term primary address.
- Do not leave `AD0` or `NCS` floating.
- Do not switch or bypass the 3.3V power path.
- Do not modify firmware, tools, data formats, record duration, triggers, or software protocol.
- Do not modify the software repository.

## F4 Runtime Contract

```text
firmware directory: firmware/imu_flash_logger_v4/
record duration:    10 seconds
buffering:          RAM during capture, batched LittleFS write after capture
sample rate:        about 220-225 Hz
accelerometer:      +/-16g
gyroscope:          +/-2000dps
trigger:            short press BOOT
USB CDC On Boot:    Enabled
CSV fields:         timestamp_us, ax_mg, ay_mg, az_mg,
                    gx_dps, gy_dps, gz_dps, temp_c
```

Hardware owns only the physical implementation, power, connectors, mounting, and verification.
