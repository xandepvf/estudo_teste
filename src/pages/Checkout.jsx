import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Tag } from "phosphor-react";

export function Checkout({ cartItems, onPlaceOrder, notify, cuponsDisponiveis }) { // Recebe cuponsDisponiveis
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const valorDesconto = subtotal * desconto;
  const total = subtotal - valorDesconto;

  const aplicarCupom = () => {
    const codigoDigitado = cupom.toUpperCase();
    // Procura na lista vinda do App.jsx
    const cupomValido = cuponsDisponiveis.find(c => c.codigo === codigoDigitado);

    if (cupomValido) {
      setDesconto(cupomValido.desconto / 100); // Converte 10 para 0.1
      notify(`Cupom aplicado: ${cupomValido.desconto}% OFF!`);
    } else {
      setDesconto(0);
      notify("Cupom inválido ou expirado.");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const idPedido = onPlaceOrder({ nome }, total);
      notify(`Pedido #${idPedido} realizado!`);
      navigate("/profile");
    }, 2000);
  };

  if (cartItems.length === 0) return <div className="text-center py-5">Seu carrinho está vazio.</div>;

  return (
    <div className="container py-5 fade-in">
      <div className="row g-5">
        <div className="col-lg-8">
          <h4 className="mb-4 font-cinzel">Finalizar Pedido</h4>
          <form id="checkoutForm" onSubmit={handlePayment}>
            <div className="row g-3">
              <div className="col-12"><input type="text" className="form-control py-3 bg-light border-0" placeholder="Nome Completo" required value={nome} onChange={e => setNome(e.target.value)} /></div>
              <div className="col-8"><input type="text" className="form-control py-3 bg-light border-0" placeholder="Endereço" required /></div>
              <div className="col-4"><input type="text" className="form-control py-3 bg-light border-0" placeholder="CEP" required /></div>
            </div>
            <h4 className="mb-4 mt-5 font-cinzel">Pagamento</h4>
            <div className="p-4 border rounded">
              <div className="d-flex gap-3 mb-3"><CreditCard size={24} className="text-accent"/><span className="fw-bold">Cartão de Crédito</span></div>
              <div className="row g-3">
                <div className="col-12"><input type="text" className="form-control" placeholder="Número do Cartão" required /></div>
                <div className="col-6"><input type="text" className="form-control" placeholder="MM/AA" required /></div>
                <div className="col-6"><input type="text" className="form-control" placeholder="CVV" required /></div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4">
            <div className="bg-light p-4 rounded shadow-sm sticky-top" style={{top: '100px'}}>
                <h4 className="mb-4 font-cinzel">Resumo</h4>
                {cartItems.map(item => (<div key={item.id} className="d-flex justify-content-between mb-2 small text-muted"><span>{item.quantidade}x {item.nome}</span><span>R$ {(item.preco * item.quantidade).toLocaleString('pt-BR')}</span></div>))}
                <hr />
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white border-end-0"><Tag /></span>
                  <input type="text" className="form-control border-start-0" placeholder="Cupom" value={cupom} onChange={e => setCupom(e.target.value)}/>
                  <button className="btn btn-dark" type="button" onClick={aplicarCupom}>Aplicar</button>
                </div>
                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>R$ {subtotal.toLocaleString('pt-BR')}</span></div>
                {desconto > 0 && (<div className="d-flex justify-content-between mb-2 text-success fw-bold"><span>Desconto</span><span>- R$ {valorDesconto.toLocaleString('pt-BR')}</span></div>)}
                <div className="d-flex justify-content-between mt-3 fs-4 fw-bold text-primary-custom border-top pt-3"><span>Total</span><span>R$ {total.toLocaleString('pt-BR')}</span></div>
                <button form="checkoutForm" type="submit" className="btn btn-primary-custom w-100 py-3 mt-4" disabled={loading}>{loading ? "Processando..." : `Pagar R$ ${total.toLocaleString('pt-BR')}`}</button>
            </div>
        </div>
      </div>
    </div>
  );
}