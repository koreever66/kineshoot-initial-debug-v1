# 投篮发力链项目：初版硬件调试

本仓库只保存 ESP32-S3 与 ICM-20948 的硬件到货、焊接、接线、固件和第一轮数据采集内容。

不包含此前的项目计划书、商业计划、比赛报名资料和商品采购截图。

## 当前软件入口

- 软件仓库：`https://github.com/koreever66/kineshoot-initial-debug-v2`
- 软件分支：`codex/software-data`
- 软件提交：`276b312114518059409948a930539b79a12bb5ca`
- 当前基线：`KB-2026-09-15-H1-F4-I1`

本硬件仓库中的 `legacy/` 只保留旧 v1 固件、工具和数据，不用于当前采集。

## 当前基线

```text
software_baseline_id = KB-2026-09-15-H1-F4-I1
software_repository  = koreever66/kineshoot-initial-debug-v2
software_branch      = codex/software-data
software_commit      = 276b312114518059409948a930539b79a12bb5ca
interface_revision   = I1
hardware_revision    = H2
```

当前硬件接口：

```text
VCC  -> 3V3
GND  -> GND
ICM SDI/SDA  -> GPIO8
ICM SCLK/SCL -> GPIO9
NCS  -> 3V3
AD0  -> GND
I2C address = 0x68
I2C clock   = 50kHz
WHO_AM_I    = 0xEA
```

详细说明见：

- `docs/hardware/SOFTWARE_BASELINE.md`
- `docs/hardware/H2_HANDOFF.md`
- `docs/hardware/H2_ASSEMBLY_RUNBOOK.md`
- `docs/hardware/SOFTWARE_SYNC_2026-09-19.md`
- `docs/hardware/H2_BOM.csv`
- `docs/hardware/WEARABLE_DIMENSIONS.md`
- `docs/hardware/ORDER_RECEIPTS_2026-09-15.md`
- `docs/hardware/DAILY_DEBUG_SUMMARY_2026-09-16.md`
- `reference/software-baseline/`

## 当前硬件

- ESP32-S3-DevKitC-1，N16R8
- ICM-20948 九轴传感器模块
- 面包板和杜邦线
- USB 数据线
- 602535 500mAh 受保护锂电池 ×2
- TP4057-500mA 充电板 ×2
- TPS61088 固定 5V 升压模块 ×1
- SS-12E07G4 3A 开关和 SS12D07VG4 备用开关
- PH2.0 2P/4P 连接器、26AWG 红黑柔性线、热缩管
- 传感器盒、前臂软袋、EVA 泡棉、腕带和前臂绑带
- 电脑：Windows，Arduino IDE 2.3.10

## 目录

```text
legacy/firmware-v1/imu_plotter/     早期串口实时曲线固件
legacy/firmware-v1/imu_csv_logger/  早期 CSV 数据采集固件
legacy/tools-v1/                    早期串口采集和 CSV 绘图脚本
legacy/data-v1/                     早期原始 CSV 数据
legacy/plots-v1/                    早期 CSV 生成的曲线图
photos/                     焊接和面包板接线照片
DEBUG_NOTES.md              问题、解决思路和结果记录
docs/hardware/              H2 固定接口、BOM、装配和测试方案
reference/software-baseline/ 软件固定提交的只读参考文件
```

## 当前状态

- 面包板阶段已经完成 ESP32-S3 与 ICM-20948 通信验证。
- 历史阶段出现过 `0x68`、`0x69`、`0x0C` 和 `100kHz`，这些不再作为当前实现目标。
- 当前接口固定为 `0x68`、`50kHz`、`WHO_AM_I=0xEA`。
- 当前软件基线为 F4，使用 10 秒 RAM 记录、LittleFS 批量写入和 BOOT 键触发。
- H2 物料已于 2026-09-18 到齐；首版主电源路径为 `电池 -> TP4057 -> SS-12E07G4 3A 开关 -> TPS61088 固定 5V -> ESP32 5V`，不使用 P-MOS。
- H2 已进入实体装配和电气验证阶段；照片、万用表和静止/动态测试尚未完成。

## 下一步

1. 按 `docs/hardware/H2_ASSEMBLY_RUNBOOK.md` 先做电池、TP4057 的断电通断检查和独立充电测试。
2. 按 `docs/hardware/H2_HANDOFF.md` 焊接 PH2.0 和柔性线束；固定 NCS=3V3、AD0=GND。
3. 先只用 USB 验证 `0x68` 和 `WHO_AM_I=0xEA`，再接入升压电源链。
4. 完成腕部固定、前臂固定和应力释放。
5. 完成 10 秒静止测试和小幅动态测试。
6. 提交 H2 照片、测试结果和已知风险。
