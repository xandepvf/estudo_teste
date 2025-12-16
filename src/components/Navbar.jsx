import { ShoppingBag, List, X, MagnifyingGlass, PlusCircle, Heart, User, SignIn } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Agora recebe 'produtos'
export function Navbar({ cartCount, favCount, onSearch, userLogado, produtos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Lógica da Live Search
  useEffect(() => {
    if (termo.length > 1 && produtos) {
      const filtrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo.toLowerCase())
      ).slice(0, 5); // Limita a 5 sugestões
      setSugestoes(filtrados);
      setShowSugestoes(true);
    } else {
      setShowSugestoes(false);
    }
  }, [termo, produtos]);

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSugestoes(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if(e.key === 'Enter' || e.type === 'click') {
        onSearch(termo);
        setShowSugestoes(false);
        navigate("/catalogo");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-3 border-bottom" style={{ backgroundColor: 'rgba(253, 251, 247, 0.95)', backdropFilter: 'blur(10px)' }}>
      <div className="container">
        <Link className="navbar-brand fs-4 font-cinzel" to="/">ATELIER <span style={{ color: 'var(--accent-color)' }}>WOOD</span></Link>
        
        <button className="navbar-toggler border-0" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <List size={28} color="#4a3b32"/>}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''} justify-content-end`}>
          
          {/* BARRA DE BUSCA INTELIGENTE */}
          <div className="mx-lg-auto my-3 my-lg-0 position-relative w-50" ref={searchRef}>
            <input 
                type="text" 
                className="form-control rounded-pill border-0 bg-light ps-5 py-2" 
                placeholder="Buscar móveis..." 
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                onKeyDown={handleSearchSubmit}
            />
            <MagnifyingGlass size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{cursor:'pointer'}} onClick={handleSearchSubmit}/>
            
            {/* DROPDOWN DE SUGESTÕES */}
            {showSugestoes && (
                <div className="position-absolute w-100 bg-white shadow-lg rounded mt-2 overflow-hidden fade-in" style={{zIndex: 1000}}>
                    {sugestoes.length > 0 ? (
                        sugestoes.map(prod => (
                            <Link 
                                key={prod.id} 
                                to={`/produto/${prod.id}`} 
                                className="d-flex align-items-center gap-3 p-2 text-decoration-none text-dark hover-bg-light border-bottom"
                                onClick={() => setShowSugestoes(false)}
                            >
                                <img src={prod.img} width="40" height="40" className="rounded object-fit-cover" />
                                <div>
                                    <small className="d-block fw-bold">{prod.nome}</small>
                                    <small className="text-muted">R$ {prod.preco.toLocaleString('pt-BR')}</small>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-3 text-muted small text-center">Nenhum produto encontrado.</div>
                    )}
                    {sugestoes.length > 0 && (
                        <div className="p-2 text-center bg-light">
                            <small className="text-muted fw-bold" style={{cursor:'pointer'}} onClick={handleSearchSubmit}>Ver todos os resultados</small>
                        </div>
                    )}
                </div>
            )}
          </div>

          <ul className="navbar-nav align-items-center gap-3 text-uppercase small fw-bold">
            <li className="nav-item"><Link className="nav-link text-dark" to="/catalogo">Coleção</Link></li>
            
            {userLogado ? (
                <li className="nav-item">
                   <Link to="/profile" className="btn btn-outline-dark btn-sm rounded-pill d-flex align-items-center gap-2 px-3 border-0 bg-light">
                      <User size={18} weight="fill"/> 
                      <span className="d-none d-lg-inline">{userLogado.nome.split(' ')[0]}</span>
                   </Link>
                </li>
            ) : (
                <li className="nav-item">
                   <Link to="/login" className="btn btn-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
                      <SignIn size={18}/> Entrar
                   </Link>
                </li>
            )}

            {(userLogado && userLogado.tipo === 'admin') && (
              <li className="nav-item d-none d-lg-block"><Link className="btn btn-light btn-sm rounded-circle p-2" to="/admin"><PlusCircle size={20}/></Link></li>
            )}

            <li className="nav-item">
              <Link to="/wishlist" className="position-relative btn p-0 ms-2">
                <Heart size={28} color="#4a3b32" />
                {favCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark d-flex align-items-center justify-content-center" style={{width:'18px', height:'18px', fontSize:'9px'}}>{favCount}</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/carrinho" className="position-relative btn p-0 ms-2">
                <ShoppingBag size={28} color="#4a3b32" weight="thin" />
                {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger d-flex align-items-center justify-content-center" style={{width:'18px', height:'18px', fontSize:'9px'}}>{cartCount}</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}