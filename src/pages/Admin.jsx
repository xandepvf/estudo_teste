import { useState } from "react";
import { 
  ChartBar, Package, ShoppingCart, Users, CurrencyDollar, 
  TrendUp, Warning, CheckCircle, Clock, Truck, XCircle, 
  MagnifyingGlass, PencilSimple, Trash
} from "phosphor-react";

export function Admin({ 
  pedidos, produtos, onUpdateStatus, userLogado, 
  listaUsuarios, onRemoveUser, onEditUser, 
  onAddProduct, onRemoveProduct 
}) {
  const [tab, setTab] = useState("dashboard");
  const [filtroPedido, setFiltroPedido] = useState("");

  // --- CÁLCULOS DE KPI ---
  const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.total, 0);
  const pedidosPendentes = pedidos.filter(p => p.status !== "Entregue" && p.status !== "Cancelado").length;
  const produtosBaixoEstoque = produtos.filter(p => p.estoque < 5).length;
  const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;

  // --- SIMULAÇÃO DE DADOS PARA GRÁFICO (Vendas da Semana) ---
  const vendasSemana = [
    { dia: "Seg", valor: 1200 }, { dia: "Ter", valor: 2100 }, 
    { dia: "Qua", valor: 800 }, { dia: "Qui", valor: 1600 }, 
    { dia: "Sex", valor: 3200 }, { dia: "Sáb", valor: 2800 }, { dia: "Dom", valor: 1500 }
  ];
  const maxVenda = Math.max(...vendasSemana.map(d => d.valor));

  const StatusBadge = ({ status }) => {
    const colors = {
      "Pendente": "bg-warning text-dark",
      "Processando": "bg-info text-dark",
      "Enviado": "bg-primary text-white",
      "Entregue": "bg-success text-white",
      "Cancelado": "bg-danger text-white"
    };
    return <span className={`badge ${colors[status] || "bg-secondary"} rounded-pill px-3`}>{status}</span>;
  };

  if (!userLogado || userLogado.email !== "admin@empresa.com") {
      // Simples proteção de frontend (Idealmente seria no Backend)
     // Para testar, você pode logar com esse email ou remover essa checagem
  }

  return (
    <div className="d-flex min-vh-100 bg-light font-cinzel fade-in">
      
      {/* SIDEBAR */}
      <aside className="bg-white border-end d-flex flex-column p-3" style={{width: '280px'}}>
        <div className="mb-5 px-2">
            <h4 className="fw-bold text-primary-custom d-flex align-items-center gap-2">
                <ChartBar size={32}/> GESTÃO
            </h4>
            <small className="text-muted">Painel de Controle v2.0</small>
        </div>

        <nav className="nav flex-column gap-2">
            <button onClick={() => setTab("dashboard")} className={`btn text-start d-flex align-items-center gap-3 ${tab==="dashboard" ? "btn-primary-custom" : "btn-light"}`}>
                <TrendUp size={20}/> Dashboard
            </button>
            <button onClick={() => setTab("pedidos")} className={`btn text-start d-flex align-items-center gap-3 ${tab==="pedidos" ? "btn-primary-custom" : "btn-light"}`}>
                <ShoppingCart size={20}/> Pedidos
                {pedidosPendentes > 0 && <span className="badge bg-danger ms-auto">{pedidosPendentes}</span>}
            </button>
            <button onClick={() => setTab("produtos")} className={`btn text-start d-flex align-items-center gap-3 ${tab==="produtos" ? "btn-primary-custom" : "btn-light"}`}>
                <Package size={20}/> Estoque
                {produtosBaixoEstoque > 0 && <span className="badge bg-warning text-dark ms-auto">{produtosBaixoEstoque}</span>}
            </button>
            <button onClick={() => setTab("clientes")} className={`btn text-start d-flex align-items-center gap-3 ${tab==="clientes" ? "btn-primary-custom" : "btn-light"}`}>
                <Users size={20}/> Clientes
            </button>
        </nav>

        <div className="mt-auto p-3 bg-light rounded text-center border">
            <small className="d-block text-muted mb-1">Status do Sistema</small>
            <span className="badge bg-success"><CheckCircle className="me-1"/> Operacional</span>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-grow-1 p-5 overflow-auto" style={{maxHeight: '100vh'}}>
        
        {/* --- DASHBOARD --- */}
        {tab === "dashboard" && (
            <div className="fade-in">
                <h2 className="fw-bold mb-4">Visão Geral</h2>
                
                {/* CARDS DE KPI */}
                <div className="row g-4 mb-5">
                    <div className="col-md-3">
                        <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-success h-100">
                            <div className="d-flex justify-content-between text-success mb-2"><CurrencyDollar size={32}/><TrendUp size={24}/></div>
                            <small className="text-muted text-uppercase fw-bold">Faturamento Total</small>
                            <h3 className="fw-bold mt-1">R$ {faturamentoTotal.toLocaleString('pt-BR')}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-primary h-100">
                            <div className="d-flex justify-content-between text-primary mb-2"><ShoppingCart size={32}/><Clock size={24}/></div>
                            <small className="text-muted text-uppercase fw-bold">Pedidos Totais</small>
                            <h3 className="fw-bold mt-1">{pedidos.length}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-warning h-100">
                            <div className="d-flex justify-content-between text-warning mb-2"><Package size={32}/><Warning size={24}/></div>
                            <small className="text-muted text-uppercase fw-bold">Baixo Estoque</small>
                            <h3 className="fw-bold mt-1">{produtosBaixoEstoque} <span className="fs-6 text-muted font-normal">itens</span></h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="bg-white p-4 rounded shadow-sm border-start border-4 border-info h-100">
                            <div className="d-flex justify-content-between text-info mb-2"><Users size={32}/><Users size={24}/></div>
                            <small className="text-muted text-uppercase fw-bold">Clientes Ativos</small>
                            <h3 className="fw-bold mt-1">{listaUsuarios.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* GRÁFICO DE VENDAS (CSS PURO) */}
                    <div className="col-lg-8">
                        <div className="bg-white p-4 rounded shadow-sm h-100">
                            <h5 className="fw-bold mb-4">Performance de Vendas (Semana)</h5>
                            <div className="d-flex align-items-end justify-content-between px-2" style={{height: '300px'}}>
                                {vendasSemana.map((d, i) => (
                                    <div key={i} className="text-center w-100 mx-1 group">
                                        <div className="d-flex justify-content-center">
                                             <div 
                                                className="bg-primary-custom rounded-top position-relative hover-scale" 
                                                style={{width: '40px', height: `${(d.valor / maxVenda) * 250}px`, transition: 'height 1s ease'}}
                                                title={`R$ ${d.valor}`}
                                             >
                                                <span className="position-absolute top-0 start-50 translate-middle-x mt-2 text-white small" style={{fontSize:'10px', writingMode:'vertical-rl', transform:'rotate(180deg)'}}>
                                                    R$ {d.valor}
                                                </span>
                                             </div>
                                        </div>
                                        <small className="d-block mt-2 text-muted fw-bold">{d.dia}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ÚLTIMOS PEDIDOS */}
                    <div className="col-lg-4">
                        <div className="bg-white p-4 rounded shadow-sm h-100">
                            <h5 className="fw-bold mb-3">Atividade Recente</h5>
                            <div className="d-flex flex-column gap-3">
                                {pedidos.slice(0, 5).map(p => (
                                    <div key={p.id} className="d-flex align-items-center gap-3 border-bottom pb-2">
                                        <div className="bg-light p-2 rounded"><ShoppingCart size={20}/></div>
                                        <div>
                                            <p className="m-0 fw-bold small">Pedido #{p.id}</p>
                                            <small className="text-muted">{p.cliente} - {p.hora}</small>
                                        </div>
                                        <div className="ms-auto text-end">
                                            <small className="d-block fw-bold text-success">R$ {p.total.toLocaleString('pt-BR')}</small>
                                            <StatusBadge status={p.status}/>
                                        </div>
                                    </div>
                                ))}
                                {pedidos.length === 0 && <p className="text-muted small">Nenhuma atividade.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- GESTÃO DE PEDIDOS --- */}
        {tab === "pedidos" && (
            <div className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Gestão de Pedidos</h2>
                    <div className="input-group w-25">
                        <span className="input-group-text bg-white"><MagnifyingGlass/></span>
                        <input type="text" className="form-control" placeholder="Buscar ID ou Cliente..." value={filtroPedido} onChange={e=>setFiltroPedido(e.target.value)}/>
                    </div>
                </div>

                <div className="bg-white rounded shadow-sm overflow-hidden">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 ps-4">ID</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Total</th>
                                <th>Status Atual</th>
                                <th>Ações (Workflow)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.filter(p => p.id.toString().includes(filtroPedido) || p.cliente.toLowerCase().includes(filtroPedido.toLowerCase())).map(pedido => (
                                <tr key={pedido.id}>
                                    <td className="ps-4 fw-bold text-muted">#{pedido.id}</td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold">{pedido.cliente}</span>
                                            <small className="text-muted">{pedido.emailCliente}</small>
                                        </div>
                                    </td>
                                    <td>{pedido.data}</td>
                                    <td className="fw-bold">R$ {pedido.total.toLocaleString('pt-BR')}</td>
                                    <td><StatusBadge status={pedido.status}/></td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button onClick={()=>onUpdateStatus(pedido.id, "Processando")} className="btn btn-outline-secondary" title="Confirmar Pgto"><CheckCircle/></button>
                                            <button onClick={()=>onUpdateStatus(pedido.id, "Enviado")} className="btn btn-outline-primary" title="Enviar"><Truck/></button>
                                            <button onClick={()=>onUpdateStatus(pedido.id, "Entregue")} className="btn btn-outline-success" title="Finalizar"><Package/></button>
                                            <button onClick={()=>onUpdateStatus(pedido.id, "Cancelado")} className="btn btn-outline-danger" title="Cancelar"><XCircle/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- GESTÃO DE ESTOQUE (PRODUTOS) --- */}
        {tab === "produtos" && (
            <div className="fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Estoque & Catálogo</h2>
                    <button className="btn btn-primary-custom" onClick={() => alert("Modal de cadastro aqui")}>+ Novo Produto</button>
                </div>

                <div className="row g-4">
                    {produtos.map(prod => (
                        <div className="col-md-6 col-lg-4" key={prod.id}>
                            <div className={`card-custom p-3 d-flex gap-3 align-items-center ${prod.estoque < 5 ? 'border-warning border-2' : ''}`}>
                                <img src={prod.img} className="rounded object-fit-cover" width="80" height="80"/>
                                <div className="flex-grow-1">
                                    <h6 className="m-0 fw-bold text-truncate">{prod.nome}</h6>
                                    <small className="text-muted">SKU: {prod.sku || 'N/A'}</small>
                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                        <span className="fw-bold text-primary-custom">R$ {prod.preco}</span>
                                        <span className={`badge ${prod.estoque < 5 ? 'bg-warning text-dark' : 'bg-light text-dark border'}`}>
                                            {prod.estoque} un.
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <button className="btn btn-sm btn-light border" onClick={()=>alert('Editar ' + prod.nome)}><PencilSimple/></button>
                                    <button className="btn btn-sm btn-light border text-danger" onClick={()=>onRemoveProduct(prod.id)}><Trash/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- CLIENTES --- */}
        {tab === "clientes" && (
            <div className="fade-in">
                <h2 className="fw-bold mb-4">Base de Clientes (CRM)</h2>
                <div className="bg-white rounded shadow-sm p-4">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th>Data Cadastro</th>
                                <th>Histórico</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaUsuarios.map((u, i) => (
                                <tr key={i}>
                                    <td className="fw-bold"><Users className="me-2 text-muted"/>{u.nome}</td>
                                    <td>{u.email}</td>
                                    <td>{u.dataCadastro || 'N/A'}</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {pedidos.filter(p => p.emailCliente === u.email).length} pedidos
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}