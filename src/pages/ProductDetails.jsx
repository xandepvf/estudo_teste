import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Truck, ShieldCheck, Package, CaretRight, Heart, UserCircle, House } from "phosphor-react";

export function ProductDetails({ produtos, addToCart, toggleFav, favoritos, avaliacoes, onAddReview, userLogado }) {
  const { id } = useParams();
  const [novoComentario, setNovoComentario] = useState("");
  const [nota, setNota] = useState(5);
  
  const produto = produtos.find(p => p.id === parseInt(id));
  const [activeImg, setActiveImg] = useState("");

  // Atualiza a imagem ativa quando muda o produto
  useEffect(() => { 
    if (produto) {
      setActiveImg(produto.imgs ? produto.imgs[0] : produto.img);
      window.scrollTo(0, 0); // Rola para o topo ao trocar de produto
    } 
  }, [id, produto]);

  if (!produto) return <div className="container py-5 text-center">Produto não encontrado</div>;

  const isFav = favoritos ? favoritos.some(f => f.id === produto.id) : false;
  const reviewsProduto = avaliacoes.filter(r => r.produtoId === produto.id);
  const estoqueDisponivel = produto.estoque !== undefined ? produto.estoque : 10;
  const semEstoque = estoqueDisponivel === 0;

  // Lógica de Produtos Relacionados (Mesma categoria, exceto o atual)
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

  return (
    <div className="fade-in">
      
      {/* --- BREADCRUMBS (NOVO) --- */}
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
           {/* Coluna da Imagem */}
           <div className="col-lg-7 position-relative">
              <div className="position-relative mb-3 bg-white shadow-sm" style={{ minHeight: '400px' }}>
                  <img src={activeImg} className="img-fluid w-100 object-fit-cover" alt="Principal" style={{maxHeight:'500px', filter: semEstoque ? 'grayscale(1)' : 'none'}} />
                  
                  <button onClick={() => toggleFav(produto)} className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm p-2">
                      <Heart size={24} color={isFav ? "red" : "#4a3b32"} weight={isFav ? "fill" : "regular"} />
                  </button>

                  {semEstoque && (
                      <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-4 py-2 text-uppercase fw-bold opacity-75">
                          Esgotado
                      </div>
                  )}
              </div>
              {/* Miniaturas */}
              <div className="d-flex gap-2 overflow-auto pb-2">
                  {(produto.imgs || [produto.img]).map((img, i) => (
                      <img key={i} src={img} className="img-thumbnail" style={{width:'80px', height:'80px', objectFit:'cover', cursor:'pointer', border: activeImg === img ? '2px solid black' : ''}} onClick={()=>setActiveImg(img)}/>
                  ))}
              </div>
           </div>

           {/* Coluna de Detalhes */}
           <div className="col-lg-5">
              <small className="text-muted text-uppercase fw-bold mb-2 d-block">Ref: {produto.sku || `COD-${produto.id}`}</small>
              <h1 className="display-5 fw-bold mb-3">{produto.nome}</h1>
              
              <div className="d-flex align-items-center justify-content-between mb-4 pb-4 border-bottom">
                  <h2 className="display-6 fw-bold m-0 text-primary-custom">R$ {produto.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2>
                  
                  <div className="text-end">
                      {semEstoque ? (
                          <span className="badge bg-danger">Indisponível</span>
                      ) : (
                          <div className="d-flex flex-column align-items-end">
                              <span className="badge bg-success bg-opacity-10 text-success border border-success">Em Estoque</span>
                              {estoqueDisponivel < 5 && <small className="text-danger fw-bold mt-1">Restam só {estoqueDisponivel}!</small>}
                          </div>
                      )}
                  </div>
              </div>

              <p className="text-secondary mb-4">{produto.descricao}</p>
              
              <button 
                  className={`btn w-100 py-3 mb-5 fw-bold text-uppercase ${semEstoque ? 'btn-secondary' : 'btn-primary-custom'}`} 
                  onClick={() => addToCart(produto)}
                  disabled={semEstoque}
              >
                  {semEstoque ? "Produto Esgotado" : "Adicionar à Sacola"}
              </button>

              <div className="row g-3 text-center mb-5">
                   <div className="col-4"><div className="p-3 border rounded bg-light h-100"><Truck size={28} className="text-accent mb-2"/><p className="small fw-bold m-0">Entrega</p></div></div>
                   <div className="col-4"><div className="p-3 border rounded bg-light h-100"><ShieldCheck size={28} className="text-accent mb-2"/><p className="small fw-bold m-0">Garantia</p></div></div>
                   <div className="col-4"><div className="p-3 border rounded bg-light h-100"><Package size={28} className="text-accent mb-2"/><p className="small fw-bold m-0">Troca</p></div></div>
              </div>
              
              {/* Avaliações */}
              <div className="bg-light p-4 rounded mt-5">
                  <h4 className="font-cinzel mb-4">Avaliações ({reviewsProduto.length})</h4>
                  <div className="d-flex flex-column gap-3 mb-4" style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {reviewsProduto.length === 0 && <p className="text-muted small">Seja o primeiro a avaliar.</p>}
                      {reviewsProduto.map((rev, i) => (
                          <div key={i} className="bg-white p-3 rounded shadow-sm">
                              <div className="d-flex justify-content-between mb-1">
                                  <strong className="small"><UserCircle className="me-1"/> {rev.usuario}</strong>
                                  <span className="text-warning small">{"★".repeat(rev.nota)}</span>
                              </div>
                              <p className="m-0 small text-secondary">"{rev.comentario}"</p>
                          </div>
                      ))}
                  </div>
                  {userLogado ? (
                      <form onSubmit={handleSubmitReview} className="border-top pt-3">
                          <div className="d-flex gap-2 mb-2">
                             {[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setNota(n)} className={`btn btn-sm ${nota >= n ? 'btn-warning' : 'btn-outline-secondary'}`}>★</button>)}
                          </div>
                          <textarea className="form-control mb-2" rows="2" placeholder="Escreva..." value={novoComentario} onChange={e=>setNovoComentario(e.target.value)} required></textarea>
                          <button type="submit" className="btn btn-dark btn-sm w-100">Enviar</button>
                      </form>
                  ) : (
                      <Link to="/login" className="btn btn-outline-dark btn-sm w-100">Faça login para avaliar</Link>
                  )}
              </div>
           </div>
        </div>

        {/* --- SEÇÃO DE RELACIONADOS (NOVO) --- */}
        {relacionados.length > 0 && (
         <div className="mt-5 border-top pt-5">
            <h3 className="font-cinzel mb-4">Você também pode gostar</h3>
            <div className="row g-4">
                {relacionados.map(rel => (
                    <div className="col-md-4" key={rel.id}>
                        <div className="card-custom p-3 h-100 border">
                            <Link to={`/produto/${rel.id}`} className="text-decoration-none text-dark">
                                <div className="position-relative overflow-hidden mb-3" style={{height: '200px'}}>
                                    <img src={rel.img} className="w-100 h-100 object-fit-cover rounded" alt={rel.nome}/>
                                </div>
                                <h6 className="mb-1 text-truncate">{rel.nome}</h6>
                                <p className="fw-bold text-muted">R$ {rel.preco.toLocaleString('pt-BR')}</p>
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