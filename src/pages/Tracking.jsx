import { useState } from "react";
import { Package, Truck, CheckCircle, MagnifyingGlass } from "phosphor-react";

export function Tracking({ pedidos }) {
  const [busca, setBusca] = useState("");
  const [res, setRes] = useState(null);

  const buscar = (e) => {
      e.preventDefault();
      const p = pedidos.find(item => item.id.toString() === busca);
      setRes(p || "nulo");
  };

  // Cálculo da barra de progresso
  const getProgress = (status) => {
      if (status === "Enviado") return 50;
      if (status === "Entregue") return 100;
      return 10; // Processando
  };

  return (
    <div className="container py-5 fade-in" style={{minHeight: '70vh'}}>
        <div className="text-center mb-5">
            <h1 className="font-cinzel fw-bold">Rastrear Pedido</h1>
            <p className="text-muted">Acompanhe a jornada dos seus móveis.</p>
        </div>

        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={buscar} className="input-group mb-5 shadow-sm">
                    <input className="form-control border-0 py-3 ps-4" placeholder="Digite o ID do Pedido (ex: 12345)" value={busca} onChange={e=>setBusca(e.target.value)}/>
                    <button className="btn btn-dark px-4"><MagnifyingGlass size={24}/></button>
                </form>

                {res && res !== "nulo" && (
                    <div className="bg-white p-5 rounded shadow-sm border position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div><h4 className="m-0 font-cinzel">Pedido #{res.id}</h4><small className="text-muted">{res.data}</small></div>
                            <span className="badge bg-dark fs-6">{res.status}</span>
                        </div>

                        {/* TIMELINE VISUAL */}
                        <div className="position-relative my-5 mx-3">
                            <div className="progress" style={{height: '4px'}}>
                                <div className="progress-bar bg-success" role="progressbar" style={{width: `${getProgress(res.status)}%`}}></div>
                            </div>
                            <div className="position-absolute top-0 start-0 translate-middle btn btn-success rounded-circle btn-sm" style={{marginTop: '2px'}}><Package size={16}/></div>
                            <div className={`position-absolute top-0 start-50 translate-middle btn rounded-circle btn-sm ${getProgress(res.status) >= 50 ? 'btn-success' : 'btn-secondary'}`} style={{marginTop: '2px'}}><Truck size={16}/></div>
                            <div className={`position-absolute top-0 start-100 translate-middle btn rounded-circle btn-sm ${getProgress(res.status) >= 100 ? 'btn-success' : 'btn-secondary'}`} style={{marginTop: '2px'}}><CheckCircle size={16}/></div>
                            
                            <div className="d-flex justify-content-between mt-2 small fw-bold text-muted">
                                <span>Processando</span>
                                <span>Enviado</span>
                                <span>Entregue</span>
                            </div>
                        </div>

                        <div className="bg-light p-3 rounded">
                            <h6 className="mb-2 font-cinzel">Itens do Pedido:</h6>
                            <ul className="list-unstyled m-0">
                                {res.itens.map((item, idx) => (
                                    <li key={idx} className="d-flex justify-content-between border-bottom py-2">
                                        <span>{item.quantidade}x {item.nome}</span>
                                        <span className="fw-bold">R$ {item.preco.toLocaleString('pt-BR')}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-end mt-3 pt-2 border-top">
                                <h5 className="m-0">Total: R$ {res.total.toLocaleString('pt-BR')}</h5>
                            </div>
                        </div>
                    </div>
                )}

                {res === "nulo" && (
                    <div className="alert alert-danger text-center shadow-sm border-0">
                        <p className="m-0 fw-bold">Pedido não encontrado.</p>
                        <small>Verifique o código e tente novamente.</small>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}