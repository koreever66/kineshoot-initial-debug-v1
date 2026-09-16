# Software Baseline Reference

This file records the software baseline consumed by the hardware repository. The software repository remains the source of truth.

```text
software_baseline_id = KB-2026-09-15-H1-F4-I1
software_repository  = koreever66/kineshoot-initial-debug-v2
software_branch      = codex/software-data
software_commit      = 3162aa345627cc501781a91dbd21d02cdae4fe0a
interface_revision   = I1
hardware_revision    = H2
```

## Read-Only Copies

The following files were copied from the fixed software commit into `reference/software-baseline/`:

| File | Source path | Git blob SHA |
|---|---|---|
| `CANONICAL_BASELINE.md` | `docs/CANONICAL_BASELINE.md` | `717afcd5a1f7dec0601232ad5305f42f7df4c3bd` |
| `INTERFACE.md` | `docs/INTERFACE.md` | `23475d58d4e2ef8b0a49b8c9174069124ae8cff5` |
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
hardware acceptance 210-240 Hz or median interval 4.0-4.8 ms
accelerometer:      +/-16g
gyroscope:          +/-2000dps
trigger:            short press BOOT
USB CDC On Boot:    Enabled
status LED:         WS2812B RGB on GPIO48
LED colors:         blue=idle/running, red=capture, green=LittleFS write complete
power switch check: after changing source, proceed only when blue is on; if not, press RST once
export layout:      timestamped session directories
CSV fields:         timestamp_us, ax_mg, ay_mg, az_mg,
                    gx_dps, gy_dps, gz_dps, temp_c
metadata fields:    power_source, trigger_source, motion_speed
```

Hardware owns only the physical implementation, power, connectors, mounting, and verification.
