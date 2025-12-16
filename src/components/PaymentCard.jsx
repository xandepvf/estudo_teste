import { useMemo } from "react";

// Componente Visual do Cartão de Crédito
export function PaymentCard({ numero, nome, validade, cvv, focado }) {
  
  // Deteta a bandeira baseada no número
  const bandeira = useMemo(() => {
    const n = numero.replace(/\D/g, '');
    if (n.startsWith("4")) return "VISA";
    if (n.startsWith("5")) return "MASTERCARD";
    if (n.startsWith("3")) return "AMEX";
    return "CARTÃO";
  }, [numero]);

  const bgGradient = bandeira === "VISA" 
    ? "linear-gradient(135deg, #1a1f71 0%, #00a4e4 100%)" // Azul Visa
    : bandeira === "MASTERCARD" 
    ? "linear-gradient(135deg, #f79e1b 0%, #eb001b 100%)" // Laranja Master
    : "linear-gradient(135deg, #2c3e50 0%, #000000 100%)"; // Preto Padrão

  return (
    <div className="perspective-1000 w-100" style={{ height: '220px', perspective: '1000px' }}>
      <div 
        className="position-relative w-100 h-100 shadow-lg rounded-4 transition-transform duration-700"
        style={{
            transformStyle: 'preserve-3d',
            transform: focado === 'cvv' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}
      >
        {/* --- FRENTE --- */}
        <div 
            className="position-absolute w-100 h-100 rounded-4 p-4 text-white d-flex flex-column justify-content-between overflow-hidden"
            style={{ 
                background: bgGradient, 
                backfaceVisibility: 'hidden',
                zIndex: 2
            }}
        >
            {/* Efeito de brilho/holograma */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 60%)'}}></div>

            <div className="d-flex justify-content-between align-items-start">
                {/* Chip Simulado */}
                <div className="bg-warning bg-gradient rounded-2 border border-warning border-opacity-50" style={{width: '50px', height: '35px', opacity: 0.8}}>
                    <div className="w-100 h-100 position-relative">
                        <div className="position-absolute top-50 start-0 w-100 border-top border-dark opacity-25"></div>
                        <div className="position-absolute top-0 start-50 h-100 border-start border-dark opacity-25"></div>
                        <div className="position-absolute top-50 start-50 translate-middle rounded-circle border border-dark opacity-25" style={{width: '20px', height: '20px'}}></div>
                    </div>
                </div>
                <span className="fw-bold font-monospace fs-5 fst-italic opacity-75">{bandeira}</span>
            </div>

            <div className="mt-2">
                <label className="small text-uppercase opacity-75" style={{fontSize: '10px'}}>Número do Cartão</label>
                <div className="fs-3 font-monospace fw-bold text-shadow letter-spacing-2">
                    {numero || "•••• •••• •••• ••••"}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-end">
                <div className="w-75">
                    <label className="small text-uppercase opacity-75" style={{fontSize: '10px'}}>Nome do Titular</label>
                    <div className="fw-bold text-uppercase text-truncate text-shadow">
                        {nome || "NOME DO TITULAR"}
                    </div>
                </div>
                <div className="text-end">
                    <label className="small text-uppercase opacity-75" style={{fontSize: '10px'}}>Validade</label>
                    <div className="fw-bold font-monospace text-shadow">
                        {validade || "MM/AA"}
                    </div>
                </div>
            </div>
        </div>

        {/* --- VERSO --- */}
        <div 
            className="position-absolute w-100 h-100 rounded-4 bg-dark text-white overflow-hidden"
            style={{ 
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #434343 0%, #000000 100%)'
            }}
        >
            <div className="bg-black w-100 mt-4" style={{height: '45px'}}></div>
            <div className="p-4">
                <label className="small text-uppercase opacity-75 ms-1">CVV</label>
                <div className="bg-white text-dark p-2 rounded fw-bold text-end font-monospace d-flex justify-content-end align-items-center" style={{height: '40px'}}>
                    {cvv || "•••"}
                </div>
                <p className="mt-3 small opacity-50 text-center" style={{fontSize: '10px'}}>
                    Este cartão é propriedade do banco emissor. O uso deste cartão implica na aceitação dos termos de contrato.
                </p>
                <div className="d-flex justify-content-end mt-2 opacity-50">
                    <span className="fst-italic fw-bold">{bandeira}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}