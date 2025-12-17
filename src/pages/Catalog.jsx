import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importado useNavigate
import { Funnel, ShoppingCart, Eye, X, Tag, CircleWavyCheck } from "phosphor-react";

export function Catalog({ produtos, addToCart, onProductView }) {
  const navigate = useNavigate(); // Hook para navegação
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [precoMax, setPrecoMax] = useState(10000);
  const [ordenacao, setOrdenacao] = useState("padrao");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const categorias = useMemo(() => {
    const cats = produtos.map(p => p.categoria).filter(Boolean);
    return ["Todas", ...new Set(cats)];
  }, [produtos]);

  const maiorPrecoDisponivel = useMemo(() => Math.max(...produtos.map(p => p.preco), 5000), [produtos]);

  const produtosFiltrados = useMemo(() => {
    let lista = [...produtos];
    if (categoriaAtiva !== "Todas") lista = lista.filter(p => p.categoria === categoriaAtiva);
    lista = lista.filter(p => p.preco <= precoMax);
    
    switch (ordenacao) {
      case "menor": return lista.sort((a, b) => a.preco - b.preco);
      case "maior": return lista.sort((a, b) => b.preco - a.preco);
      case "az": return lista.sort((a, b) => a.nome.localeCompare(b.nome));
      default: return lista;
    }
  }, [produtos, categoriaAtiva, precoMax, ordenacao]);

  // Função para lidar com o clique no olho
  const handleViewProduct = (produto) => {
      onProductView(produto); // Mantém o registro nos "vistos recentemente"
      navigate(`/produto/${produto.id}`); // Navega para a página do produto
  };

  return (
    <div className="fade-in bg-light min-vh-100">
      <div className="bg-white border-bottom py-5 mb-4 position-relative overflow-hidden">
        <div className="container position-relative z-index-1">
            <h1 className="font-cinzel fw-bold display-5">Catálogo</h1>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small text-uppercase fw-bold text-muted">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Catálogo</li>
                </ol>
            </nav>
        </div>
        <div className="position-absolute top-0 end-0 opacity-10 p-5">
            <Tag size={200} />
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
            
            {/* SIDEBAR FILTROS */}
            <div className={`col-lg-3 ${sidebarAberta ? 'position-fixed top-0 start-0 h-100 bg-white z-index-modal p-4 shadow w-75' : 'd-none d-lg-block'}`} style={{zIndex: 1050}}>
                <div className="d-flex justify-content-between align-items-center mb-4 d-lg-none">
                    <h5 className="fw-bold m-0">Filtros</h5>
                    <button onClick={()=>setSidebarAberta(false)} className="btn btn-sm btn-light"><X size={20}/></button>
                </div>

                <div className="bg-white p-4 rounded border shadow-sm sticky-top" style={{top: '100px'}}>
                    <div className="mb-4">
                        <h6 className="font-cinzel fw-bold border-bottom pb-2 mb-3">Categorias</h6>
                        <div className="d-flex flex-column gap-2">
                            {categorias.map(cat => (
                                <label key={cat} className="d-flex align-items-center gap-2 cursor-pointer hover-text-accent">
                                    <input type="radio" name="categoria" className="form-check-input accent-color" checked={categoriaAtiva === cat} onChange={() => setCategoriaAtiva(cat)} />
                                    <span className={categoriaAtiva === cat ? "fw-bold text-dark" : "text-muted"}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6 className="font-cinzel fw-bold border-bottom pb-2 mb-3">Preço</h6>
                        <label className="form-label small text-muted d-flex justify-content-between">
                            <span>R$ 0</span>
                            <span className="fw-bold text-dark">R$ {precoMax.toLocaleString('pt-BR')}</span>
                        </label>
                        <input type="range" className="form-range" min="0" max={maiorPrecoDisponivel} step="50" value={precoMax} onChange={(e) => setPrecoMax(Number(e.target.value))} />
                    </div>

                    <button onClick={()=>{setCategoriaAtiva("Todas"); setPrecoMax(maiorPrecoDisponivel)}} className="btn btn-outline-dark btn-sm w-100 text-uppercase fw-bold">Limpar Filtros</button>
                </div>
            </div>

            {/* GRID PRODUTOS */}
            <div className="col-lg-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button className="btn btn-outline-dark d-lg-none d-flex align-items-center gap-2" onClick={()=>setSidebarAberta(!sidebarAberta)}><Funnel size={18}/> Filtros</button>
                    <span className="text-muted small fw-bold">{produtosFiltrados.length} resultados</span>
                    <select className="form-select bg-white border shadow-sm" style={{width: 'auto'}} value={ordenacao} onChange={(e)=>setOrdenacao(e.target.value)}>
                        <option value="padrao">Relevância</option>
                        <option value="menor">Menor Preço</option>
                        <option value="maior">Maior Preço</option>
                        <option value="az">A-Z</option>
                    </select>
                </div>

                {produtosFiltrados.length === 0 ? (
                    <div className="text-center py-5">
                        <h4 className="text-muted">Nenhum produto encontrado.</h4>
                        <button onClick={()=>{setCategoriaAtiva("Todas"); setPrecoMax(maiorPrecoDisponivel)}} className="btn btn-primary-custom mt-3">Ver Todos</button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {produtosFiltrados.map((produto) => (
                            <div className="col-md-6 col-xl-4" key={produto.id}>
                                <div className="card-custom h-100 bg-white border d-flex flex-column position-relative group hover-shadow transition-all">
                                    <div className="position-relative overflow-hidden" style={{height: '260px'}}>
                                        <Link to={`/produto/${produto.id}`}>
                                            <img src={produto.img} className="w-100 h-100 object-fit-cover transition-transform duration-700 hover-zoom" alt={produto.nome} />
                                        </Link>
                                        
                                        {/* ETIQUETAS INTELIGENTES */}
                                        <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
                                            {produto.estoque < 5 && <span className="badge bg-warning text-dark shadow-sm">Poucas Unidades</span>}
                                            {produto.id > 3 && <span className="badge bg-dark text-white shadow-sm">Novo</span>}
                                        </div>

                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-2 opacity-0 group-hover-opacity transition-opacity bg-gradient-to-t">
                                            {/* BOTÃO DO OLHO CORRIGIDO */}
                                            <button 
                                                onClick={() => handleViewProduct(produto)} 
                                                className="btn btn-light rounded-circle shadow-sm p-2 hover-scale" 
                                                title="Ver Detalhes"
                                            >
                                                <Eye size={20}/>
                                            </button>
                                            
                                            <button onClick={() => addToCart(produto)} className="btn btn-primary-custom rounded-circle shadow-sm p-2 hover-scale" title="Adicionar"><ShoppingCart size={20}/></button>
                                        </div>
                                    </div>

                                    <div className="p-3 d-flex flex-column flex-grow-1">
                                        <small className="text-muted text-uppercase mb-1" style={{fontSize: '10px'}}>{produto.categoria}</small>
                                        <h6 className="fw-bold mb-1 text-truncate"><Link to={`/produto/${produto.id}`} className="text-dark text-decoration-none">{produto.nome}</Link></h6>
                                        <div className="mt-auto d-flex justify-content-between align-items-end border-top pt-3 mt-3">
                                            <div>
                                                <span className="d-block text-muted text-decoration-line-through small" style={{fontSize: '11px'}}>R$ {(produto.preco * 1.2).toFixed(0)}</span>
                                                <span className="fw-bold text-primary-custom fs-5">R$ {produto.preco.toLocaleString('pt-BR')}</span>
                                            </div>
                                            <div className="text-success small" title="Vendedor Verificado"><CircleWavyCheck size={18} weight="fill"/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
        .group:hover .group-hover-opacity { opacity: 1 !important; }
        .hover-zoom:hover { transform: scale(1.08); }
        .bg-gradient-to-t { background: linear-gradient(to top, rgba(0,0,0,0.4), transparent); }
      `}</style>
    </div>
  );
}