#include "ICM_20948.h"

#define AD0_VAL 1

ICM_20948_I2C myICM;

void setup() {
  Serial.begin(115200);

  Wire.begin(8, 9);
  Wire.setClock(100000);

  bool initialized = false;
  while (!initialized) {
    myICM.begin(Wire, AD0_VAL);

    if (myICM.status == ICM_20948_Stat_Ok) {
      initialized = true;
    } else {
      delay(500);
    }
  }

  Serial.println("IMU_PLOT_READY");
}

void loop() {
  if (myICM.dataReady()) {
    myICM.getAGMT();

    Serial.print("AX:");
    Serial.print(myICM.accX(), 1);
    Serial.print(" AY:");
    Serial.print(myICM.accY(), 1);
    Serial.print(" AZ:");
    Serial.print(myICM.accZ(), 1);

    Serial.print(" GX:");
    Serial.print(myICM.gyrX(), 1);
    Serial.print(" GY:");
    Serial.print(myICM.gyrY(), 1);
    Serial.print(" GZ:");
    Serial.print(myICM.gyrZ(), 1);

    Serial.println();
    delay(20);
  }
}
