# encoding: utf-8
import argparse
import csv
import os
import time
from datetime import datetime

import serial


DEFAULT_OUTPUT = r"C:\Users\kore\imu_logger\data"


def parse_args():
    parser = argparse.ArgumentParser(description="Save ICM-20948 CSV data from a serial port.")
    parser.add_argument("--port", default="COM5", help="Serial port, for example COM5")
    parser.add_argument("--baud", type=int, default=115200, help="Serial baud rate")
    parser.add_argument("--seconds", type=int, default=30, help="Recording duration in seconds")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Output directory or CSV file")
    return parser.parse_args()


def main():
    args = parse_args()
    os.makedirs(args.output, exist_ok=True) if not args.output.lower().endswith(".csv") else None
    if args.output.lower().endswith(".csv"):
        output_path = args.output
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
    else:
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(args.output, f"imu_{stamp}.csv")

    print(f"Opening {args.port} at {args.baud} baud")
    print(f"Saving to {output_path}")
    print(f"Recording for {args.seconds} seconds")

    rows = 0
    with serial.Serial(args.port, args.baud, timeout=1) as ser:
        try:
            ser.setDTR(False)
            ser.setRTS(False)
        except Exception:
            pass

        time.sleep(2)
        ser.reset_input_buffer()
        start = time.time()

        with open(output_path, "w", newline="", encoding="utf-8") as stream:
            writer = csv.writer(stream)
            writer.writerow([
                "timestamp_ms",
                "ax_mg",
                "ay_mg",
                "az_mg",
                "gx_dps",
                "gy_dps",
                "gz_dps",
                "temp_c",
            ])

            while time.time() - start < args.seconds:
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode("utf-8", errors="ignore").strip()
                parts = line.split(",")
                if len(parts) != 8 or not parts[0].isdigit():
                    continue
                writer.writerow(parts)
                stream.flush()
                rows += 1

    print(f"Done. Saved {rows} rows.")


if __name__ == "__main__":
    main()
