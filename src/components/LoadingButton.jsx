import { CircleNotch } from "phosphor-react";

export function LoadingButton({ isLoading, children, className = "", ...props }) {
  return (
    <button 
      className={`btn d-flex align-items-center justify-content-center gap-2 ${className} ${isLoading ? 'disabled' : ''}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <CircleNotch size={20} className="animate-spin" /> Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

// OBS: Adicione isso no seu theme.css para o spinner girar:
// .animate-spin { animation: spin 1s linear infinite; }
// @keyframes spin { 100% { transform: rotate(360deg); } }