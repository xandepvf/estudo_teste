import { useState } from "react";
import { 
  ChartBar, Package, ShoppingCart, Users, CurrencyDollar, 
  TrendUp, Warning, CheckCircle, Truck, XCircle, 
  MagnifyingGlass, DownloadSimple, ArrowUpRight, Plus, Trash, PencilSimple, Image, Gear, Receipt, EnvelopeSimple, Phone
} from "phosphor-react";

export function Admin({ 
  pedidos, produtos, onUpdateStatus, userLogado, 
  listaUsuarios, onRemoveProduct, onAddProduct, onEditProduct,
  onUpdateConfig, configLoja 
}) {
  const [tab, setTab] = useState("dashboard");
  const [filtroPedido, setFiltroPedido] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  
  // Estado para formulário de produto
  const [showProductForm, setShowProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ 
      id: null,
      nome: "", 
      preco: "", 
      categoria: "Sala", 
      img: "", 
      estoque: 10 
  });

  // Estado para Configurações
  const [configLocal, setConfigLocal] = useState(configLoja);

  // Estado para Modal de Detalhes do Pedido
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // KPIs
  const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.total, 0);
  const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;
  const pedidosPendentes = pedidos.filter(p => p.status === "Pendente" || p.status === "Processando").length;
  const estoqueCritico = produtos.filter(p => p.estoque < 5).length;

  // Gráfico Simulado
  const vendasSemana = [
    { dia: "Seg", valor: 1200 }, { dia: "Ter", valor: 2100 }, 
    { dia: "Qua", valor: 800 }, { dia: "Qui", valor: 1600 }, 
    { dia: "Sex", valor: 3200 }, { dia: "Sáb", valor: 2800 }, { dia: "Dom", valor: 1500 }
  ];
  const maxVenda = Math.max(...vendasSemana.map(d => d.valor));

  // --- AÇÕES ---
  const handleNewProductClick = () => {
      setNovoProduto({ id: null, nome: "", preco: "", categoria: "Sala", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800", estoque: 10 });
      setIsEditing(false);
      setShowProductForm(true);
  };

  const handleEditClick = (prod) => {
      setNovoProduto({ ...prod });
      setIsEditing(true);
      setShowProductForm(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.preco) return alert("Preencha os campos obrigatórios");
    
    const produtoFinal = {
        ...novoProduto,
        preco: Number(novoProduto.preco),
        estoque: Number(novoProduto.estoque)
    };

    if (isEditing) {
        onEditProduct(produtoFinal);
    } else {
        onAddProduct({ ...produtoFinal, id: Date.now() });
    }
    
    setShowProductForm(false);
    setIsEditing(false);
    setNovoProduto({ id: null, nome: "", preco: "", categoria: "Sala", img: "", estoque: 10 });
  };

  const handleSaveConfig = (e) => {
      e.preventDefault();
      onUpdateConfig(configLocal);
  };

  const exportarCSV = () => {
    const header = "ID,Cliente,Data,Total,Status\n";
    const dadosParaExportar = pedidos.filter(p=> p.id.toString().includes(filtroPedido));
    const rows = dadosParaExportar.map(p => `${p.id},${p.cliente},${p.data},${p.total},${p.status}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_vendas_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const StatusBadge = ({ status }) => {
    const config = {
      "Pendente": { color: "bg-warning text-dark" },
      "Processando": { color: "bg-info text-white" },
      "Enviado": { color: "bg-primary text-white" },
      "Entregue": { color: "bg-success text-white" },
      "Cancelado": { color: "bg-danger text-white" }
    };
    const { color } = config[status] || { color: "bg-secondary" };
    return <span className={`badge ${color} rounded-pill fw-normal px-3 py-2 text-uppercase letter-spacing-1`} style={{fontSize: '0.7rem'}}>{status}</span>;
  };

  return (
    <div className="d-flex min-vh-100 bg-light fade-in">
      
      {/* SIDEBAR */}
      <aside className="bg-white border-end d-flex flex-column p-0 sticky-top" style={{width: '260px', height: '100vh', top:0}}>
        <div className="p-4 border-bottom bg-dark text-white">
            <h5 className="font-brand fw-bold m-0 d-flex align-items-center gap-2 letter-spacing-1">
                <ChartBar size={24} weight="fill" className="text-warning"/> GESTÃO PRO
            </h5>
        </div>

        <nav className="nav flex-column p-3 gap-2">
            {[
                { id: "dashboard", icon: <TrendUp size={20}/>, label: "Visão Geral" },
                { id: "pedidos", icon: <ShoppingCart size={20}/>, label: "Pedidos", badge: pedidosPendentes },
                { id: "produtos", icon: <Package size={20}/>, label: "Catálogo", warning: estoqueCritico > 0 },
                { id: "clientes", icon: <Users size={20}/>, label: "CRM Clientes" },
                { id: "config", icon: <Gear size={20}/>, label: "Configurações" },
            ].map(item => (
                <button 
                    key={item.id}
                    onClick={() => setTab(item.id)} 
                    className={`btn text-start d-flex align-items-center gap-3 px-3 py-2 rounded transition-all ${tab===item.id ? "bg-primary-custom text-white shadow-sm" : "text-muted hover-bg-light"}`}
                >
                    {item.icon} {item.label}
                    {item.badge > 0 && <span className="badge bg-danger ms-auto rounded-circle small">{item.badge}</span>}
                    {item.warning && <Warning size={16} className="text-warning ms-auto"/>}
                </button>
            ))}
        </nav>

        <div className="mt-auto p-4 border-top bg-light">
            <div className="d-flex align-items-center gap-3">
                <div className="bg-white rounded-circle p-2 border shadow-sm"><Users size={20} className="text-dark"/></div>
                <div className="small overflow-hidden">
                    <strong className="d-block text-truncate text-dark">{userLogado?.nome || "Admin"}</strong>
                    <span className="text-muted text-truncate d-block" style={{fontSize: '10px'}}>Loja: {configLoja.nome}</span>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1 p-5 overflow-auto" style={{height: '100vh'}}>
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h2 className="font-brand fw-bold m-0 text-capitalize text-dark">{tab === "dashboard" ? "Painel de Controlo" : tab}</h2>
                <p className="text-muted m-0 small">Bem-vindo de volta. Visão geral atualizada.</p>
            </div>
            <div className="d-flex gap-2">
                {tab === "pedidos" && (
                    <button className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 shadow-sm" onClick={exportarCSV}>
                        <DownloadSimple size={18}/> Exportar CSV
                    </button>
                )}
                {tab === "produtos" && (
                    <button className="btn btn-primary-custom btn-sm d-flex align-items-center gap-2 shadow-sm" onClick={handleNewProductClick}>
                        <Plus size={18}/> Novo Produto
                    </button>
                )}
            </div>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
            <div className="fade-in-up">
                <div className="row g-4 mb-5">
                    {[
                        { label: "Faturamento", val: `${faturamentoTotal.toLocaleString('pt-PT')}€`, icon: <CurrencyDollar size={32} className="text-success"/>, sub: "+12% vs mês anterior" },
                        { label: "Aguardando", val: pedidosPendentes, icon: <ShoppingCart size={32} className="text-warning"/>, sub: "Pedidos novos" },
                        { label: "Ticket Médio", val: `${ticketMedio.toLocaleString('pt-PT')}€`, icon: <TrendUp size={32} className="text-primary"/>, sub: "Estável" },
                        { label: "Clientes", val: listaUsuarios.length, icon: <Users size={32} className="text-info"/>, sub: "Base total" }
                    ].map((kpi, i) => (
                        <div className="col-md-3" key={i}>
                            <div className="card-custom p-4 h-100 border-0 shadow-sm transition-all hover-lift">
                                <div className="d-flex justify-content-between mb-3">{kpi.icon}</div>
                                <h3 className="fw-bold m-0 text-dark">{kpi.val}</h3>
                                <small className="text-muted d-block text-uppercase fw-bold mt-1 letter-spacing-1" style={{fontSize:'10px'}}>{kpi.label}</small>
                                <small className="text-success mt-2 d-flex align-items-center gap-1" style={{fontSize:'11px'}}><ArrowUpRight/> {kpi.sub}</small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* GRÁFICO DE BARRAS */}
                <div className="card-custom p-4 border-0 shadow-sm mb-5">
                    <h5 className="fw-bold mb-4 font-brand text-dark">Performance Semanal</h5>
                    <div className="d-flex align-items-end justify-content-between px-2" style={{height: '250px'}}>
                        {vendasSemana.map((d, i) => (
                            <div key={i} className="text-center w-100 mx-2 group position-relative">
                                <div 
                                    className="bg-dark rounded-top opacity-75 hover-opacity-100 transition-all" 
                                    style={{height: `${(d.valor / maxVenda) * 100}%`, minHeight: '10px'}}
                                    title={`${d.valor}€`}
                                ></div>
                                <small className="d-block mt-2 text-muted fw-bold text-uppercase" style={{fontSize:'10px'}}>{d.dia}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* PEDIDOS */}
        {tab === "pedidos" && (
            <div className="card-custom border-0 shadow-sm fade-in">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white rounded-top">
                    <h5 className="fw-bold m-0 font-brand">Vendas Recentes</h5>
                    <div className="input-group w-25 input-group-sm">
                        <span className="input-group-text bg-light border-end-0"><MagnifyingGlass/></span>
                        <input className="form-control border-start-0 bg-light" placeholder="Buscar ID..." value={filtroPedido} onChange={e=>setFiltroPedido(e.target.value)}/>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light text-muted small text-uppercase">
                            <tr>
                                <th className="ps-4 py-3">ID</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.filter(p=> p.id.toString().includes(filtroPedido)).map(pedido => (
                                <tr key={pedido.id}>
                                    <td className="ps-4 fw-bold text-dark">#{pedido.id}</td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold text-dark">{pedido.cliente}</span>
                                            <small className="text-muted" style={{fontSize:'11px'}}>{pedido.emailCliente}</small>
                                        </div>
                                    </td>
                                    <td className="text-muted small">{pedido.data}</td>
                                    <td className="fw-bold text-dark">{pedido.total.toLocaleString('pt-PT')}€</td>
                                    <td><StatusBadge status={pedido.status}/></td>
                                    <td className="text-end pe-4">
                                        <div className="btn-group">
                                            <button className="btn btn-sm btn-light border shadow-sm" onClick={()=>setPedidoSelecionado(pedido)} title="Ver Detalhes"><Receipt/></button>
                                            <button className="btn btn-sm btn-light border dropdown-toggle shadow-sm" data-bs-toggle="dropdown">Status</button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li><button className="dropdown-item small" onClick={()=>onUpdateStatus(pedido.id, "Processando")}>Processando</button></li>
                                                <li><button className="dropdown-item small" onClick={()=>onUpdateStatus(pedido.id, "Enviado")}>Enviado</button></li>
                                                <li><button className="dropdown-item small" onClick={()=>onUpdateStatus(pedido.id, "Entregue")}>Entregue</button></li>
                                                <li><hr className="dropdown-divider"/></li>
                                                <li><button className="dropdown-item text-danger small" onClick={()=>onUpdateStatus(pedido.id, "Cancelado")}>Cancelar</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* PRODUTOS */}
        {tab === "produtos" && (
            <div className="fade-in">
                {showProductForm && (
                    <div className="card-custom p-4 border-0 shadow-sm mb-4 animate-fade-in bg-white position-relative">
                        <div className="d-flex justify-content-between mb-3"><h6 className="fw-bold m-0">{isEditing ? "Editar" : "Novo"} Produto</h6><button onClick={()=>setShowProductForm(false)} className="btn-close"></button></div>
                        <form onSubmit={handleSaveProduct}>
                            <div className="row g-3">
                                <div className="col-md-6"><label className="small fw-bold text-muted">Nome</label><input className="form-control" value={novoProduto.nome} onChange={e=>setNovoProduto({...novoProduto, nome: e.target.value})} required/></div>
                                <div className="col-md-3"><label className="small fw-bold text-muted">Preço (€)</label><input type="number" className="form-control" value={novoProduto.preco} onChange={e=>setNovoProduto({...novoProduto, preco: e.target.value})} required/></div>
                                <div className="col-md-3"><label className="small fw-bold text-muted">Estoque</label><input type="number" className="form-control" value={novoProduto.estoque} onChange={e=>setNovoProduto({...novoProduto, estoque: e.target.value})} required/></div>
                                <div className="col-md-4">
                                    <label className="small fw-bold text-muted">Categoria</label>
                                    <select className="form-select" value={novoProduto.categoria} onChange={e=>setNovoProduto({...novoProduto, categoria: e.target.value})}>
                                        <option value="Sala">Sala de Estar</option>
                                        <option value="Jantar">Sala de Jantar</option>
                                        <option value="Quarto">Quarto</option>
                                        <option value="Escritorio">Escritório</option>
                                    </select>
                                </div>
                                <div className="col-md-8">
                                    <label className="small fw-bold text-muted">URL da Imagem</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white"><Image/></span>
                                        <input className="form-control" value={novoProduto.img} onChange={e=>setNovoProduto({...novoProduto, img: e.target.value})} placeholder="https://..."/>
                                    </div>
                                </div>
                                <div className="col-12 text-end pt-3 border-top mt-3">
                                    <button type="button" onClick={()=>setShowProductForm(false)} className="btn btn-light me-2">Cancelar</button>
                                    <button type="submit" className="btn btn-dark px-4 shadow-sm">Salvar Produto</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                <div className="row g-4">
                    {produtos.map(prod => (
                        <div className="col-md-4 col-lg-3" key={prod.id}>
                            <div className="card-custom h-100 border-0 shadow-sm position-relative overflow-hidden group hover-lift transition-all">
                                <div className="position-relative" style={{height:'180px'}}>
                                    <img src={prod.img} className="w-100 h-100 object-fit-cover" alt={prod.nome}/>
                                    {prod.estoque < 5 && <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark small shadow-sm">Baixo Estoque</span>}
                                </div>
                                <div className="p-3">
                                    <h6 className="fw-bold text-truncate mb-1 text-dark">{prod.nome}</h6>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-accent fw-bold">{prod.preco}€</span>
                                        <small className="text-muted">{prod.estoque} un.</small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-1" onClick={()=>handleEditClick(prod)}><PencilSimple/> Editar</button>
                                        <button className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1" onClick={() => onRemoveProduct(prod.id)}><Trash/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CLIENTES */}
        {tab === "clientes" && (
            <div className="card-custom border-0 shadow-sm fade-in">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white rounded-top">
                    <h5 className="fw-bold m-0 font-brand">Base de Clientes</h5>
                    <div className="input-group w-25 input-group-sm">
                        <span className="input-group-text bg-light border-end-0"><MagnifyingGlass/></span>
                        <input className="form-control border-start-0 bg-light" placeholder="Buscar cliente..." value={filtroCliente} onChange={e=>setFiltroCliente(e.target.value)}/>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light text-muted small text-uppercase">
                            <tr>
                                <th className="ps-4 py-3">Cliente</th>
                                <th>Contato</th>
                                <th>Desde</th>
                                <th>LTV (Total Gasto)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Renderização CORRIGIDA da lista de usuários */}
                            {listaUsuarios
                                .filter(u => u.nome.toLowerCase().includes(filtroCliente.toLowerCase()) || u.email.toLowerCase().includes(filtroCliente.toLowerCase()))
                                .map((u, i) => {
                                const totalGasto = pedidos.filter(p => p.emailCliente === u.email).reduce((acc, p) => acc + p.total, 0);
                                return (
                                    <tr key={i}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light rounded-circle p-2 text-dark border shadow-sm"><Users size={18}/></div>
                                                <div>
                                                    <span className="fw-bold text-dark d-block">{u.nome}</span>
                                                    <span className="text-muted small text-uppercase" style={{fontSize: '0.65rem'}}>ID: {u.id || `CLI-${i}`}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                <small className="d-flex align-items-center gap-1 text-muted"><EnvelopeSimple/> {u.email}</small>
                                                <small className="d-flex align-items-center gap-1 text-muted"><Phone/> {u.telefone || 'N/A'}</small>
                                            </div>
                                        </td>
                                        <td className="text-muted small">{u.dataCadastro || new Date().toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1">
                                                {totalGasto.toLocaleString('pt-PT')}€
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {listaUsuarios.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">Nenhum cliente registado ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CONFIGURAÇÕES */}
        {tab === "config" && (
            <div className="card-custom border-0 shadow-sm fade-in p-5 bg-white mx-auto" style={{maxWidth: '800px'}}>
                <h4 className="fw-bold mb-4 border-bottom pb-3 font-brand">Configurações da Loja</h4>
                <form onSubmit={handleSaveConfig}>
                    <div className="row g-4">
                        <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted text-uppercase">Nome da Loja</label>
                            <input className="form-control" value={configLocal.nome} onChange={e=>setConfigLocal({...configLocal, nome: e.target.value})}/>
                            <small className="text-muted d-block mt-1">Este nome aparecerá no título do site e nos e-mails.</small>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">E-mail de Contato</label>
                            <input className="form-control" value={configLocal.emailContato} onChange={e=>setConfigLocal({...configLocal, emailContato: e.target.value})}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Telefone / WhatsApp</label>
                            <input className="form-control" value={configLocal.telefone} onChange={e=>setConfigLocal({...configLocal, telefone: e.target.value})}/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted text-uppercase">Cor Principal (Hex)</label>
                            <div className="input-group">
                                <input type="color" className="form-control form-control-color" value={configLocal.corPrincipal} onChange={e=>setConfigLocal({...configLocal, corPrincipal: e.target.value})} title="Escolha a cor"/>
                                <input type="text" className="form-control" value={configLocal.corPrincipal} onChange={e=>setConfigLocal({...configLocal, corPrincipal: e.target.value})}/>
                            </div>
                        </div>
                        <div className="col-12 mt-5 text-end border-top pt-4">
                            <button type="submit" className="btn btn-primary-custom px-5 shadow-sm">Salvar Alterações</button>
                        </div>
                    </div>
                </form>
            </div>
        )}

        {/* MODAL DETALHES DO PEDIDO */}
        {pedidoSelecionado && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 fade-in" style={{zIndex: 2000}}>
                <div className="bg-white rounded shadow-lg p-0 w-50 animate-fade-in overflow-hidden">
                    <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold m-0 letter-spacing-1">PEDIDO #{pedidoSelecionado.id}</h6>
                        <button onClick={()=>setPedidoSelecionado(null)} className="btn-close btn-close-white"></button>
                    </div>
                    <div className="p-4">
                        <div className="row mb-4 g-3">
                            <div className="col-6">
                                <small className="text-muted text-uppercase fw-bold" style={{fontSize:'10px'}}>Cliente</small>
                                <p className="m-0 fw-bold">{pedidoSelecionado.cliente}</p>
                                <small className="text-muted">{pedidoSelecionado.emailCliente}</small>
                            </div>
                            <div className="col-6 text-end">
                                <small className="text-muted text-uppercase fw-bold" style={{fontSize:'10px'}}>Data & Hora</small>
                                <p className="m-0 fw-bold">{pedidoSelecionado.data}</p>
                                <small className="text-muted">{pedidoSelecionado.hora}</small>
                            </div>
                        </div>
                        
                        <div className="table-responsive border rounded mb-3">
                            <table className="table table-sm table-borderless mb-0">
                                <thead className="bg-light text-muted small text-uppercase"><tr><th className="ps-3">Produto</th><th className="text-center">Qtd</th><th className="text-end pe-3">Subtotal</th></tr></thead>
                                <tbody>
                                    {pedidoSelecionado.itens.map((item, idx) => (
                                        <tr key={idx} className="border-top">
                                            <td className="ps-3 py-2">{item.nome}</td>
                                            <td className="text-center py-2">{item.quantidade}</td>
                                            <td className="text-end pe-3 py-2 fw-bold">{item.preco.toLocaleString('pt-PT')}€</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <StatusBadge status={pedidoSelecionado.status}/>
                            <h5 className="fw-bold m-0 text-dark">Total: {pedidoSelecionado.total.toLocaleString('pt-PT')}€</h5>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa; color: #000; }
        .hover-opacity-100:hover { opacity: 1 !important; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-3px); }
      `}</style>
    </div>
  );
}