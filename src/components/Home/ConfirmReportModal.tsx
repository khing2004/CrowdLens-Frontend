import "./ConfirmReportModal.css";

interface ConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  level: string;
}

export default function ConfirmReportModal({ isOpen, onClose, onConfirm, level }: ConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay secondary" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Report</h3>
        <p>Are you sure the crowd level is <strong>{level}</strong>?</p>
        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onClose}>Change</button>
          <button className="confirm-btn" onClick={onConfirm}>Yes, Submit</button>
        </div>
      </div>
    </div>
  );
}