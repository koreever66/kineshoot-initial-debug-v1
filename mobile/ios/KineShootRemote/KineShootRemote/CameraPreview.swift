import AVFoundation
import SwiftUI
import UIKit

struct CameraPreview: UIViewRepresentable {
    let session: AVCaptureSession
    let onFocusRequested: (CGPoint) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.videoPreviewLayer.session = session
        view.videoPreviewLayer.videoGravity = .resizeAspectFill
        if let connection = view.videoPreviewLayer.connection,
           connection.isVideoOrientationSupported {
            connection.videoOrientation = .portrait
        }

        let tapGesture = UITapGestureRecognizer(
            target: context.coordinator,
            action: #selector(Coordinator.handleTap(_:))
        )
        tapGesture.cancelsTouchesInView = false
        view.addGestureRecognizer(tapGesture)
        return view
    }

    func updateUIView(_ uiView: PreviewView, context: Context) {
        context.coordinator.parent = self
        uiView.videoPreviewLayer.session = session
        if let connection = uiView.videoPreviewLayer.connection,
           connection.isVideoOrientationSupported {
            connection.videoOrientation = .portrait
        }
    }

    final class Coordinator: NSObject {
        var parent: CameraPreview

        init(_ parent: CameraPreview) {
            self.parent = parent
        }

        @objc func handleTap(_ recognizer: UITapGestureRecognizer) {
            guard let view = recognizer.view as? PreviewView else {
                return
            }

            let previewPoint = recognizer.location(in: view)
            let devicePoint = view.videoPreviewLayer
                .captureDevicePointConverted(fromLayerPoint: previewPoint)
            view.showFocusIndicator(at: previewPoint)
            parent.onFocusRequested(devicePoint)
        }
    }
}

final class PreviewView: UIView {
    override class var layerClass: AnyClass {
        AVCaptureVideoPreviewLayer.self
    }

    var videoPreviewLayer: AVCaptureVideoPreviewLayer {
        layer as! AVCaptureVideoPreviewLayer
    }

    private let focusIndicator = UIView()

    override init(frame: CGRect) {
        super.init(frame: frame)
        configureFocusIndicator()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configureFocusIndicator()
    }

    func showFocusIndicator(at point: CGPoint) {
        let size = CGSize(width: 64, height: 64)
        let x = min(max(point.x - size.width / 2, 0), max(0, bounds.width - size.width))
        let y = min(max(point.y - size.height / 2, 0), max(0, bounds.height - size.height))
        focusIndicator.frame = CGRect(origin: CGPoint(x: x, y: y), size: size)
        focusIndicator.transform = CGAffineTransform(scaleX: 1.25, y: 1.25)
        focusIndicator.alpha = 1

        UIView.animate(
            withDuration: 0.18,
            animations: {
                self.focusIndicator.transform = .identity
            },
            completion: { _ in
                UIView.animate(
                    withDuration: 0.45,
                    delay: 0.55,
                    options: [.curveEaseOut],
                    animations: {
                        self.focusIndicator.alpha = 0
                    }
                )
            }
        )
    }

    private func configureFocusIndicator() {
        focusIndicator.isUserInteractionEnabled = false
        focusIndicator.layer.borderWidth = 2
        focusIndicator.layer.borderColor = UIColor.systemYellow.cgColor
        focusIndicator.layer.cornerRadius = 8
        focusIndicator.alpha = 0
        addSubview(focusIndicator)
    }
}
