import { useState, useEffect } from "react";
import { MagnifyingGlass, Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, Trash, ClockCounterClockwise, BellRinging, User, Star, Smiley, FileText, WarningCircle, Copy, ChatTeardropText, XCircle, CalendarBlank } from "phosphor-react";

export function Tracking({ pedidos = [] }) { 
  const [buscaId, setBuscaId] = useState("");
  const [pedidoEncontrado, setPedidoEncontrado] = useState(null);
  const [erro, setErro] = useState(false);
  const [historicoBusca, setHistoricoBusca] = useState([]);
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(false);
  const [avaliacao, setAvaliacao] = useState(0); 

  // Carrega histórico ao iniciar com verificação de segurança
  useEffect(() => {
    try {
      const historicoSalvo = localStorage.getItem("tracking_history");
      if (historicoSalvo) {
        const parsedHistory = JSON.parse(historicoSalvo);
        if (Array.isArray(parsedHistory)) {
          setHistoricoBusca(parsedHistory);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar histórico", e);
      localStorage.removeItem("tracking_history");
      setHistoricoBusca([]);
    }
  }, []);

  const salvarNoHistorico = (id) => {
    try {
      const historicoAtual = Array.isArray(historicoBusca) ? historicoBusca : [];
      const novoHistorico = [id, ...historicoAtual.filter(item => item !== id)].slice(0, 5); 
      setHistoricoBusca(novoHistorico);
      localStorage.setItem("tracking_history", JSON.stringify(novoHistorico));
    } catch (e) {
      console.error("Erro ao salvar histórico", e);
    }
  };

  const removerDoHistorico = (e, id) => {
    e.stopPropagation(); 
    try {
      const historicoAtual = Array.isArray(historicoBusca) ? historicoBusca : [];
      const novoHistorico = historicoAtual.filter(item => item !== id);
      setHistoricoBusca(novoHistorico);
      localStorage.setItem("tracking_history", JSON.stringify(novoHistorico));
    } catch (e) {
      console.error("Erro ao remover histórico", e);
    }
  };

  const buscarPedido = (e, idOpcional = null) => {
    if (e) e.preventDefault();
    const idParaBuscar = idOpcional || buscaId.trim();

    if (!idParaBuscar) return;

    if (!pedidos || !Array.isArray(pedidos)) {
        console.error("Erro: Lista de pedidos inválida");
        setErro(true);
        return;
    }

    const p = pedidos.find(item => String(item.id) === String(idParaBuscar));
    
    if (p) {
        setPedidoEncontrado(p);
        setErro(false);
        setNotificacaoAtiva(false);
        setAvaliacao(0); 
        salvarNoHistorico(idParaBuscar); 
    } else {
        setPedidoEncontrado(null);
        setErro(true);
    }
  };

  const limparBusca = () => {
      setPedidoEncontrado(null);
      setBuscaId("");
      setErro(false);
  };

  const toggleNotificacao = () => {
      if (!notificacaoAtiva) {
          alert("✅ Avisos ativados! Irá receber atualizações no seu WhatsApp.");
      }
      setNotificacaoAtiva(!notificacaoAtiva);
  };

  const handleInvoice = () => alert(`📄 A descarregar XML/PDF da Fatura do Pedido #${pedidoEncontrado.id}...`);
  
  const handleReport = () => {
      const motivo = prompt("Qual o problema? (Ex: Atraso, Produto Avariado)");
      if(motivo) alert("A sua solicitação foi aberta com prioridade. Entraremos em contacto.");
  };

  const handleCopyId = () => {
      navigator.clipboard.writeText(pedidoEncontrado.id);
      alert("ID copiado para a área de transferência!");
  };

  const handleCancel = () => {
      if(confirm("Tem a certeza que deseja cancelar este pedido? Esta ação é irreversível.")) {
          alert("Pedido cancelado com sucesso. O reembolso será processado em até 3 dias úteis.");
      }
  };

  const getProgress = (status) => {
      if (!status) return 0;
      switch(status) {
          case 'Pendente': return 10;
          case 'Processando': return 35;
          case 'Enviado': return 65;
          case 'Entregue': return 100;
          case 'Cancelado': return 100;
          default: return 0;
      }
  };

  const getStepDate = (stepCheck, currentStatus, orderDate) => {
      try {
          const steps = ['Pendente', 'Processando', 'Enviado', 'Entregue'];
          const currentIndex = steps.indexOf(currentStatus);
          const checkIndex = steps.indexOf(stepCheck);
          
          if (currentIndex >= checkIndex) {
              const hoje = new Date();
              const dataSimulada = new Date(hoje);
              dataSimulada.setDate(hoje.getDate() - (currentIndex - checkIndex));
              return dataSimulada.toLocaleDateString('pt-PT');
          }
      } catch (e) { return "-"; }
      return "-";
  };

  // --- MOCK DE LOG DETALHADO (NOVO) ---
  const getTimelineLog = (status) => {
      const logs = [
          { st: 'Pendente', msg: 'Pedido criado no sistema', icon: <FileText size={16}/> },
          { st: 'Pendente', msg: 'Pagamento aprovado', icon: <CheckCircle size={16}/> },
          { st: 'Processando', msg: 'Em separação no armazém', icon: <Package size={16}/> },
          { st: 'Processando', msg: 'Nota Fiscal emitida', icon: <FileText size={16}/> },
          { st: 'Enviado', msg: 'Coletado pela transportadora', icon: <Truck size={16}/> },
          { st: 'Enviado', msg: 'Chegou ao centro de distribuição local', icon: <MapPin size={16}/> },
          { st: 'Entregue', msg: 'Saiu para entrega ao destinatário', icon: <Truck size={16}/> },
          { st: 'Entregue', msg: 'Entregue com sucesso', icon: <CheckCircle size={16}/> },
      ];
      
      const steps = ['Pendente', 'Processando', 'Enviado', 'Entregue'];
      const currentIndex = steps.indexOf(status);
      
      // Retorna logs até o status atual (simulado)
      // Filtra logs baseados em um índice aproximado
      const limit = (currentIndex + 1) * 2; 
      return logs.slice(0, limit).reverse();
  };

  const isCancelado = pedidoEncontrado?.status === 'Cancelado';

  return (
    <div className="container py-5 fade-in" style={{minHeight: '70vh'}}>
      <div className="text-center mb-5">
          <h1 className="font-cinzel fw-bold mb-3">Rastreio de Pedido</h1>
          <p className="text-muted">Acompanhe a entrega dos seus produtos exclusivos em tempo real.</p>
      </div>

      {!pedidoEncontrado ? (
          <div className="row justify-content-center mb-5 fade-in">
              <div className="col-md-6">
                  <form onSubmit={(e) => buscarPedido(e)} className="d-flex gap-2 shadow-sm p-2 bg-white rounded border mb-4">
                      <input 
                        type="text" 
                        className="form-control border-0 shadow-none" 
                        placeholder="Digite o ID do pedido (ex: 12345)" 
                        value={buscaId}
                        onChange={e => setBuscaId(e.target.value)}
                      />
                      <button type="submit" className="btn btn-dark px-4 fw-bold d-flex align-items-center gap-2">
                          <MagnifyingGlass size={18} /> RASTREAR
                      </button>
                  </form>
                  
                  {erro && <div className="alert alert-danger mt-3 text-center animate-pulse border-0 shadow-sm"><small>Pedido não encontrado.</small></div>}

                  {Array.isArray(historicoBusca) && historicoBusca.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-muted small fw-bold text-uppercase mb-3 d-flex align-items-center gap-2">
                        <ClockCounterClockwise size={16}/> Pesquisas Recentes
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {historicoBusca.map((id, index) => (
                          <div 
                            key={`hist-${id}-${index}`} 
                            onClick={() => { setBuscaId(id); buscarPedido(null, id); }}
                            className="d-flex justify-content-between align-items-center bg-white border rounded p-2 px-3 cursor-pointer hover-scale shadow-sm"
                            style={{cursor: 'pointer'}}
                          >
                            <span className="fw-bold text-dark">#{id}</span>
                            <button 
                              onClick={(e) => removerDoHistorico(e, id)} 
                              className="btn btn-sm text-muted hover-danger p-0" 
                              title="Remover do histórico"
                            >
                              <Trash size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
          </div>
      ) : (
          <div className="row justify-content-center fade-in-up">
              <div className="col-lg-10">
                  <button onClick={limparBusca} className="btn btn-link text-muted text-decoration-none mb-3 px-0 d-flex align-items-center gap-2 hover-scale">
                      <ArrowLeft /> Fazer nova pesquisa
                  </button>

                  <div className="row g-4">
                      {/* COLUNA ESQUERDA - STATUS PRINCIPAL */}
                      <div className="col-lg-8">
                          <div className="card-custom p-5 border shadow-sm bg-white position-relative overflow-hidden h-100">
                              <div className="d-flex justify-content-between align-items-start mb-5 border-bottom pb-3 flex-wrap gap-3">
                                  <div>
                                      <div className="d-flex align-items-center gap-2 mb-1">
                                          <small className="text-muted text-uppercase fw-bold letter-spacing-1">Pedido #{pedidoEncontrado.id}</small>
                                          <button onClick={handleCopyId} className="btn btn-link p-0 text-muted" title="Copiar ID"><Copy size={14}/></button>
                                      </div>
                                      <h3 className={`fw-bold m-0 font-cinzel ${isCancelado ? 'text-danger' : 'text-dark'}`}>{pedidoEncontrado.status}</h3>
                                      {!isCancelado && pedidoEncontrado.status !== 'Entregue' && (
                                          <p className="text-success small fw-bold mt-1 mb-0 d-flex align-items-center gap-1">
                                              <CalendarBlank size={16}/> Previsão: Hoje até 18:00
                                          </p>
                                      )}
                                  </div>
                                  
                                  <div className="text-end">
                                      <button onClick={toggleNotificacao} className={`btn btn-sm d-flex align-items-center gap-2 mb-1 rounded-pill px-3 ${notificacaoAtiva ? 'btn-success text-white' : 'btn-outline-secondary'}`}>
                                        {notificacaoAtiva ? <CheckCircle weight="fill"/> : <BellRinging/>} 
                                        {notificacaoAtiva ? 'Avisos Ativos' : 'Receber Avisos'}
                                      </button>
                                  </div>
                              </div>

                              {/* TIMELINE VISUAL */}
                              <div className="position-relative mb-5 px-3">
                                  <div className="progress" style={{height: '4px'}}>
                                      <div className={`progress-bar ${isCancelado ? 'bg-danger' : 'bg-success'}`} style={{width: `${getProgress(pedidoEncontrado.status)}%`, transition: 'width 1s ease'}}></div>
                                  </div>
                                  
                                  <div className="d-flex justify-content-between position-absolute top-0 start-0 w-100 translate-middle-y">
                                      {['RECEBIDO', 'A PREPARAR', 'EM TRÂNSITO', isCancelado ? 'CANCELADO' : 'ENTREGUE'].map((label, i) => {
                                          const statusMap = ['Pendente', 'Processando', 'Enviado', 'Entregue'];
                                          const iconMap = [Clock, Package, Truck, isCancelado ? XCircle : CheckCircle];
                                          const Icon = iconMap[i];
                                          const isActive = getProgress(pedidoEncontrado.status) >= [10, 35, 65, 100][i];
                                          const colorClass = isActive ? (isCancelado ? 'text-danger' : 'text-success') : 'text-muted';
                                          
                                          return (
                                              <div key={i} className={`text-center bg-white p-2 ${colorClass}`}>
                                                  <Icon size={32} weight="fill" className="bg-white position-relative z-index-1"/>
                                                  <small className="d-block mt-2 fw-bold" style={{fontSize: '10px'}}>{label}</small>
                                                  <small className="d-block text-muted" style={{fontSize: '9px'}}>{getStepDate(statusMap[i], pedidoEncontrado.status, pedidoEncontrado.data)}</small>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>

                              {/* DETALHES DO MOTORISTA */}
                              {(pedidoEncontrado.status === 'Enviado' || pedidoEncontrado.status === 'Entregue') && !isCancelado && (
                                  <div className="bg-light p-3 rounded border mb-4 d-flex align-items-center gap-3">
                                     <div className="bg-white p-2 rounded-circle shadow-sm border"><User size={24} className="text-dark"/></div>
                                     <div>
                                        <h6 className="m-0 fw-bold">Carlos Silva (Loggi)</h6>
                                        <small className="text-muted d-block" style={{fontSize:'11px'}}>Fiat Fiorino • ABC-1234</small>
                                     </div>
                                     <div className="ms-auto"><span className="badge bg-success bg-opacity-10 text-success border border-success">4.9 ★</span></div>
                                  </div>
                              )}

                              {/* AÇÕES RÁPIDAS GRID */}
                              <div className="row g-2">
                                  <div className="col-6"><button onClick={handleInvoice} className="btn btn-outline-dark btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"><FileText size={18}/> Fatura</button></div>
                                  <div className="col-6"><button onClick={handleReport} className="btn btn-outline-dark btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"><ChatTeardropText size={18}/> Ajuda</button></div>
                                  {pedidoEncontrado.status === 'Pendente' && !isCancelado && (
                                      <div className="col-12"><button onClick={handleCancel} className="btn btn-outline-danger btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"><XCircle size={18}/> Cancelar Pedido</button></div>
                                  )}
                              </div>
                          </div>
                      </div>

                      {/* COLUNA DIREITA - LOG E INFO */}
                      <div className="col-lg-4">
                          <div className="d-flex flex-column gap-4 h-100">
                              {/* LOG DE ATIVIDADES */}
                              <div className="card-custom p-4 border shadow-sm bg-white flex-grow-1">
                                  <h6 className="fw-bold border-bottom pb-2 mb-3">Histórico de Eventos</h6>
                                  <div className="d-flex flex-column gap-3 overflow-auto" style={{maxHeight: '300px'}}>
                                      {getTimelineLog(pedidoEncontrado.status).map((log, idx) => (
                                          <div key={idx} className="d-flex gap-3">
                                              <div className="d-flex flex-column align-items-center">
                                                  <div className="bg-light p-1 rounded-circle border">{log.icon}</div>
                                                  {idx !== getTimelineLog(pedidoEncontrado.status).length -1 && <div className="h-100 border-start my-1"></div>}
                                              </div>
                                              <div>
                                                  <small className="fw-bold d-block text-dark">{log.msg}</small>
                                                  <small className="text-muted" style={{fontSize:'10px'}}>Atualizado recentemente</small>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* ENDEREÇO */}
                              <div className="card-custom p-4 border shadow-sm bg-white">
                                  <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-2"><MapPin size={18}/> Entrega</h6>
                                  <p className="mb-1 text-muted small fw-bold">Casa (Principal)</p>
                                  <p className="mb-1 text-muted small">Rua Exemplo das Acácias, 123</p>
                                  <p className="mb-0 text-muted small">Lisboa - PT, 1000-001</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}