# Dual-Node Hardware Plan - 2026-09-20

Status: hardware proposal for the second node. Software protocol and time-sync method remain owned by the software conversation.

## 1. Target Architecture

Keep the two nodes electrically independent:

```text
Node 1: forearm
  battery B1 -> TP4057 -> switch -> TPS61088 5V -> ESP32 #1
  ICM #1 -> 4P cable -> ESP32 #1

Node 2: upper arm
  battery B2 -> TP4057 -> switch -> TPS61088 5V -> ESP32 #2
  ICM #2 -> 4P cable -> ESP32 #2
```

Do not connect the two nodes through a shared battery or shared 5V rail for the first revision.

2026-09-20 decision: Node 2 will use the second protected battery B2. The two nodes will not share a battery, 5V rail, or ground in the first revision. No inter-node signal wire will be installed until the software conversation defines the synchronization method.

## 2. Additional Hardware Required

Required:

- one ESP32-S3-N16R8 board
- one ICM-20948 module
- one TP4057-500mA charging module
- one fixed-5V TPS61088 boost module
- one 26AWG red and black silicone wire set
- one USB-C data cable for programming the second board
- two 5cm upper-arm elastic straps or equivalent reusable arm bands

Already available or reusable:

- battery B2, because two protected 602535 500mAh batteries were purchased
- spare SS-12E07G4 3A switch from the multi-pack
- PH2.0 4P connectors for the second ICM harness
- PH2.0 2P connectors for battery B2
- heat shrink, EVA foam, Velcro, labels, and spare flexible wire

Do not add a second battery-protection board in series unless the battery does not already contain one. The purchased 602535 cells already include protection boards.

## 3. Upper-Arm Placement

Proposed location:

```text
lateral upper arm
center approximately 10cm proximal to the elbow
long axis parallel to the humerus
```

Mechanical requirements:

- keep the case away from the elbow crease and shoulder
- use the distal end of the case for the ICM sensor
- use the proximal/upper end for the battery to move mass toward the shoulder
- keep the battery from pressing on the ICM compartment
- use EVA or a TPU liner on the skin-facing surface
- use two arm bands to prevent rotation and sliding
- mark node ID `N2` and an orientation arrow on the case

Keep the same fixed interface:

```text
ICM VCC       <- ESP32 3V3
ICM GND       <- ESP32 GND
ICM SDI/SDA   <- GPIO8
ICM SCLK/SCL  <- GPIO9
ICM NCS       -> 3V3
ICM AD0       -> GND
I2C address   = 0x68
I2C clock     = 50kHz
WHO_AM_I      = 0xEA
```

## 4. 3D-Printed Enclosure

Use a two-piece clamshell or removable-lid shell.

Recommended material:

```text
PETG, ASA, PA12, or another durable non-conductive material
```

Recommended structure:

- curved skin-facing surface matching the upper-arm radius
- 2.5 to 3mm wall thickness
- M2.5 heat-set inserts instead of screwing directly into printed plastic
- separate internal sensor compartment at the distal/elbow end
- main electronics compartment for ESP32, TPS61088, TP4057, and switch
- battery pocket separated from the boost module by foam
- cable channels with integrated strain-relief posts
- removable or transparent RGB window
- BOOT and RST access holes or a removable service window
- USB-C access aligned with the ESP32 COM port
- switch access without opening the lid

Do not place the battery or metal parts directly over the ESP32 antenna area. Keep the antenna at a plastic-only edge of the enclosure.

## 5. Sensor Isolation Inside the Shell

For the upper-arm node, place the ICM in a small internal pocket rather than directly bolting it to the main electronics plate.

- add 1 to 2mm EVA or TPU between ICM and shell
- anchor the 4P cable to the pocket before it reaches ICM solder joints
- leave a 1 to 2cm service loop
- keep battery and boost wiring away from the ICM cable
- use only small removable glue dots at the PCB edges after validation; do not fully pot the ICM

## 6. Validation Order

1. Verify Node 2 through USB only:

```text
0x68
WHO_AM_I = 0xEA
50kHz
```

2. Verify the Node 2 battery path:

```text
battery -> TP4057 -> switch -> TPS61088
TPS61088 VOUT approximately 5.0V
ESP32 5V at or above approximately 4.85V
ICM VCC approximately 3.3V
```

3. Verify five cold starts.
4. Run three static captures and two small arm-raise captures.
5. Only after the upper-arm node passes, integrate it with Node 1 for multi-node capture.

## 7. Software Boundary

Hardware owns only the second node power path, connectors, enclosure, mounting, and electrical tests. The software conversation must decide:

- simultaneous capture procedure
- node identity metadata
- timestamp synchronization method
- wireless or wired synchronization wiring if required
- event alignment and joint-angle computation

No firmware or data-format change is made by this hardware plan.
