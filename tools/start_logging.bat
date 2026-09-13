@echo off
set "PYTHONPATH=C:\Users\kore\imu_logger\pyserial"
"C:\Users\kore\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "C:\Users\kore\imu_logger\serial_logger.py" --port COM5 --seconds 30
pause
