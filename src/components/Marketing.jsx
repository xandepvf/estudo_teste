import { useState, useEffect } from "react";
import { X, WhatsappLogo, Timer } from "phosphor-react";

export function TopBar() {
  const [visivel, setVisivel] = useState(true);
  const [tempoRestante, setTempoRestante] = useState({ horas: 5, minutos: 0, segundos: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev.segundos > 0) return { ...prev, segundos: prev.segundos - 1 };
        if (prev.minutos > 0) return { ...prev, minutos: prev.minutos - 1, segundos: 59 };
        if (prev.horas > 0) return { ...prev, horas: prev.horas - 1, minutos: 59, segundos: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!visivel) return null;

  return (
    <div className="bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center small fade-in" style={{zIndex: 1050}}>
      <div className="d-flex align-items-center gap-2 mx-auto">
        <Timer className="text-warning animate-pulse" size={18} />
        <span className="fw-bold text-uppercase letter-spacing-1">Oferta Relâmpago:</span>
        <span>Frete Grátis para todo o Brasil nas próximas</span>
        <span className="font-monospace bg-white text-dark px-1 rounded fw-bold">
            {String(tempoRestante.horas).padStart(2, '0')}:
            {String(tempoRestante.minutos).padStart(2, '0')}:
            {String(tempoRestante.segundos).padStart(2, '0')}
        </span>
      </div>
      <button onClick={() => setVisivel(false)} className="btn btn-link text-white p-0" aria-label="Fechar">
        <X size={16} />
      </button>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/5511999999999" 
      target="_blank" 
      rel="noreferrer"
      className="position-fixed bottom-0 start-0 m-4 btn btn-success rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center hover-scale z-index-modal border-white border-2"
      style={{width:'60px', height:'60px'}}
      title="Falar no WhatsApp"
    >
      <WhatsappLogo size={32} weight="fill" />
    </a>
  );
}