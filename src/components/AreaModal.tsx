// src/components/AreaModal.tsx
import "./AreaModal.css";


interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  density: string;
  onInputClick?: () => void; // Optional action for the green button
}

export default function useAreaModal({ 
  isOpen, 
  onClose, 
  name, 
  density, 
  onInputClick 
}: AreaModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="area-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="title-row">
            <span className="star-icon">☆</span>
            <h2>{name}</h2>
          </div>
          
          <div className={`badge ${density.toLowerCase()}`}>
            ● {density} Crowd Level
          </div>
          
          <button className="input-btn" onClick={onInputClick}>
            + Input Crowd Level
          </button>
        </div>
      </div>
    </div>
  );
}