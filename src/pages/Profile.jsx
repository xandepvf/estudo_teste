import { useState } from "react";
import { User, SignOut, Package, Heart, Receipt, PencilSimple, MapPin, Trash, Plus } from "phosphor-react";
import { Navigate } from "react-router-dom";
import { LoadingButton } from "../components/LoadingButton"; 

export function Profile({ user, onLogout, onUpdateUser, favoritos, pedidos, enderecos, onSaveAddress, onRemoveAddress }) { 
  if (!user) return <Navigate to="/login" />;

  const [activeTab, setActiveTab] = useState('pedidos');
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState(user.nome);
  const [loadingLogout, setLoadingLogout] = useState(false);
  
  // Filtros
  const meusPedidos = pedidos.filter(p => p.emailCliente === user.email).reverse();
  const meusEnderecos = enderecos.filter(e => e.emailUsuario === user.email);
  
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [novoEnd, setNovoEnd] = useState({ rua: "", numero: "", cep: "", cidade: "" });
  const [addEndMode, setAddEndMode] = useState(false);

  const handleUpdate = (e) => { e.preventDefault(); onUpdateUser({ ...user, nome: novoNome }); setEditando(false); };
  const handleLogoutClick = () => { setLoadingLogout(true); setTimeout(() => { onLogout(); }, 800); };
  
  const handleSaveEnd = (e) => {
      e.preventDefault();
      onSaveAddress({ ...novoEnd, emailUsuario: user.email });
      setAddEndMode(false);
      setNovoEnd({ rua: "", numero: "", cep: "", cidade: "" });
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row g-4">
        {/* Esquerda: Card Usuário */}
        <div className="col-lg-4">
          <div className="bg-white p-4 shadow-sm text-center mb-3 border-top border-5 border-dark position-relative">
            {!editando && <button onClick={() => setEditando(true)} className="btn btn-light btn-sm position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm"><PencilSimple size={18}/></button>}
            <User size={64} className="text-secondary mb-3 bg-light rounded-circle p-3" />
            {editando ? (
                <form onSubmit={handleUpdate} className="mb-3 fade-in"><input type="text" className="form-control form-control-sm text-center mb-2" value={novoNome} onChange={e => setNovoNome(e.target.value)} required autoFocus/><div className="d-flex gap-2 justify-content-center"><button type="submit" className="btn btn-success btn-sm px-3">Salvar</button><button type="button" onClick={() => {setEditando(false); setNovoNome(user.nome)}} className="btn btn-outline-secondary btn-sm px-3">X</button></div></form>
            ) : (<><h4 className="font-cinzel fw-bold mb-1">{user.nome}</h4><p className="text-muted small mb-4">{user.email}</p></>)}
            <div className="d-flex justify-content-between border-top pt-3 mb-4"><div className="text-center w-50 border-end"><span className="d-block fw-bold fs-4">{favoritos ? favoritos.length : 0}</span><small>Favoritos</small></div><div className="text-center w-50"><span className="d-block fw-bold fs-4">{meusPedidos.length}</span><small>Pedidos</small></div></div>
            <LoadingButton onClick={handleLogoutClick} isLoading={loadingLogout} className="btn-outline-danger w-100"><SignOut size={20}/> Sair da Conta</LoadingButton>
          </div>
        </div>

        {/* Direita: Abas */}
        <div className="col-lg-8">
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item"><button className={`nav-link fw-bold border-top-0 border-start-0 border-end-0 ${activeTab==='pedidos'?'active text-dark border-bottom-2':'text-muted'}`} onClick={()=>setActiveTab('pedidos')}>Meus Pedidos</button></li>
                <li className="nav-item"><button className={`nav-link fw-bold border-top-0 border-start-0 border-end-0 ${activeTab==='enderecos'?'active text-dark border-bottom-2':'text-muted'}`} onClick={()=>setActiveTab('enderecos')}>Meus Endereços</button></li>
            </ul>

            {activeTab === 'pedidos' && (
                meusPedidos.length === 0 ? <div className="alert alert-light border border-dashed text-center py-5"><Package size={32} className="mb-2 text-muted"/><p>Sem pedidos ainda.</p></div> : 
                <div className="d-flex flex-column gap-3">{meusPedidos.map(pedido => (<div key={pedido.id} className="bg-white p-4 shadow-sm border rounded position-relative"><div className="d-flex justify-content-between align-items-start mb-3"><div><span className="badge bg-light text-dark border mb-2">#{pedido.id}</span><h5 className="m-0 font-cinzel">Pedido em {pedido.data}</h5></div><div className="text-end"><p className="fw-bold text-success m-0">R$ {pedido.total.toLocaleString('pt-BR')}</p><small className={`badge ${pedido.status==='Entregue'?'bg-success':'bg-warning text-dark'}`}>{pedido.status}</small></div></div><button onClick={() => setPedidoSelecionado(pedido)} className="btn btn-outline-dark btn-sm w-100"><Receipt size={18}/> Detalhes</button></div>))}</div>
            )}

            {activeTab === 'enderecos' && (
                <div>
                    {!addEndMode && <button onClick={()=>setAddEndMode(true)} className="btn btn-dark w-100 mb-4 py-3 border-dashed bg-transparent text-dark border-2"><Plus/> Adicionar Novo Endereço</button>}
                    {addEndMode && (
                        <form onSubmit={handleSaveEnd} className="bg-light p-4 rounded mb-4 border"><h6 className="mb-3 fw-bold">Novo Endereço</h6><div className="row g-2"><div className="col-12"><input className="form-control" placeholder="Rua / Avenida" value={novoEnd.rua} onChange={e=>setNovoEnd({...novoEnd, rua:e.target.value})} required/></div><div className="col-4"><input className="form-control" placeholder="Número" value={novoEnd.numero} onChange={e=>setNovoEnd({...novoEnd, numero:e.target.value})} required/></div><div className="col-4"><input className="form-control" placeholder="CEP" value={novoEnd.cep} onChange={e=>setNovoEnd({...novoEnd, cep:e.target.value})} required/></div><div className="col-4"><input className="form-control" placeholder="Cidade" value={novoEnd.cidade} onChange={e=>setNovoEnd({...novoEnd, cidade:e.target.value})} required/></div><div className="col-12 d-flex gap-2"><button className="btn btn-success w-100">Salvar</button><button type="button" onClick={()=>setAddEndMode(false)} className="btn btn-outline-secondary">Cancelar</button></div></div></form>
                    )}
                    {meusEnderecos.length === 0 && !addEndMode ? <p className="text-muted text-center py-5">Nenhum endereço salvo.</p> : (
                        <div className="row g-3">
                            {meusEnderecos.map(end => (
                                <div key={end.id} className="col-md-6">
                                    <div className="bg-white p-3 border rounded shadow-sm h-100 position-relative">
                                        <button onClick={()=>onRemoveAddress(end.id)} className="btn btn-sm text-danger position-absolute top-0 end-0 m-2"><Trash/></button>
                                        <div className="d-flex align-items-center gap-2 mb-2"><MapPin size={20} className="text-primary"/><span className="fw-bold">{end.cidade}</span></div>
                                        <p className="m-0 text-muted small">{end.rua}, {end.numero}<br/>CEP: {end.cep}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      {/* Modal Detalhes (Mantido) */}
      {pedidoSelecionado && (<div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header"><h5 className="modal-title font-cinzel">Detalhes do Pedido #{pedidoSelecionado.id}</h5><button onClick={() => setPedidoSelecionado(null)} className="btn-close"></button></div><div className="modal-body"><div className="list-group list-group-flush">{pedidoSelecionado.itens.map((item, idx) => (<div key={idx} className="list-group-item d-flex align-items-center gap-3 py-3"><img src={item.img} width="60" height="60" className="rounded object-fit-cover bg-light" /><div className="flex-grow-1"><h6 className="m-0 mb-1">{item.nome}</h6><small className="text-muted">{item.quantidade}x R$ {item.preco.toLocaleString('pt-BR')}</small></div><span className="fw-bold">R$ {(item.preco * item.quantidade).toLocaleString('pt-BR')}</span></div>))}</div><div className="text-end pt-3 mt-3 border-top"><h5>Total Pago: R$ {pedidoSelecionado.total.toLocaleString('pt-BR')}</h5></div></div></div></div></div>)}
    </div>
  );
}