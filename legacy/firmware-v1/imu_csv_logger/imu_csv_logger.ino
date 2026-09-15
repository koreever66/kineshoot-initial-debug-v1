#include "ICM_20948.h"

#define AD0_VAL 1

ICM_20948_I2C myICM;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("IMU_CSV_BOOT");

  Wire.begin(8, 9);
  Wire.setClock(100000);

  bool initialized = false;
  while (!initialized) {
    for (uint8_t ad0 = 0; ad0 <= 1; ad0++) {
      myICM.begin(Wire, ad0);
      Serial.print("Trying AD0_VAL=");
      Serial.print(ad0);
      Serial.print(" status=");
      Serial.println(myICM.statusString());

      if (myICM.status == ICM_20948_Stat_Ok) {
        initialized = true;
        break;
      }

      delay(250);
    }

    if (!initialized) {
      Serial.println("IMU init failed, retrying");
      delay(1000);
    }
  }

  Serial.println("IMU_READY");
  Serial.println("timestamp_ms,ax_mg,ay_mg,az_mg,gx_dps,gy_dps,gz_dps,temp_c");
}

void loop() {
  if (myICM.dataReady()) {
    unsigned long timestamp = millis();
    myICM.getAGMT();

    if (myICM.status != ICM_20948_Stat_Ok) {
      Serial.println("ERROR");
      delay(100);
      return;
    }

    Serial.print(timestamp);
    Serial.print(',');
    Serial.print(myICM.accX(), 2);
    Serial.print(',');
    Serial.print(myICM.accY(), 2);
    Serial.print(',');
    Serial.print(myICM.accZ(), 2);
    Serial.print(',');
    Serial.print(myICM.gyrX(), 2);
    Serial.print(',');
    Serial.print(myICM.gyrY(), 2);
    Serial.print(',');
    Serial.print(myICM.gyrZ(), 2);
    Serial.print(',');
    Serial.println(myICM.temp(), 2);

    delay(20);
  }
}
