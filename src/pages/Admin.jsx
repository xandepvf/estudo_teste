import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, TrendUp, PlusCircle, LockKey, Trash, Users, PencilSimple, X, DownloadSimple, ChartBar, Warning, CheckCircle, Tag, EnvelopeSimple, Clock } from "phosphor-react";

export function Admin({ 
  onAddProduct, onRemoveProduct, pedidos, produtos, onUpdateStatus, userLogado, 
  listaUsuarios, onRemoveUser, onEditUser, cupons, onAddCoupon, onRemoveCoupon, listaNewsletter
}) {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [formData, setFormData] = useState({ nome: "", categoria: "Sala de Estar", preco: "", img: "", descricao: "" });
  const [novoCupom, setNovoCupom] = useState({ codigo: "", desconto: "" });
  const [usuarioEditando, setUsuarioEditando] = useState(null); 
  const [formUser, setFormUser] = useState({ nome: "", email: "", tipo: "cliente", senha: "" });
  const [filtroPedido, setFiltroPedido] = useState("Todos");

  // --- CÁLCULOS BI (BUSINESS INTELLIGENCE) ---
  const totalVendas = pedidos.reduce((acc, p) => acc + p.total, 0);
  const estoqueBaixo = produtos.filter(p => p.estoque < 3);
  
  // Dados para o Gráfico (Barras CSS)
  const vendasPorCategoria = pedidos.reduce((acc, pedido) => {
    pedido.itens.forEach(item => { acc[item.categoria] = (acc[item.categoria] || 0) + (item.preco * item.quantidade); });
    return acc;
  }, {});
  const maxVenda = Math.max(...Object.values(vendasPorCategoria), 1);

  // Feed de Atividade Simulado (Mistura Pedidos e Cadastros)
  const feedAtividade = [
      ...pedidos.map(p => ({ tipo: 'pedido', msg: `Pedido #${p.id} - R$ ${p.total}`, data: p.data, hora: p.hora || 'Recente' })),
      ...listaUsuarios.map(u => ({ tipo: 'user', msg: `Novo cliente: ${u.nome}`, data: u.dataCadastro || 'Hoje', hora: '' }))
  ].sort(() => Math.random() - 0.5).slice(0, 5); // Embaralha para parecer dinâmico

  const pedidosFiltrados = filtroPedido === "Todos" ? pedidos : pedidos.filter(p => p.status === filtroPedido);

  // Componente de Badge Visual
  const StatusBadge = ({ status }) => {
      let color = "bg-warning text-dark"; // Processando
      if(status === "Enviado") color = "bg-primary text-white";
      if(status === "Entregue") color = "bg-success text-white";
      return <span className={`badge ${color} rounded-pill px-3`}>{status}</span>;
  };

  // Função para Baixar Relatório
  const handleExportCSV = () => {
    const cabecalho = ["ID;Data;Cliente;Total;Status"];
    const linhas = pedidos.map(p => [p.id, p.data, p.cliente, p.total, p.status].join(";"));
    const csvContent = "data:text/csv;charset=utf-8," + [cabecalho, ...linhas].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `relatorio_vendas_${new Date().toLocaleDateString().replace(/\//g,'-')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleStartEditUser = (user) => { 
      setUsuarioEditando(user.email); 
      setFormUser({ ...user, senha: user.senha || "" }); 
  };
  
  const handleSaveUser = (e) => { 
      e.preventDefault(); 
      onEditUser(usuarioEditando, formUser); 
      setUsuarioEditando(null); 
  };

  if (!userLogado || userLogado.tipo !== 'admin') return <div className="container py-5 text-center"><LockKey size={64} className="text-danger mb-3"/><h2>Acesso Restrito</h2><p className="text-muted">Apenas administradores.</p><Link to="/login" className="btn btn-dark">Login</Link></div>;

  return (
    <div className="container py-5 fade-in">
      {/* HEADER EXECUTIVO */}
      <div className="d-flex flex-column flex-md-row justify-content-between mb-5 align-items-md-center gap-3">
        <div>
            <h6 className="text-muted text-uppercase fw-bold ls-1 mb-1">Painel Administrativo</h6>
            <h2 className="font-cinzel m-0 fw-bold">Visão Geral</h2>
        </div>
        <div className="d-flex align-items-center gap-3 bg-white p-2 rounded shadow-sm border">
             <div className="px-3 border-end">
                 <small className="d-block text-muted" style={{fontSize:'10px'}}>LOGADO COMO</small>
                 <span className="fw-bold text-uppercase">{userLogado.nome}</span>
             </div>
             <Link to="/" className="btn btn-outline-dark btn-sm border-0"><ArrowLeft className="me-2"/> Sair</Link>
        </div>
      </div>

      <div className="row g-4">
        {/* SIDEBAR NAVIGATION */}
        <div className="col-lg-3">
          <div className="list-group shadow-sm sticky-top border-0" style={{top: '100px'}}>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${abaAtiva === 'dashboard' ? 'bg-dark text-white fw-bold' : 'bg-white'}`} onClick={() => setAbaAtiva('dashboard')}><TrendUp className="me-3"/> Dashboard BI</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${abaAtiva === 'marketing' ? 'bg-dark text-white fw-bold' : 'bg-white'}`} onClick={() => setAbaAtiva('marketing')}><Tag className="me-3"/> Marketing & CRM</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${abaAtiva === 'produtos' ? 'bg-dark text-white fw-bold' : 'bg-white'}`} onClick={() => setAbaAtiva('produtos')}><PlusCircle className="me-3"/> Catálogo</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${abaAtiva === 'pedidos' ? 'bg-dark text-white fw-bold' : 'bg-white'}`} onClick={() => setAbaAtiva('pedidos')}><Package className="me-3"/> Pedidos <span className="badge bg-secondary ms-auto">{pedidos.length}</span></button>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${abaAtiva === 'usuarios' ? 'bg-dark text-white fw-bold' : 'bg-white'}`} onClick={() => setAbaAtiva('usuarios')}><Users className="me-3"/> Usuários <span className="badge bg-secondary ms-auto">{listaUsuarios.length}</span></button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="col-lg-9">
          
          {/* --- DASHBOARD --- */}
          {abaAtiva === 'dashboard' && (
            <div className="fade-in">
                {/* Cards de KPIs */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3"><div className="bg-white p-4 shadow-sm rounded border-bottom border-4 border-success h-100"><h6 className="text-muted small fw-bold">FATURAMENTO</h6><h3 className="m-0 text-success fw-bold">R$ {totalVendas.toLocaleString('pt-BR')}</h3></div></div>
                    <div className="col-md-3"><div className="bg-white p-4 shadow-sm rounded border-bottom border-4 border-primary h-100"><h6 className="text-muted small fw-bold">PEDIDOS</h6><h3 className="m-0 text-primary fw-bold">{pedidos.length}</h3></div></div>
                    <div className="col-md-3"><div className="bg-white p-4 shadow-sm rounded border-bottom border-4 border-warning h-100"><h6 className="text-muted small fw-bold">LEADS</h6><h3 className="m-0 text-warning fw-bold">{listaNewsletter ? listaNewsletter.length : 0}</h3></div></div>
                    <div className="col-md-3"><div className="bg-white p-4 shadow-sm rounded border-bottom border-4 border-dark h-100"><h6 className="text-muted small fw-bold">CLIENTES</h6><h3 className="m-0 text-dark fw-bold">{listaUsuarios.length}</h3></div></div>
                </div>
                
                <div className="row g-4">
                    {/* Gráfico de Barras CSS */}
                    <div className="col-lg-8">
                        <div className="bg-white p-4 shadow-sm rounded h-100">
                            <h5 className="mb-4 font-cinzel d-flex align-items-center gap-2"><ChartBar className="text-accent"/> Vendas por Categoria</h5>
                            {Object.keys(vendasPorCategoria).length === 0 ? <p className="text-muted py-5 text-center">Sem dados suficientes.</p> : Object.entries(vendasPorCategoria).map(([cat, val]) => (
                                <div key={cat} className="mb-3">
                                    <div className="d-flex justify-content-between small fw-bold mb-1"><span>{cat}</span><span>R$ {val.toLocaleString('pt-BR')}</span></div>
                                    <div className="progress" style={{height:'8px'}}><div className="progress-bar bg-dark" style={{width:`${(val/maxVenda)*100}%`}}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Feed de Atividade */}
                    <div className="col-lg-4">
                        <div className="bg-white p-4 shadow-sm rounded h-100">
                            <h5 className="mb-4 font-cinzel d-flex align-items-center gap-2"><Clock/> Em Tempo Real</h5>
                            <div className="d-flex flex-column gap-3">
                                {feedAtividade.map((item, i) => (
                                    <div key={i} className="d-flex gap-2 align-items-start border-bottom pb-2">
                                        <div className={`rounded-circle p-1 mt-1 ${item.tipo==='pedido'?'bg-success':'bg-primary'}`} style={{width:'8px', height:'8px'}}></div>
                                        <div><p className="m-0 small fw-bold line-height-sm">{item.msg}</p><small className="text-muted" style={{fontSize:'10px'}}>{item.data} {item.hora}</small></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Alerta de Estoque Crítico */}
                {estoqueBaixo.length > 0 && (
                    <div className="mt-4 bg-danger bg-opacity-10 p-4 rounded border border-danger">
                        <h5 className="text-danger fw-bold d-flex align-items-center gap-2"><Warning/> Ação Necessária: Estoque Baixo</h5>
                        <div className="d-flex gap-3 overflow-auto mt-2 pb-2">
                            {estoqueBaixo.map(p => (
                                <div key={p.id} className="bg-white p-3 rounded shadow-sm border border-danger" style={{minWidth: '200px'}}>
                                    <h6 className="fw-bold m-0 text-truncate">{p.nome}</h6>
                                    <small className="text-danger fw-bold">Restam: {p.estoque}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* --- MARKETING --- */}
          {abaAtiva === 'marketing' && (
              <div className="row g-4 fade-in">
                  <div className="col-md-7">
                      <div className="bg-white p-4 shadow-sm rounded">
                          <h5 className="mb-4 font-cinzel">Gerenciador de Cupons</h5>
                          <form onSubmit={(e) => {e.preventDefault(); onAddCoupon({ codigo: novoCupom.codigo.toUpperCase(), desconto: Number(novoCupom.desconto) }); setNovoCupom({codigo:"",desconto:""});}} className="mb-4 bg-light p-3 rounded border">
                              <div className="row g-2">
                                  <div className="col-6"><input className="form-control" placeholder="CÓDIGO (ex: VIP10)" value={novoCupom.codigo} onChange={e=>setNovoCupom({...novoCupom, codigo:e.target.value})} required/></div>
                                  <div className="col-3"><input type="number" className="form-control" placeholder="%" value={novoCupom.desconto} onChange={e=>setNovoCupom({...novoCupom, desconto:e.target.value})} required/></div>
                                  <div className="col-3"><button className="btn btn-dark w-100">Criar</button></div>
                              </div>
                          </form>
                          <div className="list-group">
                              {cupons.map((c, i) => (
                                  <div key={i} className="list-group-item d-flex justify-content-between align-items-center border-start-0 border-end-0">
                                      <div className="d-flex align-items-center gap-3"><div className="bg-success text-white p-2 rounded"><Tag/></div><div><h6 className="m-0 fw-bold">{c.codigo}</h6><small className="text-success">{c.desconto}% OFF</small></div></div>
                                      <button onClick={()=>onRemoveCoupon(c.codigo)} className="btn btn-sm btn-outline-danger"><Trash/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="col-md-5">
                      <div className="bg-white p-4 shadow-sm rounded h-100">
                          <h5 className="mb-4 font-cinzel">Base de Leads</h5>
                          <div className="alert alert-info small">Inscritos na Newsletter.</div>
                          <ul className="list-group list-group-flush">
                              {listaNewsletter && listaNewsletter.map((email, i) => <li key={i} className="list-group-item px-0 py-2 text-muted small"><EnvelopeSimple className="me-2"/> {email}</li>)}
                          </ul>
                      </div>
                  </div>
              </div>
          )}

          {/* --- PRODUTOS --- */}
          {abaAtiva === 'produtos' && (
            <div className="bg-white p-5 shadow-sm rounded fade-in">
               <h4 className="mb-4 font-cinzel">Cadastro de Produto</h4>
               <form onSubmit={(e)=>{e.preventDefault(); onAddProduct({ ...formData, id: Date.now(), preco: Number(formData.preco), sku: `NEW`, imgs: [formData.img] }); setFormData({ nome: "", categoria: "Sala de Estar", preco: "", img: "", descricao: "" });}} className="mb-5 bg-light p-4 rounded border">
                  <div className="row g-3">
                    <div className="col-12"><label className="small fw-bold">Nome do Produto</label><input className="form-control" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required /></div>
                    <div className="col-4"><label className="small fw-bold">Preço (R$)</label><input className="form-control" type="number" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} required /></div>
                    <div className="col-4"><label className="small fw-bold">Estoque Inicial</label><input className="form-control" type="number" value={formData.estoque} onChange={e => setFormData({...formData, estoque: e.target.value})} required /></div>
                    <div className="col-4"><label className="small fw-bold">Categoria</label><select className="form-select" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}><option>Sala de Estar</option><option>Jantar</option><option>Iluminação</option><option>Decoração</option></select></div>
                    <div className="col-12"><label className="small fw-bold">Imagem (URL)</label><input className="form-control" value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} /></div>
                    <div className="col-12"><button className="btn btn-primary-custom w-100">ADICIONAR AO CATÁLOGO</button></div>
                  </div>
               </form>
               <table className="table table-hover align-middle mt-4">
                   <thead className="table-light"><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th></th></tr></thead>
                   <tbody>{produtos.map(p=><tr key={p.id}><td><img src={p.img} width="30" className="rounded me-2"/>{p.nome}</td><td><span className="badge bg-light text-dark border">{p.categoria}</span></td><td>R$ {p.preco}</td><td>{p.estoque < 3 ? <span className="text-danger fw-bold">{p.estoque}</span> : p.estoque}</td><td><button onClick={()=>{if(window.confirm('Apagar?')) onRemoveProduct(p.id)}} className="btn btn-sm text-danger"><Trash/></button></td></tr>)}</tbody>
               </table>
            </div>
          )}

          {/* --- PEDIDOS (COM FILTROS) --- */}
          {abaAtiva === 'pedidos' && (
            <div className="bg-white p-4 shadow-sm rounded fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4"><h4 className="m-0 font-cinzel">Pedidos</h4><button onClick={handleExportCSV} className="btn btn-success btn-sm"><DownloadSimple/> Excel (CSV)</button></div>
                
                <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
                    {["Todos", "Processando", "Enviado", "Entregue"].map(status => (
                        <button key={status} onClick={() => setFiltroPedido(status)} className={`btn btn-sm rounded-pill px-3 ${filtroPedido === status ? 'btn-dark' : 'btn-outline-secondary border-0 bg-light'}`}>{status}</button>
                    ))}
                </div>

                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-light"><tr><th>ID</th><th>Data</th><th>Cliente</th><th>Total</th><th>Status</th><th>Ação</th></tr></thead>
                        <tbody>
                            {pedidosFiltrados.map(p => (
                                <tr key={p.id}><td>#{p.id}</td><td>{p.data}</td><td>{p.cliente}</td><td className="fw-bold">R$ {p.total}</td><td><StatusBadge status={p.status}/></td><td><select className="form-select form-select-sm" style={{width:'130px'}} value={p.status} onChange={(e)=>onUpdateStatus(p.id, e.target.value)}><option>Processando</option><option>Enviado</option><option>Entregue</option></select></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* --- USUÁRIOS --- */}
          {abaAtiva === 'usuarios' && (
            <div className="bg-white p-4 shadow-sm rounded fade-in">
               <h4 className="mb-4 font-cinzel">Usuários</h4>
               
               {usuarioEditando && (
                 <div className="bg-warning bg-opacity-10 p-4 rounded mb-4 border border-warning shadow-sm">
                    <div className="d-flex justify-content-between mb-3 border-bottom border-warning pb-2"><h6 className="fw-bold m-0 text-dark d-flex align-items-center gap-2"><PencilSimple/> Editando: {usuarioEditando}</h6><button onClick={() => setUsuarioEditando(null)} className="btn btn-sm btn-link text-dark p-0"><X size={20}/></button></div>
                    <form onSubmit={handleSaveUser} className="row g-3">
                        <div className="col-md-6"><label className="small fw-bold">Nome</label><input className="form-control" value={formUser.nome} onChange={e=>setFormUser({...formUser, nome:e.target.value})}/></div>
                        <div className="col-md-6"><label className="small fw-bold">E-mail</label><input type="email" className="form-control" value={formUser.email} onChange={e=>setFormUser({...formUser, email:e.target.value})}/></div>
                        <div className="col-md-6"><label className="small fw-bold">Senha</label><input type="text" className="form-control" value={formUser.senha} onChange={e=>setFormUser({...formUser, senha:e.target.value})}/></div>
                        <div className="col-md-4"><label className="small fw-bold">Acesso</label><select className="form-select" value={formUser.tipo} onChange={e=>setFormUser({...formUser, tipo:e.target.value})}><option value="cliente">Cliente</option><option value="admin">Administrador</option></select></div>
                        <div className="col-md-2 d-flex align-items-end"><button className="btn btn-success w-100 fw-bold">Salvar</button></div>
                    </form>
                 </div>
               )}
               <div className="table-responsive"><table className="table table-hover align-middle"><thead className="table-light"><tr><th>Nome</th><th>Email</th><th>Senha</th><th>Acesso</th><th className="text-end">Ações</th></tr></thead><tbody>{listaUsuarios.map((u, i)=>(<tr key={i} className={u.email === userLogado.email ? "table-active border-start border-4 border-success" : ""}><td><div className="fw-bold">{u.nome}</div>{u.email === userLogado.email && <small className="text-success fw-bold">(Você)</small>}</td><td className="text-muted small">{u.email}</td><td className="text-muted small font-monospace">{u.senha}</td><td>{u.tipo==='admin'?<span className="badge bg-dark text-uppercase letter-spacing-1">ADMIN</span>:<span className="badge bg-light text-dark border">CLIENTE</span>}</td><td className="text-end"><button onClick={()=>handleStartEditUser(u)} className="btn btn-outline-primary btn-sm rounded-circle p-2 me-2"><PencilSimple size={16}/></button><button onClick={()=>{if(window.confirm('Excluir?')) onRemoveUser(u.email)}} className="btn btn-outline-danger btn-sm rounded-circle p-2" disabled={u.email===userLogado.email}><Trash size={16}/></button></td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}