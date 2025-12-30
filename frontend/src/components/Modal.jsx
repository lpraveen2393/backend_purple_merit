export default function Modal({ open, onClose, onConfirm, text }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3 className="modal-title">Confirm Action</h3>
                <p className="modal-text">{text}</p>

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-btn confirm" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
