import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Truck, ShieldCheck, Package, Heart, UserCircle, House, CreditCard, ShareNetwork, Check } from "phosphor-react";

export function ProductDetails({ produtos, addToCart, toggleFav, favoritos, avaliacoes, onAddReview, userLogado }) {
  const { id } = useParams();
  const [novoComentario, setNovoComentario] = useState("");
  const [nota, setNota] = useState(5);
  const [copiado, setCopiado] = useState(false); // Estado para feedback visual do compartilhar
  
  const produto = produtos.find(p => p.id === parseInt(id));
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => { 
    if (produto) {
      setActiveImg(produto.imgs ? produto.imgs[0] : produto.img);
      window.scrollTo(0, 0);
    } 
  }, [id, produto]);

  if (!produto) return <div className="container py-5 text-center">Produto não encontrado</div>;

  const isFav = favoritos ? favoritos.some(f => f.id === produto.id) : false;
  const reviewsProduto = avaliacoes.filter(r => r.produtoId === produto.id);
  const estoqueDisponivel = produto.estoque !== undefined ? produto.estoque : 10;
  const semEstoque = estoqueDisponivel === 0;

  const maxParcelas = 12;
  const valorParcela = produto.preco / maxParcelas;

  const relacionados = produtos
    .filter(p => p.categoria === produto.categoria && p.id !== produto.id)
    .slice(0, 3);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if(!userLogado) return alert("Faça login para avaliar!");
    onAddReview({
        produtoId: produto.id,
        usuario: userLogado.nome,
        comentario: novoComentario,
        nota: parseInt(nota),
        data: new Date().toLocaleDateString()
    });
    setNovoComentario("");
  };

  // --- NOVA FUNÇÃO: COMPARTILHAR ---
  const handleShare = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
      });
  };

  return (
    <div className="fade-in">
      <div className="bg-light py-3 border-bottom mb-5">
        <div className="container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small text-uppercase fw-bold letter-spacing-1 align-items-center">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted d-flex align-items-center gap-1"><House size={14}/> Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/catalogo" className="text-decoration-none text-muted">Catálogo</Link></li>
                    <li className="breadcrumb-item active text-dark" aria-current="page">{produto.nome}</li>
                </ol>
            </nav>
        </div>
      </div>

      <div className="container">
        <div className="row g-5 mb-5">
           <div className="col-lg-7 position-relative">
              <div className="position-relative mb-3 bg-white shadow-sm overflow-hidden" style={{ minHeight: '400px' }}>
                  <img src={activeImg} className="img-fluid w-100 object-fit-cover" alt="Principal" style={{maxHeight:'500px', filter: semEstoque ? 'grayscale(1)' : 'none'}} />
                  
                  <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2">
                      <button onClick={() => toggleFav(produto)} className="btn btn-light rounded-circle shadow-sm p-2 transition-transform hover-scale" title="Favoritar">
                          <Heart size={24} color={isFav ? "red" : "#4a3b32"} weight={isFav ? "fill" : "regular"} />
                      </button>
                      
                      {/* BOTÃO DE COMPARTILHAR */}
                      <button onClick={handleShare} className="btn btn-light rounded-circle shadow-sm p-2 transition-transform hover-scale text-primary-custom" title="Compartilhar">
                          {copiado ? <Check size={24} weight="bold" className="text-success"/> : <ShareNetwork size={24} />}
                      </button>
                  </div>

                  {semEstoque && (
                      <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-4 py-3 text-uppercase fw-bold opacity-90 shadow">
                          Esgotado
                      </div>
                  )}
                  
                  {/* Feedback visual de cópia */}
                  {copiado && <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 bg-dark text-white px-3 py-1 rounded small fade-in-up">Link copiado!</div>}
              </div>
              <div className="d-flex gap-2 overflow-auto pb-2">
                  {(produto.imgs || [produto.img]).map((img, i) => (
                      <img key={i} src={img} className={`img-thumbnail ${activeImg === img ? 'border-dark opacity-100' : 'opacity-50'}`} style={{width:'80px', height:'80px', objectFit:'cover', cursor:'pointer', transition: 'all 0.2s'}} onClick={()=>setActiveImg(img)} onMouseEnter={()=>setActiveImg(img)}/>
                  ))}
              </div>
           </div>

           <div className="col-lg-5">
              <small className="text-muted text-uppercase fw-bold mb-2 d-block ls-1">Ref: {produto.sku || `COD-${produto.id}`}</small>
              <h1 className="display-5 fw-bold mb-3 font-cinzel">{produto.nome}</h1>
              
              <div className="mb-4 pb-4 border-bottom">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <h2 className="display-6 fw-bold m-0 text-primary-custom">R$ {produto.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
                  </div>
                  
                  <div className="d-flex align-items-center gap-2 text-success fw-bold mb-2">
                      <CreditCard size={20}/>
                      <span>12x de R$ {valorParcela.toLocaleString('pt-BR', {minimumFractionDigits: 2})} sem juros</span>
                  </div>

                  <div className="mt-2">
                      {semEstoque ? (
                          <span className="badge bg-secondary">Indisponível</span>
                      ) : (
                          <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">Em Estoque</span>
                              {estoqueDisponivel < 5 && <small className="text-danger fw-bold animate-pulse">Últimas {estoqueDisponivel} unidades!</small>}
                          </div>
                      )}
                  </div>
              </div>

              <p className="text-secondary mb-4 line-height-lg">{produto.descricao}</p>
              
              <button 
                  className={`btn w-100 py-3 mb-4 fw-bold text-uppercase ${semEstoque ? 'btn-secondary' : 'btn-primary-custom'}`} 
                  onClick={() => addToCart(produto)}
                  disabled={semEstoque}
              >
                  {semEstoque ? "Produto Esgotado" : "Adicionar à Sacola"}
              </button>

              <div className="row g-2 text-center mb-5 small">
                   <div className="col-4"><div className="p-3 border rounded bg-white h-100"><Truck size={24} className="text-accent mb-2"/><p className="fw-bold m-0">Entrega Rápida</p></div></div>
                   <div className="col-4"><div className="p-3 border rounded bg-white h-100"><ShieldCheck size={24} className="text-accent mb-2"/><p className="fw-bold m-0">Garantia 1 Ano</p></div></div>
                   <div className="col-4"><div className="p-3 border rounded bg-white h-100"><Package size={24} className="text-accent mb-2"/><p className="fw-bold m-0">Troca Fácil</p></div></div>
              </div>
              
              <div className="bg-white border p-4 rounded mt-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="font-cinzel m-0">Avaliações ({reviewsProduto.length})</h4>
                    <div className="d-flex text-warning">
                         {[1,2,3,4,5].map(star => <Star key={star} size={16} weight="fill" className={reviewsProduto.length > 0 ? "" : "text-muted opacity-25"}/>)}
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column gap-3 mb-4 custom-scrollbar" style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {reviewsProduto.length === 0 && <p className="text-muted small text-center py-3">Este produto ainda não tem avaliações. Seja o primeiro!</p>}
                      {reviewsProduto.map((rev, i) => (
                          <div key={i} className="bg-light p-3 rounded">
                              <div className="d-flex justify-content-between mb-1">
                                  <strong className="small d-flex align-items-center gap-1"><UserCircle className="text-muted"/> {rev.usuario}</strong>
                                  <span className="text-warning small" style={{letterSpacing: '-2px'}}>{"★".repeat(rev.nota)}</span>
                              </div>
                              <p className="m-0 small text-secondary fst-italic">"{rev.comentario}"</p>
                              <small className="text-muted d-block text-end" style={{fontSize: '10px'}}>{rev.data}</small>
                          </div>
                      ))}
                  </div>
                  {userLogado ? (
                      <form onSubmit={handleSubmitReview} className="border-top pt-3">
                          <p className="small fw-bold mb-2">Deixe sua avaliação:</p>
                          <div className="d-flex gap-1 mb-2">
                             {[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setNota(n)} className={`btn btn-sm p-0 px-1 fs-5 ${nota >= n ? 'text-warning' : 'text-muted opacity-25'}`} style={{border:'none', background:'none'}}>★</button>)}
                          </div>
                          <textarea className="form-control mb-2 bg-light font-sm" rows="2" placeholder="O que você achou do produto?" value={novoComentario} onChange={e=>setNovoComentario(e.target.value)} required></textarea>
                          <button type="submit" className="btn btn-dark btn-sm w-100 text-uppercase fw-bold">Enviar Avaliação</button>
                      </form>
                  ) : (
                      <Link to="/login" className="btn btn-outline-dark btn-sm w-100">Faça login para avaliar</Link>
                  )}
              </div>
           </div>
        </div>

        {relacionados.length > 0 && (
         <div className="mt-5 border-top pt-5">
            <h3 className="font-cinzel mb-4 text-center">Você também pode gostar</h3>
            <div className="row g-4">
                {relacionados.map(rel => (
                    <div className="col-md-4" key={rel.id}>
                        <div className="card-custom p-3 h-100 border">
                            <Link to={`/produto/${rel.id}`} className="text-decoration-none text-dark">
                                <div className="position-relative overflow-hidden mb-3" style={{height: '240px'}}>
                                    <img src={rel.img} className="w-100 h-100 object-fit-cover rounded" alt={rel.nome}/>
                                </div>
                                <h6 className="mb-1 text-truncate font-cinzel fw-bold">{rel.nome}</h6>
                                <p className="fw-bold text-accent">R$ {rel.preco.toLocaleString('pt-BR')}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
         </div>
       )}
      </div>
    </div>
  );
}