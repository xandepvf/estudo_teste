import { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowLeft,
  Trash,
  ClockCounterClockwise,
  BellRinging,
  User,
  Star,
  Smiley,
  FileText,
  WarningCircle
} from "phosphor-react";

export function Tracking({ pedidos = [] }) {
  const [buscaId, setBuscaId] = useState("");
  const [pedidoEncontrado, setPedidoEncontrado] = useState(null);
  const [erro, setErro] = useState(false);
  const [historicoBusca, setHistoricoBusca] = useState([]);
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(false);
  const [avaliacao, setAvaliacao] = useState(0);

  // --- HISTÓRICO LOCAL ---
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem("tracking_history") || "[]");
      if (Array.isArray(salvo)) setHistoricoBusca(salvo);
    } catch {
      setHistoricoBusca([]);
    }
  }, []);

  const salvarNoHistorico = (id) => {
    const novo = [id, ...historicoBusca.filter(h => h !== id)].slice(0, 5);
    setHistoricoBusca(novo);
    localStorage.setItem("tracking_history", JSON.stringify(novo));
  };

  const removerDoHistorico = (e, id) => {
    e.stopPropagation();
    const novo = historicoBusca.filter(h => h !== id);
    setHistoricoBusca(novo);
    localStorage.setItem("tracking_history", JSON.stringify(novo));
  };

  // --- BUSCA ---
  const buscarPedido = (e, idOpcional = null) => {
    if (e) e.preventDefault();
    const id = (idOpcional || buscaId).trim();
    if (!id) return;

    const pedido = pedidos.find(p => String(p.id) === String(id));

    if (pedido) {
      setPedidoEncontrado(pedido);
      setErro(false);
      setAvaliacao(0);
      setNotificacaoAtiva(false);
      salvarNoHistorico(id);
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

  // --- AUX ---
  const getProgress = (status) => {
    switch (status) {
      case "Pendente": return 10;
      case "Processando": return 35;
      case "Enviado": return 65;
      case "Entregue":
      case "Cancelado": return 100;
      default: return 0;
    }
  };

  const getStepDate = (step, status, data) => {
    const steps = ["Pendente", "Processando", "Enviado", "Entregue"];
    if (steps.indexOf(status) < steps.indexOf(step)) return "-";

    if (!data) return "-";
    const [d, m, y] = data.split("/");
    const base = new Date(y, m - 1, d);
    if (isNaN(base)) return data;

    base.setDate(base.getDate() + steps.indexOf(step));
    return base.toLocaleDateString("pt-BR");
  };

  const isCancelado = pedidoEncontrado?.status === "Cancelado";

  return (
    <div className="container py-5" style={{ minHeight: "70vh" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold">Rastreamento de Pedido</h1>
        <p className="text-muted">Acompanhe sua entrega em tempo real</p>
      </div>

      {!pedidoEncontrado ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={buscarPedido} className="d-flex gap-2 p-2 bg-white border rounded shadow-sm">
              <input
                className="form-control border-0 shadow-none"
                placeholder="Digite o ID do pedido"
                value={buscaId}
                onChange={(e) => setBuscaId(e.target.value)}
              />
              <button className="btn btn-dark px-4 d-flex align-items-center gap-2">
                <MagnifyingGlass size={18} /> Rastrear
              </button>
            </form>

            {erro && (
              <div className="alert alert-danger mt-3 text-center">
                Pedido não encontrado.
              </div>
            )}

            {historicoBusca.length > 0 && (
              <div className="mt-4">
                <h6 className="text-muted fw-bold d-flex align-items-center gap-2">
                  <ClockCounterClockwise size={16} /> Buscas Recentes
                </h6>

                {historicoBusca.map((id, i) => (
                  <div
                    key={i}
                    onClick={() => buscarPedido(null, id)}
                    className="d-flex justify-content-between align-items-center bg-white border rounded p-2 mt-2"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="fw-bold">#{id}</span>
                    <button
                      onClick={(e) => removerDoHistorico(e, id)}
                      className="btn btn-sm text-danger"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <button onClick={limparBusca} className="btn btn-link mb-3">
              <ArrowLeft /> Nova busca
            </button>

            <div className="card p-4 shadow-sm">
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <small className="text-muted">Pedido #{pedidoEncontrado.id}</small>
                  <h4 className={isCancelado ? "text-danger" : ""}>
                    {pedidoEncontrado.status}
                  </h4>
                </div>
                <button
                  className={`btn btn-sm ${notificacaoAtiva ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setNotificacaoAtiva(!notificacaoAtiva)}
                >
                  <BellRinging /> {notificacaoAtiva ? "Avisos ativos" : "Receber avisos"}
                </button>
              </div>

              <div className="progress mb-4" style={{ height: 5 }}>
                <div
                  className={`progress-bar ${isCancelado ? "bg-danger" : "bg-success"}`}
                  style={{ width: `${getProgress(pedidoEncontrado.status)}%` }}
                />
              </div>

              <div className="d-flex justify-content-between text-center">
                <div>
                  <Clock size={28} />
                  <small className="d-block">Recebido</small>
                  <small>{pedidoEncontrado.data}</small>
                </div>
                <div>
                  <Package size={28} />
                  <small className="d-block">Preparando</small>
                  <small>{getStepDate("Processando", pedidoEncontrado.status, pedidoEncontrado.data)}</small>
                </div>
                <div>
                  <Truck size={28} />
                  <small className="d-block">Enviado</small>
                  <small>{getStepDate("Enviado", pedidoEncontrado.status, pedidoEncontrado.data)}</small>
                </div>
                <div>
                  <CheckCircle size={28} />
                  <small className="d-block">{isCancelado ? "Cancelado" : "Entregue"}</small>
                  <small>{getStepDate("Entregue", pedidoEncontrado.status, pedidoEncontrado.data)}</small>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button className="btn btn-outline-dark btn-sm me-2">
                  <FileText /> Nota Fiscal
                </button>
                <button className="btn btn-outline-danger btn-sm">
                  <WarningCircle /> Relatar problema
                </button>
              </div>

              {pedidoEncontrado.status === "Entregue" && !isCancelado && (
                <div className="mt-4 text-center">
                  {avaliacao === 0 ? (
                    <>
                      <p className="fw-bold">
                        <Smiley /> Avalie sua entrega
                      </p>
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          className="btn btn-link text-warning"
                          onClick={() => setAvaliacao(n)}
                        >
                          <Star size={28} />
                        </button>
                      ))}
                    </>
                  ) : (
                    <p className="text-success fw-bold">
                      Obrigado pelo feedback!
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 bg-light p-3 rounded">
                <h6 className="fw-bold d-flex align-items-center gap-2">
                  <MapPin /> Endereço de entrega
                </h6>
                <small>Rua Exemplo, 123 – São Paulo/SP</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
