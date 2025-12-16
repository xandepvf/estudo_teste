import { useState } from "react";
import { Trash, Minus, Plus, ShoppingCart, Truck, Gift, CreditCard, Ticket } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate importado

export function Cart({ cartItems, updateQty, removeFromCart, produtos, addToCart }) {
  const [cep, setCep] = useState("");
  const [freteCalculado, setFreteCalculado] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  // Calcula subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  
  // --- LÓGICA DE FRETE GRÁTIS (GAMIFICATION) ---
  const META_FRETE_GRATIS = 10000;
  const faltaParaFrete = Math.max(0, META_FRETE_GRATIS - subtotal);
  const progressoFrete = Math.min((subtotal / META_FRETE_GRATIS) * 100, 100);

  // Calcula total com frete (usando estado)
  const total = subtotal + (freteCalculado || 0);

  // Lógica Cross-Sell
  const idsNoCarrinho = cartItems.map(i => i.id);
  const sugestoes = produtos
    .filter(p => !idsNoCarrinho.includes(p.id) && p.estoque > 0)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const calcularFrete = (e) => {
      e.preventDefault();
      if(cep.length < 8) return alert("CEP inválido");
      setLoadingFrete(true);
      // Simulação de cálculo
      setTimeout(() => {
          setLoadingFrete(false);
          // Se atingiu a meta, é grátis, senão cobra um valor fixo simulado
          setFreteCalculado(subtotal >= META_FRETE_GRATIS ? 0 : 150); 
      }, 1000);
  };

  // --- NOVA FUNÇÃO: APLICAR CUPOM SUGERIDO ---
  const irParaCheckoutComCupom = () => {
      navigate('/checkout', { state: { cupomSugerido: 'BEMVINDO10' } });
  };

  if (cartItems.length === 0) return (
    <div className="container py-5 text-center fade-in" style={{minHeight: '60vh', alignContent: 'center'}}>
        <ShoppingCart size={64} className="text-muted mb-3 opacity-25"/>
        <h2 className="mb-3 font-cinzel fw-bold">Sua sacola está vazia</h2>
        <p className="text-muted mb-4">Explore peças exclusivas para transformar seu ambiente.</p>
        <Link to="/catalogo" className="btn btn-primary-custom px-5 py-3">Ver Coleção</Link>
    </div>
  );

  return (
    <div className="container py-5 fade-in">
      <h1 className="font-cinzel fw-bold mb-4">Carrinho de Compras</h1>
      
      <div className="row g-5">
          <div className="col-lg-8">
              {/* BARRA DE PROGRESSO FRETE GRÁTIS */}
              <div className="bg-light p-3 rounded mb-4 border border-secondary border-opacity-25">
                  {faltaParaFrete > 0 ? (
                      <p className="m-0 small mb-2 text-dark">
                          Faltam <span className="fw-bold text-accent">R$ {faltaParaFrete.toLocaleString('pt-BR')}</span> para ganhar <span className="fw-bold"><Truck className="me-1"/>Frete Grátis</span>
                      </p>
                  ) : (
                      <p className="m-0 small mb-2 text-success fw-bold"><Gift className="me-2"/>Parabéns! Você ganhou Frete Grátis.</p>
                  )}
                  <div className="progress" style={{height: '6px'}}>
                      <div className="progress-bar bg-dark" style={{width: `${progressoFrete}%`, transition: 'width 1s ease'}}></div>
                  </div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center border-bottom py-4 gap-3 position-relative bg-white p-3 mb-3 shadow-sm rounded">
                    <img src={item.img} width="100" height="100" className="object-fit-cover rounded bg-light"/>
                    <div className="flex-grow-1">
                        <small className="text-muted d-block text-uppercase" style={{fontSize:'10px'}}>Ref: {item.sku || '000'}</small>
                        <h5 className="font-cinzel m-0 fs-6 fw-bold"><Link to={`/produto/${item.id}`} className="text-dark text-decoration-none">{item.nome}</Link></h5>
                        <p className="fw-bold m-0 mt-1 text-accent">R$ {item.preco.toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <div className="d-flex align-items-center border rounded p-1">
                        <button onClick={()=>updateQty(item.id, -1)} className="btn btn-sm px-2 hover-scale"><Minus size={12}/></button>
                        <span className="mx-3 fw-bold small">{item.quantidade}</span>
                        <button onClick={()=>updateQty(item.id, 1)} className="btn btn-sm px-2 hover-scale"><Plus size={12}/></button>
                    </div>
                    
                    <button onClick={()=>removeFromCart(item.id)} className="btn text-muted hover-danger ms-2" title="Remover"><Trash size={18}/></button>
                </div>
              ))}
          </div>

          {/* RESUMO E CHECKOUT */}
          <div className="col-lg-4">
              <div className="bg-white p-4 rounded shadow-sm border sticky-top" style={{top: '100px'}}>
                  <h4 className="font-cinzel mb-4 fw-bold">Resumo do Pedido</h4>
                  
                  <form onSubmit={calcularFrete} className="mb-4">
                      <label className="small fw-bold mb-1">Estimar Entrega</label>
                      <div className="input-group input-group-sm">
                          <input type="text" className="form-control" placeholder="CEP (00000-000)" value={cep} onChange={e=>setCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2'))} maxLength="9"/>
                          <button className="btn btn-outline-dark" disabled={loadingFrete}>{loadingFrete ? "..." : "Calcular"}</button>
                      </div>
                      {freteCalculado !== null && (
                          <div className="mt-2 small text-end">
                              {freteCalculado === 0 ? <span className="text-success fw-bold">Frete Grátis</span> : `Frete: R$ ${freteCalculado.toFixed(2)}`}
                          </div>
                      )}
                  </form>

                  <div className="d-flex justify-content-between mb-2 text-muted small"><span>Subtotal ({cartItems.reduce((a,b)=>a+b.quantidade,0)} itens)</span><span>R$ {subtotal.toLocaleString('pt-BR')}</span></div>
                  <div className="d-flex justify-content-between mb-4 text-muted small">
                      <span>Frete</span>
                      <span>
                          {freteCalculado === null ? '--' : (freteCalculado === 0 ? <span className="text-success">Grátis</span> : `R$ ${freteCalculado.toLocaleString('pt-BR')}`)}
                      </span>
                  </div>
                  
                  {/* BOTÃO CUPOM RÁPIDO */}
                  <div className="alert alert-warning d-flex align-items-center gap-2 p-2 small mb-3" style={{cursor: 'pointer'}} onClick={irParaCheckoutComCupom}>
                      <Ticket size={20}/>
                      <span>Usar cupom <strong>BEMVINDO10</strong></span>
                  </div>
                  
                  <hr className="opacity-25"/>
                  
                  <div className="d-flex justify-content-between mb-4 fs-5 fw-bold text-dark font-cinzel">
                      <span>Total</span>
                      <span>R$ {total.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  <div className="mb-3 small text-center text-muted"><CreditCard className="me-1"/> Parcele em até 12x sem juros</div>

                  <Link to="/checkout" className="btn btn-primary-custom w-100 py-3 shadow-sm">
                      Fechar Pedido
                  </Link>
                  <Link to="/catalogo" className="btn btn-link w-100 mt-2 text-muted text-decoration-none small">Continuar Comprando</Link>
              </div>
          </div>
      </div>

      {sugestoes.length > 0 && (
          <div className="mt-5 pt-5 border-top">
              <h4 className="font-cinzel mb-4 text-center">Complete seu ambiente</h4>
              <div className="row g-4">
                  {sugestoes.map(prod => (
                      <div className="col-md-3 col-6" key={prod.id}>
                          <div className="card-custom border-0 h-100 p-2">
                              <div className="position-relative overflow-hidden rounded mb-2" style={{height: '150px'}}>
                                <Link to={`/produto/${prod.id}`}>
                                  <img src={prod.img} className="w-100 h-100 object-fit-cover" alt={prod.nome}/>
                                </Link>
                              </div>
                              <h6 className="text-truncate mb-1 small fw-bold"><Link to={`/produto/${prod.id}`} className="text-decoration-none text-dark">{prod.nome}</Link></h6>
                              <p className="fw-bold small mb-2 text-accent">R$ {prod.preco.toLocaleString('pt-BR')}</p>
                              <button onClick={() => addToCart(prod)} className="btn btn-outline-dark btn-sm w-100 rounded-0 text-uppercase" style={{fontSize: '10px'}}>Adicionar</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}