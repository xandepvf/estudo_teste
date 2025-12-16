import { Trash, Minus, Plus, ArrowRight, ShoppingCart } from "phosphor-react";
import { Link } from "react-router-dom";

// Recebe 'produtos' e 'addToCart' agora
export function Cart({ cartItems, updateQty, removeFromCart, produtos, addToCart }) {
  const total = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  // Lógica Cross-Sell: Pega produtos que NÃO estão no carrinho
  const idsNoCarrinho = cartItems.map(i => i.id);
  const sugestoes = produtos
    .filter(p => !idsNoCarrinho.includes(p.id) && p.estoque > 0)
    .sort(() => 0.5 - Math.random()) // Embaralha
    .slice(0, 4); // Pega 4

  if (cartItems.length === 0) return (
    <div className="container py-5 text-center fade-in" style={{minHeight: '60vh', alignContent: 'center'}}>
        <ShoppingCart size={64} className="text-muted mb-3 opacity-50"/>
        <h2 className="mb-3 font-cinzel">Seu carrinho está vazio</h2>
        <p className="text-muted mb-4">Que tal explorar nossas coleções?</p>
        <Link to="/catalogo" className="btn btn-dark rounded-0 px-5 py-3 text-uppercase letter-spacing-1">Ver Catálogo</Link>
    </div>
  );

  return (
    <div className="container py-5 fade-in">
      <h1 className="font-cinzel fw-bold mb-5">Carrinho de Compras</h1>
      
      <div className="row g-5">
          {/* LISTA DE ITENS */}
          <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center border-bottom py-4 gap-3 position-relative">
                    <img src={item.img} width="100" height="100" className="object-fit-cover rounded bg-light"/>
                    <div className="flex-grow-1">
                        <h5 className="font-cinzel m-0">{item.nome}</h5>
                        <p className="text-muted small m-0 mb-2">Ref: {item.sku || '000'}</p>
                        <p className="fw-bold m-0">R$ {item.preco.toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <div className="d-flex align-items-center bg-light rounded p-1">
                        <button onClick={()=>updateQty(item.id, -1)} className="btn btn-sm px-2 hover-scale"><Minus size={14}/></button>
                        <span className="mx-3 fw-bold small">{item.quantidade}</span>
                        <button onClick={()=>updateQty(item.id, 1)} className="btn btn-sm px-2 hover-scale"><Plus size={14}/></button>
                    </div>
                    
                    <button onClick={()=>removeFromCart(item.id)} className="btn text-danger ms-3 hover-scale" title="Remover"><Trash size={20}/></button>
                </div>
              ))}
          </div>

          {/* RESUMO */}
          <div className="col-lg-4">
              <div className="bg-light p-4 rounded shadow-sm">
                  <h4 className="font-cinzel mb-4">Resumo</h4>
                  <div className="d-flex justify-content-between mb-2 text-muted"><span>Subtotal</span><span>R$ {total.toLocaleString('pt-BR')}</span></div>
                  <div className="d-flex justify-content-between mb-4 text-muted"><span>Frete</span><span className="text-success">Grátis</span></div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4 fs-4 fw-bold font-cinzel"><span>Total</span><span>R$ {total.toLocaleString('pt-BR')}</span></div>
                  <Link to="/checkout" className="btn btn-dark w-100 py-3 text-uppercase fw-bold letter-spacing-1">Finalizar Compra</Link>
                  <Link to="/catalogo" className="btn btn-link w-100 mt-2 text-muted text-decoration-none">Continuar Comprando</Link>
              </div>
          </div>
      </div>

      {/* --- CROSS SELLING (VOCÊ TAMBÉM PODE GOSTAR) --- */}
      {sugestoes.length > 0 && (
          <div className="mt-5 pt-5">
              <h3 className="font-cinzel mb-4">Aproveite e leve também</h3>
              <div className="row g-4">
                  {sugestoes.map(prod => (
                      <div className="col-md-3 col-6" key={prod.id}>
                          <div className="card border-0 h-100">
                              <div className="position-relative overflow-hidden rounded mb-2" style={{height: '180px'}}>
                                <Link to={`/produto/${prod.id}`}>
                                  <img src={prod.img} className="w-100 h-100 object-fit-cover" alt={prod.nome}/>
                                </Link>
                              </div>
                              <h6 className="text-truncate mb-1"><Link to={`/produto/${prod.id}`} className="text-decoration-none text-dark">{prod.nome}</Link></h6>
                              <p className="fw-bold small mb-2">R$ {prod.preco.toLocaleString('pt-BR')}</p>
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