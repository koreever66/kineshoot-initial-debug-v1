import SwiftUI

struct FatigueMarkerButton: View {
    let pairIndex: Int
    let phase: FatigueMarkerPhase
    let action: () -> Void

    var body: some View {
        PressDownButton(action: action) {
            HStack(spacing: 10) {
                Image(systemName: phase == .start ? "play.fill" : "stop.fill")
                    .font(.headline)
                VStack(alignment: .leading, spacing: 2) {
                    Text("第 \(pairIndex) 球")
                        .font(.caption.bold())
                    Text(phase == .start ? "标记开始" : "标记结束")
                        .font(.headline)
                }
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 18)
            .padding(.vertical, 10)
            .background(Color.black.opacity(0.58), in: Capsule())
            .overlay(Capsule().stroke(.white.opacity(0.4), lineWidth: 1))
        }
    }
}

private struct PressDownButton<Label: View>: View {
    let action: () -> Void
    let label: Label

    @State private var isPressed = false

    init(action: @escaping () -> Void, @ViewBuilder label: () -> Label) {
        self.action = action
        self.label = label()
    }

    var body: some View {
        label
            .scaleEffect(isPressed ? 0.96 : 1)
            .animation(.easeOut(duration: 0.08), value: isPressed)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        guard !isPressed else {
                            return
                        }
                        isPressed = true
                        action()
                    }
                    .onEnded { _ in
                        isPressed = false
                    }
            )
            .accessibilityAddTraits(.isButton)
    }
}

struct FatigueBurstReviewSheet: View {
    @State private var draft: FatigueBurstDraft
    let onSave: (FatigueBurstDraft) -> Void
    let onCancel: () -> Void

    init(
        initialDraft: FatigueBurstDraft,
        onSave: @escaping (FatigueBurstDraft) -> Void,
        onCancel: @escaping () -> Void
    ) {
        _draft = State(initialValue: initialDraft)
        self.onSave = onSave
        self.onCancel = onCancel
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("第 \(draft.burstNo) 组疲劳采集") {
                    Stepper(
                        "本组投篮数：\(draft.shotCount)",
                        value: Binding(
                            get: { draft.shotCount },
                            set: { newValue in
                                draft.shotCount = newValue
                                syncShots(to: newValue)
                            }
                        ),
                        in: 1...10
                    )
                    if let statusNote = draft.statusNote, !statusNote.isEmpty {
                        Text(statusNote == "marker_incomplete" ? "存在开始/结束标记未成对，保存后需复核" : statusNote)
                            .font(.footnote)
                            .foregroundStyle(.orange)
                    }
                }

                ForEach(draft.shots.indices, id: \.self) { index in
                    Section("第 \(index + 1) 球") {
                        Picker("结果", selection: resultBinding(index: index)) {
                            Text("进").tag(ShotResult.made)
                            Text("不进").tag(ShotResult.missed)
                        }
                        .pickerStyle(.segmented)

                        Toggle("废掉本球", isOn: invalidBinding(index: index))

                        if draft.shots[index].dataValidity == .invalid {
                            Picker("废掉原因", selection: reasonBinding(index: index)) {
                                ForEach(InvalidReason.allCases) { reason in
                                    Text(reason.title).tag(reason)
                                }
                            }
                        }

                        TextField("备注", text: notesBinding(index: index))
                            .textInputAutocapitalization(.never)
                    }
                }

                Section {
                    Button(role: .destructive) {
                        for index in draft.shots.indices {
                            draft.shots[index].dataValidity = .invalid
                            draft.shots[index].invalidReasons = [.processError]
                        }
                    } label: {
                        Label("本组全部作废", systemImage: "xmark.circle")
                    }
                }
            }
            .navigationTitle("疲劳组标记")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消", action: onCancel)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("保存") {
                        onSave(draft)
                    }
                    .disabled(!canSave)
                }
            }
        }
    }

    private var canSave: Bool {
        !draft.shots.isEmpty && draft.shots.allSatisfy {
            $0.dataValidity == .invalid || $0.shotResult != .undecided
        }
    }

    private func syncShots(to count: Int) {
        if count < draft.shots.count {
            draft.shots.removeLast(draft.shots.count - count)
        } else if count > draft.shots.count {
            for pairIndex in (draft.shots.count + 1)...count {
                draft.shots.append(FatigueShotDraft(pairIndex: pairIndex))
            }
        }
    }

    private func resultBinding(index: Int) -> Binding<ShotResult> {
        Binding(
            get: { draft.shots[index].shotResult },
            set: { draft.shots[index].shotResult = $0 }
        )
    }

    private func invalidBinding(index: Int) -> Binding<Bool> {
        Binding(
            get: { draft.shots[index].dataValidity == .invalid },
            set: { isInvalid in
                draft.shots[index].dataValidity = isInvalid ? .invalid : .valid
                if !isInvalid {
                    draft.shots[index].invalidReasons = []
                } else if draft.shots[index].invalidReasons.isEmpty {
                    draft.shots[index].invalidReasons = [.processError]
                }
            }
        )
    }

    private func reasonBinding(index: Int) -> Binding<InvalidReason> {
        Binding(
            get: { draft.shots[index].invalidReasons.first ?? .processError },
            set: { draft.shots[index].invalidReasons = [$0] }
        )
    }

    private func notesBinding(index: Int) -> Binding<String> {
        Binding(
            get: { draft.shots[index].notes },
            set: { draft.shots[index].notes = $0 }
        )
    }
}
