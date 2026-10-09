import CoreBluetooth
import Foundation

final class BluetoothController: NSObject, ObservableObject {
    static let serviceUUID = CBUUID(string: "6b1d0001-9a3f-4d2a-8f6f-6b1d00000001")
    static let commandUUID = CBUUID(string: "6b1d0002-9a3f-4d2a-8f6f-6b1d00000002")

    @Published private(set) var isReady = false
    @Published private(set) var statusText = "Checking Bluetooth"
    @Published private(set) var deviceName: String?
    @Published var errorMessage: String?

    private var central: CBCentralManager!
    private var peripheral: CBPeripheral?
    private var commandCharacteristic: CBCharacteristic?
    private var reconnectWorkItem: DispatchWorkItem?

    override init() {
        super.init()
        central = CBCentralManager(delegate: self, queue: nil)
    }

    func startScanning() {
        errorMessage = nil
        guard central.state == .poweredOn else {
            statusText = "Waiting for Bluetooth"
            return
        }

        reconnectWorkItem?.cancel()
        if let peripheral, peripheral.state == .connected {
            return
        }

        isReady = false
        statusText = "Scanning for KineShoot-Cam"
        central.scanForPeripherals(
            withServices: [Self.serviceUUID],
            options: [CBCentralManagerScanOptionAllowDuplicatesKey: false]
        )
    }

    @discardableResult
    func sendStartCapture() -> Bool {
        guard let peripheral, let commandCharacteristic else {
            errorMessage = "Device not connected; cannot start IMU capture."
            return false
        }

        peripheral.writeValue(Data([0x01]), for: commandCharacteristic, type: .withResponse)
        return true
    }

    @discardableResult
    func sendStartCapture(redDurationSeconds: UInt8) -> Bool {
        guard let peripheral, let commandCharacteristic else {
            errorMessage = "Device not connected; cannot start IMU capture."
            return false
        }
        let duration = min(max(redDurationSeconds, 1), 30)
        peripheral.writeValue(
            Data([0x03, duration]),
            for: commandCharacteristic,
            type: .withResponse
        )
        return true
    }

    @discardableResult
    func sendFatigueMarker(pairIndex: Int, phase: FatigueMarkerPhase) -> Bool {
        guard let peripheral, let commandCharacteristic else {
            errorMessage = "Device not connected; cannot send fatigue marker."
            return false
        }
        let pair = UInt8(min(max(pairIndex, 1), 10))
        let phaseValue: UInt8 = phase == .start ? 0 : 1
        peripheral.writeValue(
            Data([0x04, pair, phaseValue]),
            for: commandCharacteristic,
            type: .withoutResponse
        )
        return true
    }

    private func connect(_ peripheral: CBPeripheral) {
        self.peripheral = peripheral
        peripheral.delegate = self
        central.stopScan()
        isReady = false
        statusText = "Connecting to \(peripheral.name ?? "KineShoot")"
        central.connect(peripheral, options: nil)
    }

    private func scheduleReconnect() {
        reconnectWorkItem?.cancel()
        let item = DispatchWorkItem { [weak self] in
            self?.startScanning()
        }
        reconnectWorkItem = item
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0, execute: item)
    }
}

extension BluetoothController: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:
            startScanning()
        case .poweredOff:
            isReady = false
            statusText = "Bluetooth is off"
        case .unauthorized:
            isReady = false
            statusText = "Bluetooth permission denied"
            errorMessage = "Allow KineShoot to use Bluetooth in system settings."
        default:
            isReady = false
            statusText = "Bluetooth unavailable"
        }
    }

    func centralManager(
        _ central: CBCentralManager,
        didDiscover peripheral: CBPeripheral,
        advertisementData: [String: Any],
        rssi RSSI: NSNumber
    ) {
        let advertisedName = advertisementData[CBAdvertisementDataLocalNameKey] as? String
        let name = advertisedName ?? peripheral.name ?? ""
        guard name.hasPrefix("KineShoot") else {
            return
        }
        connect(peripheral)
    }

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        statusText = "Configuring KineShoot"
        peripheral.discoverServices([Self.serviceUUID])
    }

    func centralManager(
        _ central: CBCentralManager,
        didFailToConnect peripheral: CBPeripheral,
        error: Error?
    ) {
        isReady = false
        statusText = "Connection failed"
        errorMessage = error?.localizedDescription
        scheduleReconnect()
    }

    func centralManager(
        _ central: CBCentralManager,
        didDisconnectPeripheral peripheral: CBPeripheral,
        error: Error?
    ) {
        self.peripheral = peripheral
        commandCharacteristic = nil
        isReady = false
        statusText = "Device disconnected"
        scheduleReconnect()
    }
}

extension BluetoothController: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        if let error {
            errorMessage = error.localizedDescription
            return
        }

        guard let service = peripheral.services?.first(where: { $0.uuid == Self.serviceUUID }) else {
            statusText = "KineShoot service not found"
            return
        }

        peripheral.discoverCharacteristics([Self.commandUUID], for: service)
    }

    func peripheral(
        _ peripheral: CBPeripheral,
        didDiscoverCharacteristicsFor service: CBService,
        error: Error?
    ) {
        if let error {
            errorMessage = error.localizedDescription
            return
        }

        commandCharacteristic = service.characteristics?.first(where: {
            $0.uuid == Self.commandUUID && ($0.properties.contains(.write) || $0.properties.contains(.writeWithoutResponse))
        })

        isReady = commandCharacteristic != nil
        deviceName = peripheral.name
        statusText = isReady ? "Connected and ready" : "Command channel unavailable"
    }
}
