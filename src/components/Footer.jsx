import { Link } from "react-router-dom";
import { FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo, MapPin, Phone, Envelope } from "phosphor-react";

export function Footer({ configLoja }) {
  const nome = configLoja?.nome || "Minha Loja Premium";
  const email = configLoja?.emailContato || "contato@minhaloja.com";
  const tel = configLoja?.telefone || "(11) 99999-9999";

  return (
    <footer className="bg-dark text-white py-5 border-top border-secondary">
      <div className="container">
        <div className="row g-5">
          {/* SOBRE */}
          <div className="col-lg-4 col-md-6">
            <h5 className="font-cinzel fw-bold mb-4 text-white">{nome}</h5>
            <p className="text-muted small lh-lg">
              Excelência e qualidade em cada detalhe. A nossa missão é oferecer produtos exclusivos com sustentabilidade e design superior.
            </p>
            <div className="d-flex gap-3 mt-4">
                <a href="#" className="text-white opacity-50 hover-opacity-100 transition-all"><FacebookLogo size={24}/></a>
                <a href="#" className="text-white opacity-50 hover-opacity-100 transition-all"><InstagramLogo size={24}/></a>
                <a href="#" className="text-white opacity-50 hover-opacity-100 transition-all"><TwitterLogo size={24}/></a>
            </div>
          </div>

          {/* LINKS RÁPIDOS */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold mb-4 small letter-spacing-1 text-white-50">Navegação</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-decoration-none text-muted hover-text-white transition-all">Home</Link></li>
              <li><Link to="/catalogo" className="text-decoration-none text-muted hover-text-white transition-all">Catálogo</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted hover-text-white transition-all">Sobre Nós</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted hover-text-white transition-all">Contacto</Link></li>
            </ul>
          </div>

          {/* AJUDA */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold mb-4 small letter-spacing-1 text-white-50">Suporte</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/tracking" className="text-decoration-none text-muted hover-text-white transition-all">Rastrear Pedido</Link></li>
              <li><Link to="/profile" className="text-decoration-none text-muted hover-text-white transition-all">Minha Conta</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted hover-text-white transition-all">FAQ</Link></li>
            </ul>
          </div>

          {/* CONTATO */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase fw-bold mb-4 small letter-spacing-1 text-white-50">Fale Connosco</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-muted">
                <li className="d-flex align-items-start gap-2">
                    <MapPin size={18} className="mt-1 flex-shrink-0"/>
                    <span>Av. Principal, 1000 - Centro<br/>São Paulo - SP</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                    <Phone size={18}/>
                    <span>{tel}</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                    <Envelope size={18}/>
                    <span>{email}</span>
                </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <small className="text-muted text-center text-md-start">
                &copy; {new Date().getFullYear()} {nome}. Todos os direitos reservados.
            </small>
            <div className="d-flex gap-3 opacity-50 grayscale">
                <span className="border px-2 py-1 rounded small text-white">VISA</span>
                <span className="border px-2 py-1 rounded small text-white">MASTER</span>
                <span className="border px-2 py-1 rounded small text-white">PIX</span>
            </div>
        </div>
      </div>
      <style>{`
        .hover-text-white:hover { color: #fff !important; padding-left: 5px; }
        .hover-opacity-100:hover { opacity: 1 !important; }
        .grayscale { filter: grayscale(100%); transition: all 0.3s; }
        .grayscale:hover { filter: grayscale(0%); opacity: 1 !important; }
      `}</style>
    </footer>
  );
}