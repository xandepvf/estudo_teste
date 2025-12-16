import { useState } from "react";
import { Link } from "react-router-dom";
import { Funnel, ArrowsDownUp, Eye, ShoppingCart } from "phosphor-react";

const CATEGORIAS = ["Todos", "Sala de Estar", "Jantar", "Iluminação", "Decoração"];

export function Catalog({ produtos, addToCart, onProductView }) { // Recebe addToCart e onProductView
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [ordem, setOrdem] = useState("padrao");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  
  // Estado para o Modal Quick View
  const [produtoQuickView, setProdutoQuickView] = useState(null);

  // Lógica de filtro (mantida)
  let listaFinal = produtos;
  if (filtroCategoria !== "Todos") listaFinal = listaFinal.filter(p => p.categoria === filtroCategoria);
  if (precoMin) listaFinal = listaFinal.filter(p => p.preco >= Number(precoMin));
  if (precoMax) listaFinal = listaFinal.filter(p => p.preco <= Number(precoMax));
  listaFinal = [...listaFinal].sort((a, b) => {
    if (ordem === "menor_preco") return a.preco - b.preco;
    if (ordem === "maior_preco") return b.preco - a.preco;
    if (ordem === "az") return a.nome.localeCompare(b.nome);
    if (ordem === "za") return b.nome.localeCompare(a.nome);
    return 0;
  });

  const limparFiltros = () => { setFiltroCategoria("Todos"); setPrecoMin(""); setPrecoMax(""); setOrdem("padrao"); };

  const handleOpenQuickView = (p) => {
      setProdutoQuickView(p);
      onProductView(p); // Salva no histórico quando espia
  };

  return (
    <div className="container py-5 fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between mb-5 align-items-md-center gap-3">
        <h1 className="font-cinzel fw-bold m-0">Catálogo</h1>
        <div className="d-flex gap-2 align-items-center bg-white p-2 rounded shadow-sm">
            <ArrowsDownUp size={20} className="text-muted"/>
            <select className="form-select border-0 bg-transparent py-0" value={ordem} onChange={e => setOrdem(e.target.value)} style={{cursor: 'pointer', boxShadow: 'none'}}><option value="padrao">Relevância</option><option value="menor_preco">Menor Preço</option><option value="maior_preco">Maior Preço</option><option value="az">A - Z</option><option value="za">Z - A</option></select>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="bg-white p-4 shadow-sm rounded sticky-top" style={{top: '100px'}}>
            <div className="d-flex justify-content-between align-items-center mb-4"><h5 className="m-0 fw-bold font-cinzel"><Funnel className="me-2 text-accent"/> Filtros</h5>{(filtroCategoria !== "Todos" || precoMin || precoMax) && <button onClick={limparFiltros} className="btn btn-link btn-sm text-muted text-decoration-none p-0">Limpar</button>}</div>
            <h6 className="fw-bold text-uppercase small text-muted mb-3 ls-1">Categorias</h6>
            <div className="d-flex flex-column gap-2 mb-4">{CATEGORIAS.map(cat => (<button key={cat} className={`btn text-start px-3 py-2 rounded border-0 ${filtroCategoria === cat ? 'bg-dark text-white fw-bold' : 'bg-light text-dark'}`} onClick={()=>setFiltroCategoria(cat)}>{cat}</button>))}</div>
            <h6 className="fw-bold text-uppercase small text-muted mb-3 ls-1">Preço</h6>
            <div className="row g-2"><div className="col-6"><input type="number" className="form-control bg-light border-0" placeholder="Min" value={precoMin} onChange={e => setPrecoMin(e.target.value)} min="0"/></div><div className="col-6"><input type="number" className="form-control bg-light border-0" placeholder="Max" value={precoMax} onChange={e => setPrecoMax(e.target.value)} min="0"/></div></div>
          </div>
        </div>

        <div className="col-lg-9">
          {listaFinal.length === 0 ? <div className="text-center py-5 my-5"><Funnel size={48} className="text-muted mb-3 opacity-50"/><h3>Nenhum produto.</h3><button onClick={limparFiltros} className="btn btn-outline-dark mt-3">Limpar Filtros</button></div> : (
            <div className="row g-4">
                {listaFinal.map((p) => (
                <div className="col-md-6 col-lg-4" key={p.id}>
                    <div className="card-custom p-3 h-100 d-flex flex-column border group-hover">
                        <div className="position-relative overflow-hidden mb-3 rounded" style={{height:'220px'}}>
                            <img src={p.img} className="w-100 h-100 object-fit-cover" style={p.estoque===0 ? {filter:'grayscale(1)'} : {}} />
                            {p.estoque===0 && <span className="position-absolute top-50 start-50 translate-middle badge bg-dark text-uppercase ls-1 px-3 py-2">Esgotado</span>}
                            
                            {/* BOTÃO ESPIAR (Só aparece no hover) */}
                            {p.estoque > 0 && (
                                <button 
                                    onClick={() => handleOpenQuickView(p)}
                                    className="btn btn-light position-absolute bottom-0 start-50 translate-middle-x mb-3 shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2 opacity-0 hover-visible"
                                    style={{transition: 'all 0.3s'}}
                                >
                                    <Eye size={18}/> Espiar
                                </button>
                            )}
                        </div>
                        <small className="text-muted text-uppercase ls-1 fw-bold">{p.categoria}</small>
                        <h6 className="mb-2 text-truncate mt-1 fw-bold"><Link to={`/produto/${p.id}`} className="text-dark text-decoration-none">{p.nome}</Link></h6>
                        <p className="fw-bold text-accent fs-5 mb-3">R$ {p.preco.toLocaleString('pt-BR')}</p>
                        <div className="mt-auto">
                            {p.estoque>0 ? <button onClick={() => addToCart(p)} className="btn btn-outline-dark w-100 rounded-0 fw-bold text-uppercase ls-1 py-2">Adicionar</button> : <button disabled className="btn btn-light text-muted w-100 rounded-0 fw-bold text-uppercase ls-1 py-2 border-0">Indisponível</button>}
                        </div>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL QUICK VIEW */}
      {produtoQuickView && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)'}}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content overflow-hidden border-0">
                      <div className="row g-0">
                          <div className="col-md-6">
                              <img src={produtoQuickView.img} className="w-100 h-100 object-fit-cover" style={{minHeight: '400px'}}/>
                          </div>
                          <div className="col-md-6 bg-white p-5 position-relative">
                              <button onClick={() => setProdutoQuickView(null)} className="btn-close position-absolute top-0 end-0 m-4"></button>
                              <small className="text-muted text-uppercase fw-bold">{produtoQuickView.categoria}</small>
                              <h2 className="font-cinzel fw-bold mb-3">{produtoQuickView.nome}</h2>
                              <h3 className="text-primary-custom mb-4">R$ {produtoQuickView.preco.toLocaleString('pt-BR')}</h3>
                              <p className="text-muted mb-4">{produtoQuickView.descricao}</p>
                              <div className="d-grid gap-2">
                                  <button onClick={() => {addToCart(produtoQuickView); setProdutoQuickView(null);}} className="btn btn-dark py-3 text-uppercase fw-bold"><ShoppingCart className="me-2"/> Adicionar à Sacola</button>
                                  <Link to={`/produto/${produtoQuickView.id}`} className="btn btn-outline-dark py-2">Ver Detalhes Completos</Link>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
      <style>{`.group-hover:hover .hover-visible { opacity: 1 !important; transform: translate(-50%, -5px) !important; }`}</style>
    </div>
  );
}