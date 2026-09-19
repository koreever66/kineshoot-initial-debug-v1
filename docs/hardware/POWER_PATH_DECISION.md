# H2 Power Path Decision

## Main Scheme

```text
3.7 V protected battery
-> TP4057 BAT+ / BAT-
-> SS-12E07G4 3 A switch on the battery positive path
-> TPS61088 fixed 5 V boost
-> ESP32 5V and GND
```

`SS-12E07G4` is the current main switch. It must be tested for low-voltage DC
contact resistance, voltage drop, and temperature rise under the real load.

## Fallback Scheme

```text
3.7 V protected battery
-> P-MOSFET high-side switch
-> SS12D07VG4 low-current control
-> TPS61088 fixed 5 V boost
-> ESP32 5V and GND
```

The fallback is used only if the `SS-12E07G4` direct-switch path fails
low-voltage load testing.

- `SS12D07VG4` is rated around 0.5 A and must not carry the main boost input
  current.
- A finished P-MOS module must support reliable conduction with a 3.0-4.2 V
  input range.
- If a finished module is not available, use the discrete AO3415 option with a
  100 k gate-source resistor and a 1 k gate control resistor.
- Do not use F5305S 5-36 V modules; their input range does not support the
  required 3.0 V condition.
- Verify EN/CTRL polarity and voltage levels before connecting the boost module.

## Load-Sharing Constraint

TP4057 does not provide load sharing.

```text
Charging -> ESP32 load must be off
USB 5 V -> battery output must be off
Battery boost 5 V -> USB 5 V must not be connected at the same time
```

The ESP32 may receive only one 5 V source at a time.
