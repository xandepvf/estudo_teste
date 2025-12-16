import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Funnel, SortAscending, SortDescending, ShoppingCart, Eye, Heart, X } from "phosphor-react";

export function Catalog({ produtos, addToCart, onProductView }) {
  // --- ESTADOS DE FILTRO ---
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [precoMax, setPrecoMax] = useState(10000);
  const [ordenacao, setOrdenacao] = useState("padrao"); // padrao, menor, maior, az
  const [sidebarAberta, setSidebarAberta] = useState(false); // Mobile

  // Extrai categorias únicas dos produtos disponíveis
  const categorias = useMemo(() => {
    const cats = produtos.map(p => p.categoria).filter(Boolean);
    return ["Todas", ...new Set(cats)];
  }, [produtos]);

  const maiorPrecoDisponivel = useMemo(() => Math.max(...produtos.map(p => p.preco), 5000), [produtos]);

  // Lógica de Filtragem e Ordenação
  const produtosFiltrados = useMemo(() => {
    let lista = [...produtos];

    // 1. Filtro de Categoria
    if (categoriaAtiva !== "Todas") {
      lista = lista.filter(p => p.categoria === categoriaAtiva);
    }

    // 2. Filtro de Preço
    lista = lista.filter(p => p.preco <= precoMax);

    // 3. Ordenação
    switch (ordenacao) {
      case "menor": return lista.sort((a, b) => a.preco - b.preco);
      case "maior": return lista.sort((a, b) => b.preco - a.preco);
      case "az": return lista.sort((a, b) => a.nome.localeCompare(b.nome));
      default: return lista;
    }
  }, [produtos, categoriaAtiva, precoMax, ordenacao]);

  return (
    <div className="fade-in bg-light min-vh-100">
      
      {/* HEADER DO CATÁLOGO */}
      <div className="bg-white border-bottom py-4 mb-4">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
                <h2 className="font-cinzel fw-bold m-0">Coleção Exclusiva</h2>
                <p className="text-muted m-0 small">{produtosFiltrados.length} produtos encontrados</p>
            </div>
            
            <div className="d-flex gap-3 align-items-center">
                {/* Botão Filtro Mobile */}
                <button className="btn btn-outline-dark d-lg-none d-flex align-items-center gap-2" onClick={()=>setSidebarAberta(!sidebarAberta)}>
                    <Funnel size={18}/> Filtros
                </button>

                {/* Dropdown Ordenação */}
                <select className="form-select bg-light border-0" style={{width: 'auto', fontWeight: '500'}} value={ordenacao} onChange={(e)=>setOrdenacao(e.target.value)}>
                    <option value="padrao">Relevância</option>
                    <option value="menor">Menor Preço</option>
                    <option value="maior">Maior Preço</option>
                    <option value="az">Nome (A-Z)</option>
                </select>
            </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
            
            {/* --- SIDEBAR DE FILTROS (Desktop & Mobile) --- */}
            <div className={`col-lg-3 ${sidebarAberta ? 'position-fixed top-0 start-0 h-100 bg-white z-index-modal p-4 shadow w-75' : 'd-none d-lg-block'}`} style={{zIndex: 1050}}>
                <div className="d-flex justify-content-between align-items-center mb-4 d-lg-none">
                    <h5 className="fw-bold m-0">Filtros</h5>
                    <button onClick={()=>setSidebarAberta(false)} className="btn btn-sm btn-light"><X size={20}/></button>
                </div>

                <div className="bg-white p-4 rounded border shadow-sm sticky-top" style={{top: '100px'}}>
                    {/* Filtro Categorias */}
                    <div className="mb-4">
                        <h6 className="font-cinzel fw-bold border-bottom pb-2 mb-3">Categorias</h6>
                        <div className="d-flex flex-column gap-2">
                            {categorias.map(cat => (
                                <label key={cat} className="d-flex align-items-center gap-2 cursor-pointer hover-text-accent">
                                    <input 
                                        type="radio" 
                                        name="categoria" 
                                        className="form-check-input accent-color"
                                        checked={categoriaAtiva === cat}
                                        onChange={() => setCategoriaAtiva(cat)}
                                    />
                                    <span className={categoriaAtiva === cat ? "fw-bold text-dark" : "text-muted"}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filtro Preço */}
                    <div className="mb-4">
                        <h6 className="font-cinzel fw-bold border-bottom pb-2 mb-3">Faixa de Preço</h6>
                        <label className="form-label small text-muted">Até R$ {precoMax.toLocaleString('pt-BR')}</label>
                        <input 
                            type="range" 
                            className="form-range" 
                            min="0" 
                            max={maiorPrecoDisponivel} 
                            step="50"
                            value={precoMax}
                            onChange={(e) => setPrecoMax(Number(e.target.value))}
                        />
                        <div className="d-flex justify-content-between small text-muted">
                            <span>R$ 0</span>
                            <span>R$ {maiorPrecoDisponivel.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    <button onClick={()=>{setCategoriaAtiva("Todas"); setPrecoMax(maiorPrecoDisponivel)}} className="btn btn-link text-muted text-decoration-none btn-sm w-100">
                        Limpar Filtros
                    </button>
                </div>
            </div>

            {/* --- GRID DE PRODUTOS --- */}
            <div className="col-lg-9">
                {produtosFiltrados.length === 0 ? (
                    <div className="text-center py-5">
                        <h4 className="text-muted">Nenhum produto encontrado.</h4>
                        <button onClick={()=>{setCategoriaAtiva("Todas"); setPrecoMax(maiorPrecoDisponivel)}} className="btn btn-primary-custom mt-3">Ver Todos</button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {produtosFiltrados.map((produto) => (
                            <div className="col-md-6 col-xl-4" key={produto.id}>
                                <div className="card-custom h-100 bg-white border d-flex flex-column position-relative group">
                                    {/* Imagem + Ações Rápidas */}
                                    <div className="position-relative overflow-hidden" style={{height: '260px'}}>
                                        <Link to={`/produto/${produto.id}`}>
                                            <img src={produto.img} className="w-100 h-100 object-fit-cover transition-transform duration-700 hover-zoom" alt={produto.nome} />
                                        </Link>
                                        
                                        {/* Overlay de Ações (Aparece no Hover) */}
                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-2 opacity-0 group-hover-opacity transition-opacity bg-gradient-to-t from-black-50">
                                            <button onClick={() => onProductView(produto)} className="btn btn-light rounded-circle shadow-sm p-2" title="Espiar"><Eye size={20}/></button>
                                            <button onClick={() => addToCart(produto)} className="btn btn-primary-custom rounded-circle shadow-sm p-2" title="Adicionar"><ShoppingCart size={20}/></button>
                                        </div>
                                        
                                        {produto.estoque < 5 && <span className="position-absolute top-0 start-0 m-2 badge bg-warning text-dark shadow-sm">Últimas Unidades</span>}
                                    </div>

                                    <div className="p-3 d-flex flex-column flex-grow-1">
                                        <small className="text-muted text-uppercase mb-1" style={{fontSize: '10px'}}>{produto.categoria}</small>
                                        <h6 className="fw-bold mb-1 text-truncate"><Link to={`/produto/${produto.id}`} className="text-dark text-decoration-none">{produto.nome}</Link></h6>
                                        
                                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                                            <div>
                                                <span className="d-block text-muted text-decoration-line-through small" style={{fontSize: '11px'}}>R$ {(produto.preco * 1.1).toFixed(0)}</span>
                                                <span className="fw-bold text-primary-custom fs-5">R$ {produto.preco.toLocaleString('pt-BR')}</span>
                                            </div>
                                            <small className="text-success fw-bold bg-success bg-opacity-10 px-2 py-1 rounded">12x s/ juros</small>
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
        .hover-zoom:hover { transform: scale(1.05); }
        .z-index-modal { z-index: 1050; }
      `}</style>
    </div>
  );
}