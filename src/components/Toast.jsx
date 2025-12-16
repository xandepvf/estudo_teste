import { useEffect } from "react";
import { CheckCircle, X } from "phosphor-react";

export function Toast({ msg, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1050 }}>
      <div className="bg-dark text-white p-3 rounded shadow-lg d-flex align-items-center gap-3 fade-in-up">
        <CheckCircle size={24} className="text-success" weight="fill" />
        <span className="fw-bold">{msg}</span>
        <button onClick={onClose} className="btn btn-link text-white p-0"><X size={20}/></button>
      </div>
    </div>
  );
}