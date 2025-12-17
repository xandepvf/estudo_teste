import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Lock, ShieldCheck, CheckCircle, User, MapPin } from "phosphor-react";
import { PaymentCard } from "../components/PaymentCard";
import { PaymentGateway } from "../services/gateway";

// Máscaras (Mantidas do original)
const maskPhone = (v) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
const maskCard = (v) => v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
const maskDate = (v) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2");
const maskCPF = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");

export function Checkout({ cartItems, onPlaceOrder, notify, cuponsDisponiveis }) { 
  const navigate = useNavigate();
  const location = useLocation();
  const cupomInicial = location.state?.cupomSugerido || "";

  const [step, setStep] = useState(1); // 1: Dados, 2: Pagamento, 3: Sucesso
  const [loading, setLoading] = useState(false);
  
  // Dados
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [numCartao, setNumCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [focoCampo, setFocoCampo] = useState("");

  const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const total = subtotal; // Simplificado para demo

  const avancarParaPagamento = (e) => {
      e.preventDefault();
      if(nome && cpf && telefone) setStep(2);
      else notify("Preencha todos os dados pessoais.");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (numCartao.length < 16 || cvv.length < 3) return notify("Verifique os dados do cartão.");
    
    setLoading(true);
    try {
        const resposta = await PaymentGateway.processarPagamento({ numero: numCartao }, total);
        const idPedido = onPlaceOrder({ nome, cpf, telefone, transactionId: resposta.transactionId }, total);
        setStep(3); // Sucesso
        setTimeout(() => navigate("/profile"), 5000);
    } catch (error) {
        notify(error.mensagem || "Erro no pagamento");
    } finally {
        setLoading(false);
    }
  };

  // --- STEPPER COMPONENT ---
  const Stepper = () => (
      <div className="d-flex justify-content-center align-items-center mb-5 position-relative">
          <div className="position-absolute w-50 bg-secondary opacity-25" style={{height: '2px', zIndex: 0}}></div>
          {[1, 2, 3].map(s => (
              <div key={s} className={`d-flex flex-column align-items-center mx-4 position-relative z-index-1`}>
                  <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${step >= s ? 'bg-dark text-white' : 'bg-light text-muted border'}`} style={{width:'35px', height:'35px'}}>
                      {step > s ? <CheckCircle weight="fill"/> : s}
                  </div>
                  <span className="small mt-2 fw-bold text-uppercase" style={{fontSize:'10px'}}>{s === 1 ? 'Identificação' : s === 2 ? 'Pagamento' : 'Conclusão'}</span>
              </div>
          ))}
      </div>
  );

  if (step === 3) return (
      <div className="container py-5 text-center min-vh-50 d-flex flex-column justify-content-center align-items-center fade-in-up">
          <CheckCircle size={80} className="text-success mb-3"/>
          <h2 className="font-brand fw-bold">Pedido Confirmado!</h2>
          <p className="text-muted mb-4">Obrigado pela sua compra. Enviamos um e-mail com os detalhes.</p>
          <button onClick={() => navigate('/catalogo')} className="btn btn-outline-dark">Continuar Comprando</button>
      </div>
  );

  return (
    <div className="container py-5 fade-in">
      <Stepper />
      
      <div className="row g-5 justify-content-center">
        <div className="col-lg-7">
          <div className="card-custom p-4 border-0 shadow-sm">
            
            {/* ETAPA 1: DADOS */}
            {step === 1 && (
                <form onSubmit={avancarParaPagamento} className="fade-in">
                    <h4 className="font-brand fw-bold mb-4 d-flex align-items-center gap-2"><User/> Dados de Entrega</h4>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Nome Completo</label>
                            <input className="form-control" required value={nome} onChange={e => setNome(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">CPF</label>
                            <input className="form-control" required value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} maxLength="14" placeholder="000.000.000-00"/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">Celular</label>
                            <input className="form-control" required value={telefone} onChange={e => setTelefone(maskPhone(e.target.value))} maxLength="15"/>
                        </div>
                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-dark w-100 py-3 fw-bold shadow-sm">IR PARA PAGAMENTO</button>
                        </div>
                    </div>
                </form>
            )}

            {/* ETAPA 2: PAGAMENTO */}
            {step === 2 && (
                <form onSubmit={handlePayment} className="fade-in">
                    <button type="button" onClick={()=>setStep(1)} className="btn btn-link text-muted p-0 mb-3 text-decoration-none small">&larr; Voltar para dados</button>
                    <h4 className="font-brand fw-bold mb-4 d-flex align-items-center gap-2"><CreditCard/> Pagamento Seguro</h4>
                    
                    <div className="mb-4 d-none d-md-block">
                        <PaymentCard numero={numCartao} nome={nomeCartao} validade={validade} cvv={cvv} focado={focoCampo}/>
                    </div>

                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Número do Cartão</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><Lock size={16}/></span>
                                <input className="form-control border-start-0" placeholder="0000 0000 0000 0000" required value={numCartao} onChange={e => setNumCartao(maskCard(e.target.value))} maxLength="19" onFocus={()=>setFocoCampo('numero')}/>
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Nome no Cartão</label>
                            <input className="form-control" placeholder="COMO NO CARTÃO" required style={{textTransform:'uppercase'}} value={nomeCartao} onChange={e => setNomeCartao(e.target.value)} onFocus={()=>setFocoCampo('nome')}/>
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold text-muted">Validade</label>
                            <input className="form-control" placeholder="MM/AA" required value={validade} onChange={e => setValidade(maskDate(e.target.value))} maxLength="5" onFocus={()=>setFocoCampo('validade')}/>
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold text-muted">CVV</label>
                            <input className="form-control" placeholder="123" required value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,''))} maxLength="4" onFocus={()=>setFocoCampo('cvv')}/>
                        </div>
                        
                        <div className="col-12 mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3 border-top pt-3">
                                <span className="fw-bold">Total a Pagar:</span>
                                <span className="fs-4 fw-bold text-success">R$ {total.toLocaleString('pt-BR')}</span>
                            </div>
                            <button type="submit" className="btn btn-success w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                {loading ? "Processando..." : <><ShieldCheck size={20}/> FINALIZAR PEDIDO</>}
                            </button>
                            <div className="text-center mt-3 small text-muted"><Lock size={12}/> Ambiente Criptografado 256-bit</div>
                        </div>
                    </div>
                </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}