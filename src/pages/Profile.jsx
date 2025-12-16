import { useState } from "react";
import { User, Package, MapPin, SignOut, Heart, Plus, Trash, House, IdentificationCard, CreditCard, Bell, CaretDown, CaretUp, PencilSimple, Wallet, Check, ShieldCheck } from "phosphor-react"; // ShieldCheck importado
import { Link } from "react-router-dom";

// Função de Sanitização Simples (Previne XSS básico ao remover tags HTML)
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export function Profile({ user, onLogout, onUpdateUser, favoritos, pedidos, enderecos, onSaveAddress, onRemoveAddress }) {
  const [activeTab, setActiveTab] = useState("pedidos");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Estado para novo endereço
  const [novoEnd, setNovoEnd] = useState({ rua: "", numero: "", cep: "", cidade: "", estado: "" });

  // Estado Simulado para Carteira
  const [cards, setCards] = useState([
    { id: 1, last4: "4242", brand: "Visa", expiry: "12/28" },
    { id: 2, last4: "8888", brand: "Mastercard", expiry: "07/25" }
  ]);

  // Estado Simulado para Notificações
  const [notifications, setNotifications] = useState({
    emailPromos: true,
    emailStatus: true,
    smsStatus: false,
    whatsapp: true
  });

  // Estado para Edição de Perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState(user ? { ...user } : {});

  if (!user) return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <h2 className="font-cinzel mb-3">Acesso Restrito</h2>
        <p className="text-muted mb-4">Por favor, faça login para acessar seu perfil.</p>
        <Link to="/login" className="btn btn-primary-custom px-5">Ir para Login</Link>
    </div>
  );

  const handleSaveAddress = (e) => {
      e.preventDefault();
      // Sanitização dos dados antes de salvar
      const enderecoSeguro = {
          rua: sanitizeInput(novoEnd.rua),
          numero: sanitizeInput(novoEnd.numero),
          cep: sanitizeInput(novoEnd.cep),
          apelido: "Minha Casa"
      };
      onSaveAddress(enderecoSeguro);
      setNovoEnd({ rua: "", numero: "", cep: "", cidade: "", estado: "" });
      setShowAddressForm(false);
  };

  const handleProfileUpdate = (e) => {
      e.preventDefault();
      
      // Validação e Sanitização antes de enviar
      const dadosSeguros = {
          ...editFormData,
          nome: sanitizeInput(editFormData.nome),
          telefone: sanitizeInput(editFormData.telefone)
          // Email e CPF não são alterados aqui, mantendo a segurança
      };

      onUpdateUser(dadosSeguros);
      setIsEditingProfile(false);
      alert("Perfil atualizado com segurança!");
  };

  const removeCard = (id) => {
      if(window.confirm("Deseja remover este cartão?")) {
          setCards(cards.filter(c => c.id !== id));
      }
  };

  const StatusBadge = ({ status }) => {
      const colors = { "Entregue": "bg-success", "Pendente": "bg-warning text-dark", "Enviado": "bg-primary", "Cancelado": "bg-danger" };
      return <span className={`badge ${colors[status] || "bg-secondary"} rounded-pill`}>{status}</span>;
  };

  return (
    <div className="bg-light min-vh-100 py-5 fade-in">
      <div className="container">
        
        {/* CABEÇALHO DO PERFIL */}
        <div className="bg-white p-4 rounded shadow-sm mb-4 d-flex flex-wrap justify-content-between align-items-center border-bottom border-4 border-dark">
            <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-3 rounded-circle border border-secondary position-relative">
                    <User size={32} className="text-dark"/>
                    <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1" style={{width: '12px', height: '12px'}}></div>
                </div>
                <div>
                    <h2 className="font-cinzel fw-bold m-0 text-dark">Olá, {user.nome}</h2>
                    <p className="text-muted m-0 small">{user.email} • Membro desde {user.dataCadastro || '2024'}</p>
                </div>
            </div>
            <button onClick={onLogout} className="btn btn-outline-danger d-flex align-items-center gap-2 mt-3 mt-md-0">
                <SignOut size={18}/> Sair
            </button>
        </div>

        <div className="row g-4">
            {/* MENU LATERAL DE ABAS */}
            <div className="col-lg-3">
                <div className="bg-white rounded shadow-sm overflow-hidden sticky-top" style={{top: '100px'}}>
                    <p className="small text-muted fw-bold px-3 pt-3 mb-1 text-uppercase">Conta</p>
                    <button onClick={()=>setActiveTab("pedidos")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="pedidos" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <Package size={20}/> Meus Pedidos
                    </button>
                    <button onClick={()=>setActiveTab("enderecos")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="enderecos" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <MapPin size={20}/> Endereços
                    </button>
                    <button onClick={()=>setActiveTab("carteira")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="carteira" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <Wallet size={20}/> Minha Carteira
                    </button>
                    
                    <p className="small text-muted fw-bold px-3 pt-3 mb-1 text-uppercase">Preferências</p>
                    <button onClick={()=>setActiveTab("favoritos")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="favoritos" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <Heart size={20}/> Lista de Desejos
                    </button>
                    <button onClick={()=>setActiveTab("notificacoes")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="notificacoes" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <Bell size={20}/> Notificações
                    </button>
                    <button onClick={()=>setActiveTab("dados")} className={`w-100 text-start p-3 border-0 d-flex align-items-center gap-3 transition-all ${activeTab==="dados" ? "bg-dark text-white fw-bold" : "bg-white text-muted hover-bg-light"}`}>
                        <IdentificationCard size={20}/> Meus Dados
                    </button>
                </div>
            </div>

            {/* CONTEÚDO DA ABA */}
            <div className="col-lg-9">
                <div className="bg-white p-4 rounded shadow-sm min-vh-50 h-100">
                    
                    {/* --- ABA PEDIDOS --- */}
                    {activeTab === "pedidos" && (
                        <div>
                            <h4 className="font-cinzel fw-bold mb-4 border-bottom pb-2">Histórico de Pedidos</h4>
                            {pedidos.filter(p => p.emailCliente === user.email).length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <Package size={48} className="opacity-25 mb-2"/>
                                    <p>Você ainda não fez nenhum pedido.</p>
                                    <Link to="/catalogo" className="btn btn-sm btn-outline-dark">Ir às compras</Link>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {pedidos.filter(p => p.emailCliente === user.email).map(pedido => (
                                        <div key={pedido.id} className="border rounded hover-shadow transition-all overflow-hidden">
                                            {/* Cabeçalho do Card */}
                                            <div className="p-3 bg-light d-flex justify-content-between align-items-center cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === pedido.id ? null : pedido.id)}>
                                                <div>
                                                    <span className="fw-bold d-block">Pedido #{pedido.id}</span>
                                                    <small className="text-muted">{pedido.data}</small>
                                                </div>
                                                <div className="d-flex align-items-center gap-3">
                                                    <StatusBadge status={pedido.status}/>
                                                    {expandedOrder === pedido.id ? <CaretUp/> : <CaretDown/>}
                                                </div>
                                            </div>
                                            
                                            {/* Detalhes Expansíveis */}
                                            {expandedOrder === pedido.id && (
                                                <div className="p-3 border-top bg-white fade-in">
                                                    <h6 className="small fw-bold text-muted mb-2">Itens do Pedido</h6>
                                                    <div className="mb-3">
                                                        {pedido.itens.map((item, idx) => (
                                                            <div key={idx} className="d-flex justify-content-between align-items-center border-bottom py-2 small">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="badge bg-light text-dark border">{item.quantidade}x</span>
                                                                    <span>{item.nome}</span>
                                                                </div>
                                                                <span>R$ {(item.preco * item.quantidade).toLocaleString('pt-BR')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold text-success fs-5">Total: R$ {pedido.total.toLocaleString('pt-BR')}</span>
                                                        <Link to="/tracking" className="btn btn-dark btn-sm d-flex align-items-center gap-2">
                                                            <Package size={16}/> Rastrear Entrega
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- ABA ENDEREÇOS --- */}
                    {activeTab === "enderecos" && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                <h4 className="font-cinzel fw-bold m-0">Meus Endereços</h4>
                                <button onClick={()=>setShowAddressForm(!showAddressForm)} className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1">
                                    <Plus size={16}/> Novo
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleSaveAddress} className="bg-light p-4 rounded mb-4 border animate-fade-in shadow-sm">
                                    <h6 className="fw-bold mb-3">Adicionar Endereço</h6>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="small text-muted fw-bold">Logradouro</label>
                                            <input className="form-control" placeholder="Ex: Rua das Flores" required value={novoEnd.rua} onChange={e=>setNovoEnd({...novoEnd, rua:e.target.value})}/>
                                        </div>
                                        <div className="col-4">
                                            <label className="small text-muted fw-bold">Número</label>
                                            <input className="form-control" placeholder="123" required value={novoEnd.numero} onChange={e=>setNovoEnd({...novoEnd, numero:e.target.value})}/>
                                        </div>
                                        <div className="col-8">
                                            <label className="small text-muted fw-bold">CEP</label>
                                            <input className="form-control" placeholder="00000-000" required value={novoEnd.cep} onChange={e=>setNovoEnd({...novoEnd, cep:e.target.value})}/>
                                        </div>
                                        <div className="col-12 d-flex gap-2 justify-content-end">
                                            <button type="button" onClick={()=>setShowAddressForm(false)} className="btn btn-light">Cancelar</button>
                                            <button className="btn btn-dark">Salvar Endereço</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            <div className="row g-3">
                                {enderecos.map(end => (
                                    <div className="col-md-6" key={end.id}>
                                        <div className="border p-3 rounded h-100 position-relative bg-white shadow-sm">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <House size={18} className="text-primary-custom"/>
                                                <strong className="text-uppercase small">{end.apelido || "Casa"}</strong>
                                            </div>
                                            <p className="m-0 text-dark fw-bold">{end.rua}, {end.numero}</p>
                                            <p className="m-0 small text-muted">CEP: {end.cep}</p>
                                            <p className="m-0 small text-muted">{end.cidade} - {end.estado}</p>
                                            <button onClick={()=>onRemoveAddress(end.id)} className="btn btn-link text-danger p-0 position-absolute top-0 end-0 m-2 hover-scale" title="Remover"><Trash size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                {enderecos.length === 0 && !showAddressForm && <p className="text-muted small">Nenhum endereço cadastrado.</p>}
                            </div>
                        </div>
                    )}

                    {/* --- ABA CARTEIRA (NOVO) --- */}
                    {activeTab === "carteira" && (
                        <div>
                            <h4 className="font-cinzel fw-bold mb-4 border-bottom pb-2">Meus Cartões</h4>
                            <div className="alert alert-info d-flex gap-2 small"><ShieldCheck size={20}/> Suas informações de pagamento são criptografadas e seguras.</div>
                            <div className="row g-3">
                                {cards.map(card => (
                                    <div className="col-md-6" key={card.id}>
                                        <div className="bg-dark text-white p-3 rounded shadow-sm position-relative overflow-hidden" style={{minHeight: '140px'}}>
                                            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                                <CreditCard size={64}/>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <span className="fw-bold">{card.brand}</span>
                                            </div>
                                            <div className="mb-2 font-monospace fs-5">•••• •••• •••• {card.last4}</div>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <small className="opacity-75">Exp: {card.expiry}</small>
                                                <button onClick={()=>removeCard(card.id)} className="btn btn-sm btn-outline-light border-0"><Trash/></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-md-6">
                                    <div className="border border-dashed p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center text-muted cursor-pointer hover-bg-light" style={{minHeight: '140px'}} onClick={()=>alert("Funcionalidade simulada: Adicionar Cartão")}>
                                        <Plus size={24}/>
                                        <span className="small fw-bold mt-2">Adicionar Novo Cartão</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ABA NOTIFICAÇÕES (NOVO) --- */}
                    {activeTab === "notificacoes" && (
                        <div>
                            <h4 className="font-cinzel fw-bold mb-4 border-bottom pb-2">Preferências de Contato</h4>
                            <div className="d-flex flex-column gap-3">
                                {Object.keys(notifications).map(key => (
                                    <div key={key} className="d-flex justify-content-between align-items-center border-bottom pb-3">
                                        <div>
                                            <h6 className="m-0 fw-bold text-capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h6>
                                            <small className="text-muted">Receber atualizações sobre {key.includes('Promos') ? 'promoções' : 'pedidos'}.</small>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                checked={notifications[key]}
                                                onChange={()=>setNotifications({...notifications, [key]: !notifications[key]})}
                                                style={{cursor:'pointer'}}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ABA FAVORITOS --- */}
                    {activeTab === "favoritos" && (
                        <div>
                            <h4 className="font-cinzel fw-bold mb-4 border-bottom pb-2">Lista de Desejos</h4>
                            <div className="row g-3">
                                {favoritos.length === 0 ? <p className="text-muted">Sua lista está vazia.</p> : favoritos.map(prod => (
                                    <div className="col-md-6" key={prod.id}>
                                        <div className="d-flex gap-3 border p-2 rounded align-items-center bg-white hover-shadow transition-all">
                                            <img src={prod.img} width="70" height="70" className="object-fit-cover rounded"/>
                                            <div>
                                                <h6 className="m-0 fw-bold">{prod.nome}</h6>
                                                <small className="text-muted fw-bold d-block">R$ {prod.preco.toLocaleString('pt-BR')}</small>
                                                <small className="text-success" style={{fontSize:'10px'}}>Em estoque</small>
                                            </div>
                                            <Link to={`/produto/${prod.id}`} className="btn btn-sm btn-light ms-auto rounded-circle p-2"><Package size={18}/></Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ABA DADOS (EDITÁVEL) --- */}
                    {activeTab === "dados" && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                <h4 className="font-cinzel fw-bold m-0">Meus Dados</h4>
                                {!isEditingProfile && (
                                    <button onClick={()=>setIsEditingProfile(true)} className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2">
                                        <PencilSimple/> Editar
                                    </button>
                                )}
                            </div>
                            
                            <form onSubmit={handleProfileUpdate}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted">Nome Completo</label>
                                        <input 
                                            className={`form-control ${isEditingProfile ? 'bg-white' : 'bg-light'}`} 
                                            value={isEditingProfile ? editFormData.nome : user.nome} 
                                            onChange={e=>setEditFormData({...editFormData, nome: e.target.value})}
                                            readOnly={!isEditingProfile}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted">E-mail</label>
                                        <input className="form-control bg-light" value={user.email} readOnly title="E-mail não pode ser alterado"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted">Telefone</label>
                                        <input 
                                            className={`form-control ${isEditingProfile ? 'bg-white' : 'bg-light'}`} 
                                            value={isEditingProfile ? (editFormData.telefone || "") : (user.telefone || "(00) 00000-0000")} 
                                            onChange={e=>setEditFormData({...editFormData, telefone: e.target.value})}
                                            readOnly={!isEditingProfile}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted">CPF</label>
                                        <input className="form-control bg-light" value={user.cpf || "000.***.***-00"} readOnly/>
                                    </div>
                                </div>

                                {isEditingProfile && (
                                    <div className="mt-4 d-flex gap-2 justify-content-end fade-in">
                                        <button type="button" onClick={()=>setIsEditingProfile(false)} className="btn btn-light">Cancelar</button>
                                        <button type="submit" className="btn btn-primary-custom px-4">Salvar Alterações</button>
                                    </div>
                                )}
                                
                                {!isEditingProfile && <div className="alert alert-info small mt-4 d-flex gap-2 align-items-center"><IdentificationCard size={20}/> Para alterar dados sensíveis como CPF ou E-mail, entre em contato com o suporte.</div>}
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa !important; color: #212529 !important; }
        .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}