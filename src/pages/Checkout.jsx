import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Tag, Lock, ShieldCheck, WarningCircle, CircleNotch, CheckCircle } from "phosphor-react";
import { PaymentCard } from "../components/PaymentCard";
import { PaymentGateway } from "../services/gateway"; // Importa o simulador

// --- MÁSCARAS ---
const maskPhone = (v) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
const maskCard = (v) => v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
const maskDate = (v) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2");
const maskCPF = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");

export function Checkout({ cartItems, onPlaceOrder, notify, cuponsDisponiveis }) { 
  const navigate = useNavigate();
  const location = useLocation();
  
  // Inicializa com cupom se vier da navegação (Cart)
  const cupomInicial = location.state?.cupomSugerido || "";

  const [estagio, setEstagio] = useState("dados"); // 'dados', 'pagamento', 'sucesso'
  const [loading, setLoading] = useState(false);
  const [erroPagamento, setErroPagamento] = useState(null);

  // Dados Pessoais
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  
  // Dados Financeiros
  const [cupom, setCupom] = useState(cupomInicial);
  const [desconto, setDesconto] = useState(0);
  const [numCartao, setNumCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nomeCartao, setNomeCartao] = useState("");
  const [focoCampo, setFocoCampo] = useState(""); // Para virar o cartão

  const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const valorDesconto = subtotal * desconto;
  const total = subtotal - valorDesconto;

  const aplicarCupom = () => {
    const codigoDigitado = cupom.toUpperCase();
    const cupomValido = cuponsDisponiveis.find(c => c.codigo === codigoDigitado);
    if (cupomValido) {
      setDesconto(cupomValido.desconto / 100); 
      notify(`Cupom aplicado: ${cupomValido.desconto}% OFF!`);
    } else {
      setDesconto(0);
      notify("Cupom inválido ou expirado.");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErroPagamento(null);

    // Validações Básicas Frontend
    if (numCartao.replace(/\s/g, '').length < 16) return notify("Número do cartão incompleto.");
    if (cvv.length < 3) return notify("CVV inválido.");
    if (cpf.length < 14) return notify("CPF incompleto.");

    setLoading(true);

    try {
        // CHAMA A API SIMULADA (Realismo)
        const resposta = await PaymentGateway.processarPagamento({
            numero: numCartao,
            nome: nomeCartao,
            cvv: cvv,
            validade: validade
        }, total);

        // Se chegou aqui, deu sucesso
        const idPedido = onPlaceOrder({ nome, cpf, telefone, transactionId: resposta.transactionId }, total);
        setEstagio("sucesso");
        notify(`Pedido aprovado! ID: ${resposta.transactionId}`);
        
        setTimeout(() => navigate("/profile"), 4000); // Redireciona após mostrar sucesso

    } catch (error) {
        // Trata erros da "API" (Saldo insuficiente, timeout, etc)
        setErroPagamento(error.mensagem);
        notify("Falha no pagamento.");
    } finally {
        setLoading(false);
    }
  };

  if (estagio === "sucesso") {
      return (
          <div className="container py-5 text-center fade-in" style={{minHeight: '60vh', alignContent: 'center'}}>
              <div className="mb-4">
                  <CheckCircle size={84} className="text-success animate-bounce"/>
              </div>
              <h2 className="font-cinzel fw-bold text-success mb-3">Pagamento Aprovado!</h2>
              <p className="lead text-muted mb-4">Seu pedido está sendo preparado com carinho.</p>
              <div className="spinner-border spinner-border-sm text-muted me-2"></div>
              <small className="text-muted">Redirecionando para seu perfil...</small>
          </div>
      );
  }

  if (cartItems.length === 0) return <div className="text-center py-5 font-cinzel">Seu carrinho está vazio.</div>;

  return (
    <div className="container py-5 fade-in">
      <div className="row g-5">
        
        {/* COLUNA ESQUERDA: DADOS */}
        <div className="col-lg-7">
          <h4 className="mb-4 font-cinzel fw-bold border-bottom pb-2">Checkout Seguro</h4>
          
          {erroPagamento && (
              <div className="alert alert-danger d-flex align-items-center gap-3 shadow-sm rounded-0 border-danger">
                  <WarningCircle size={32}/>
                  <div>
                      <h6 className="fw-bold m-0">Pagamento Recusado</h6>
                      <small>{erroPagamento}</small>
                  </div>
              </div>
          )}

          <form id="checkoutForm" onSubmit={handlePayment}>
            {/* DADOS PESSOAIS */}
            <div className="bg-white p-4 border rounded shadow-sm mb-4">
                <h6 className="fw-bold mb-3 text-uppercase small text-muted letter-spacing-1">1. Dados Pessoais</h6>
                <div className="row g-3">
                    <div className="col-12">
                        <label className="small fw-bold text-muted">Nome Completo</label>
                        <input type="text" className="form-control bg-light" required value={nome} onChange={e => setNome(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="small fw-bold text-muted">CPF</label>
                        <input type="text" className="form-control bg-light" required value={cpf} onChange={e => setCpf(maskCPF(e.target.value))} maxLength="14" placeholder="000.000.000-00"/>
                    </div>
                    <div className="col-md-6">
                        <label className="small fw-bold text-muted">Telefone</label>
                        <input type="text" className="form-control bg-light" required value={telefone} onChange={e => setTelefone(maskPhone(e.target.value))} maxLength="15" placeholder="(00) 00000-0000"/>
                    </div>
                </div>
            </div>

            {/* DADOS DE PAGAMENTO */}
            <div className="bg-white p-4 border rounded shadow-sm position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="fw-bold m-0 text-uppercase small text-muted letter-spacing-1">2. Pagamento (Crédito)</h6>
                    <div className="d-flex gap-2 text-muted">
                        <Lock size={16}/> <small>128-bit SSL</small>
                    </div>
                </div>

                <div className="row g-4">
                    {/* CARTÃO VISUAL (MOBILE: CIMA, DESKTOP: LADO ESQUERDO DO INPUT) */}
                    <div className="col-12 d-flex justify-content-center mb-2">
                        <PaymentCard 
                            numero={numCartao} 
                            nome={nomeCartao} 
                            validade={validade} 
                            cvv={cvv}
                            focado={focoCampo}
                        />
                    </div>

                    <div className="col-12">
                        <label className="small fw-bold text-muted">Número do Cartão</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><CreditCard/></span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 ps-0" 
                                placeholder="0000 0000 0000 0000" 
                                required 
                                value={numCartao} 
                                onChange={e => setNumCartao(maskCard(e.target.value))} 
                                maxLength="19"
                                onFocus={() => setFocoCampo('numero')}
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <label className="small fw-bold text-muted">Nome Impresso</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="COMO NO CARTÃO" 
                            required 
                            style={{textTransform: 'uppercase'}}
                            value={nomeCartao}
                            onChange={e => setNomeCartao(e.target.value)}
                            onFocus={() => setFocoCampo('nome')}
                        />
                    </div>

                    <div className="col-6">
                        <label className="small fw-bold text-muted">Validade</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="MM/AA" 
                            required 
                            value={validade} 
                            onChange={e => setValidade(maskDate(e.target.value))} 
                            maxLength="5"
                            onFocus={() => setFocoCampo('validade')}
                        />
                    </div>
                    <div className="col-6">
                        <label className="small fw-bold text-muted">CVV</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="123" 
                            required 
                            value={cvv} 
                            onChange={e => setCvv(e.target.value.replace(/\D/g,''))} 
                            maxLength="4"
                            onFocus={() => setFocoCampo('cvv')}
                            onBlur={() => setFocoCampo('')}
                        />
                    </div>
                </div>
            </div>
          </form>
        </div>
        
        {/* RESUMO LATERAL */}
        <div className="col-lg-5">
            <div className="bg-light p-4 rounded shadow-sm sticky-top border" style={{top: '100px'}}>
                <h4 className="mb-4 font-cinzel fw-bold">Resumo da Compra</h4>
                
                <div className="input-group mb-4">
                  <span className="input-group-text bg-white border-end-0"><Tag /></span>
                  <input type="text" className="form-control border-start-0 text-uppercase" placeholder="Cupom" value={cupom} onChange={e => setCupom(e.target.value)}/>
                  <button className="btn btn-dark" type="button" onClick={aplicarCupom}>Aplicar</button>
                </div>

                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>R$ {subtotal.toLocaleString('pt-BR')}</span></div>
                {desconto > 0 && (<div className="d-flex justify-content-between mb-2 text-success fw-bold"><span>Desconto</span><span>- R$ {valorDesconto.toLocaleString('pt-BR')}</span></div>)}
                
                <div className="d-flex justify-content-between mt-3 fs-4 fw-bold text-primary-custom border-top pt-3 border-secondary border-opacity-25">
                    <span>Total</span>
                    <span>R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <small className="d-block text-end text-muted mb-4">em até 12x sem juros</small>

                <button form="checkoutForm" type="submit" className="btn btn-primary-custom w-100 py-3 shadow-lg d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                    {loading ? (
                        <><CircleNotch size={24} className="animate-spin"/> Processando...</>
                    ) : (
                        <><ShieldCheck size={24}/> PAGAR AGORA</>
                    )}
                </button>
                
                <div className="mt-4 pt-3 border-top text-center opacity-50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="20" className="mx-2 filter-grayscale"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" className="mx-2 filter-grayscale"/>
                </div>
            </div>
        </div>
      </div>
      {/* Estilo para animação de flip e grayscale */}
      <style>{`
        .filter-grayscale { filter: grayscale(1); opacity: 0.7; }
        .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}