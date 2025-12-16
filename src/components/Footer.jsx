import { Link } from "react-router-dom";
import { InstagramLogo, FacebookLogo, WhatsappLogo } from "phosphor-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6">
            <h4 className="font-cinzel mb-4">ATELIER WOOD</h4>
            <p className="small opacity-75 mb-4 line-height-lg">Móveis com design autoral, produzidos artesanalmente. Transformando casas em lares desde 1995.</p>
            <div className="d-flex gap-3"><InstagramLogo size={24}/><FacebookLogo size={24}/><WhatsappLogo size={24}/></div>
          </div>
          <div className="col-lg-2 col-md-6 offset-lg-1">
            <h6 className="text-uppercase mb-3 fw-bold text-warning letter-spacing-1">Loja</h6>
            <ul className="list-unstyled small opacity-75 d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-white-50 hover-white">Início</Link></li>
              <li><Link to="/catalogo" className="text-decoration-none text-white-50 hover-white">Catálogo</Link></li>
              <li><Link to="/tracking" className="text-decoration-none text-white-50 hover-white">Rastrear Pedido</Link></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase mb-3 fw-bold text-warning letter-spacing-1">Institucional</h6>
            <ul className="list-unstyled small opacity-75 d-flex flex-column gap-2">
              <li><Link to="/about" className="text-decoration-none text-white-50 hover-white">Sobre Nós</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-white-50 hover-white">Contato</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase mb-3 fw-bold text-warning letter-spacing-1">Atendimento</h6>
            <p className="fw-bold text-white mb-0">(11) 99999-9999</p>
            <p className="small opacity-75">contato@atelierwood.com.br</p>
          </div>
        </div>
        <hr className="border-secondary my-4 opacity-25"/>
        <div className="text-center small opacity-50"><p className="mb-0">&copy; 2025 Atelier Wood.</p></div>
      </div>
    </footer>
  )
}