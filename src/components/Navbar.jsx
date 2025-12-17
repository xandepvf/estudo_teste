import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, MagnifyingGlass, List, Gear } from "phosphor-react";

export function Navbar({ cartCount, favCount, onSearch, userLogado, configLoja }) {
  // Usa o nome configurado ou um padrão
  const nomeLoja = configLoja?.nome || "Minha Loja";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-3 shadow-sm transition-all">
      <div className="container">
        <Link className="navbar-brand font-cinzel fw-bold fs-3 letter-spacing-1 d-flex align-items-center gap-2" to="/">
            {nomeLoja} <span className="text-accent">.</span>
        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <List size={24} />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-bold small text-uppercase gap-3">
            <li className="nav-item"><Link to="/" className="nav-link text-dark hover-text-accent">Home</Link></li>
            <li className="nav-item"><Link to="/catalogo" className="nav-link text-dark hover-text-accent">Catálogo</Link></li>
            <li className="nav-item">
                <Link to="/admin" className="nav-link text-danger hover-text-accent d-flex align-items-center gap-1">
                    <Gear size={18} weight="fill"/> Admin
                </Link>
            </li>
            <li className="nav-item"><Link to="/about" className="nav-link text-dark hover-text-accent">Sobre</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link text-dark hover-text-accent">Contato</Link></li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <div className="input-group d-none d-lg-flex" style={{width: '200px'}}>
                <span className="input-group-text bg-light border-end-0"><MagnifyingGlass size={16}/></span>
                <input 
                    className="form-control bg-light border-start-0 ps-0" 
                    placeholder="Buscar..." 
                    style={{fontSize: '0.85rem'}}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <Link to="/wishlist" className="position-relative text-dark hover-scale" title="Meus Favoritos">
              <Heart size={24} />
              {favCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{fontSize: '0.6rem'}}>{favCount}</span>}
            </Link>
            
            <Link to="/carrinho" className="position-relative text-dark hover-scale" title="Meu Carrinho">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark border border-white" style={{fontSize: '0.6rem'}}>{cartCount}</span>}
            </Link>
            
            <div className="vr h-50 mx-1 d-none d-lg-block"></div>

            {userLogado ? (
                <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none text-dark hover-bg-light p-1 rounded transition-all">
                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'32px', height:'32px'}}>
                        <span className="fw-bold small">{userLogado.nome.charAt(0)}</span>
                    </div>
                    <span className="d-none d-lg-block small fw-bold">Conta</span>
                </Link>
            ) : (
                <Link to="/login" className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold d-flex align-items-center gap-2">
                    <User size={16}/> Entrar
                </Link>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .hover-text-accent:hover { color: var(--accent) !important; }
      `}</style>
    </nav>
  );
}