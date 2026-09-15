# encoding: utf-8
import argparse
import csv
import os

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def parse_args():
    parser = argparse.ArgumentParser(description="Plot an ICM-20948 CSV file.")
    parser.add_argument("csv_file")
    return parser.parse_args()


def main():
    args = parse_args()
    csv_file = os.path.abspath(args.csv_file)
    output_png = os.path.splitext(csv_file)[0] + "_plot.png"

    with open(csv_file, "r", encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))

    if not rows:
        raise SystemExit("CSV has no data rows.")

    timestamps = [int(row["timestamp_ms"]) for row in rows]
    start = timestamps[0]
    time_s = [(value - start) / 1000.0 for value in timestamps]

    ax = [float(row["ax_mg"]) for row in rows]
    ay = [float(row["ay_mg"]) for row in rows]
    az = [float(row["az_mg"]) for row in rows]
    gx = [float(row["gx_dps"]) for row in rows]
    gy = [float(row["gy_dps"]) for row in rows]
    gz = [float(row["gz_dps"]) for row in rows]
    temp = [float(row["temp_c"]) for row in rows]

    fig, axes = plt.subplots(2, 2, figsize=(13, 8), constrained_layout=True)
    fig.suptitle("ICM-20948 Sensor Record", fontsize=16)

    axes[0, 0].plot(time_s, ax, label="AX")
    axes[0, 0].plot(time_s, ay, label="AY")
    axes[0, 0].plot(time_s, az, label="AZ")
    axes[0, 0].set_title("Acceleration (mg)")
    axes[0, 0].set_xlabel("Time (s)")
    axes[0, 0].grid(True, alpha=0.3)
    axes[0, 0].legend()

    axes[0, 1].plot(time_s, gx, label="GX")
    axes[0, 1].plot(time_s, gy, label="GY")
    axes[0, 1].plot(time_s, gz, label="GZ")
    axes[0, 1].set_title("Angular Velocity (deg/s)")
    axes[0, 1].set_xlabel("Time (s)")
    axes[0, 1].grid(True, alpha=0.3)
    axes[0, 1].legend()

    acc_mag = [(x * x + y * y + z * z) ** 0.5 for x, y, z in zip(ax, ay, az)]
    gyro_mag = [(x * x + y * y + z * z) ** 0.5 for x, y, z in zip(gx, gy, gz)]
    axes[1, 0].plot(time_s, acc_mag, color="tab:green")
    axes[1, 0].set_title("Acceleration Magnitude (mg)")
    axes[1, 0].set_xlabel("Time (s)")
    axes[1, 0].grid(True, alpha=0.3)

    axes[1, 1].plot(time_s, gyro_mag, color="tab:red")
    axes[1, 1].set_title("Gyroscope Magnitude (deg/s)")
    axes[1, 1].set_xlabel("Time (s)")
    axes[1, 1].grid(True, alpha=0.3)

    fig.savefig(output_png, dpi=160)

    duration = time_s[-1] if len(time_s) > 1 else 0.0
    intervals = [
        (timestamps[index] - timestamps[index - 1]) / 1000.0
        for index in range(1, len(timestamps))
    ]
    average_interval = sum(intervals) / len(intervals) if intervals else 0.0
    rate = 1.0 / average_interval if average_interval > 0 else 0.0

    print(f"Rows: {len(rows)}")
    print(f"Duration: {duration:.2f} s")
    print(f"Average interval: {average_interval:.3f} s")
    print(f"Average sample rate: {rate:.2f} Hz")
    print(f"Plot: {output_png}")


if __name__ == "__main__":
    main()
