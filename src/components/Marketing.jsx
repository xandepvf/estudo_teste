import { useState } from "react";
import { X, WhatsappLogo } from "phosphor-react";

export function TopBar() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;
  return (
    <div className="bg-dark text-white text-center py-2 small fw-bold position-relative fade-in" style={{zIndex: 1050}}>
      <span>🎉 USE O CUPOM: <span className="text-warning">BEMVINDO10</span> PARA 10% OFF</span>
      <button onClick={() => setVisivel(false)} className="btn btn-link text-white position-absolute top-50 end-0 translate-middle-y p-0 me-3"><X size={16}/></button>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="position-fixed bottom-0 end-0 m-4 bg-success text-white p-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center" style={{ zIndex: 1060, width: '60px', height: '60px' }}>
      <WhatsappLogo size={32} weight="fill" />
    </a>
  );
}