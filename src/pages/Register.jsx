import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Envelope, Lock, ArrowRight, Key } from "phosphor-react";

export function Register({ onRegister }) {
  const navigate = useNavigate();
  // Adicionei o estado 'chaveAdmin'
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "", confirmSenha: "", chaveAdmin: "" });
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmSenha) {
        setErro("As senhas não coincidem.");
        return;
    }
    if (formData.senha.length < 4) {
        setErro("A senha deve ter pelo menos 4 caracteres.");
        return;
    }
    
    // LÓGICA DE ADMIN:
    // Se a chave for "admin", o tipo vira "admin". Senão, vira "cliente".
    const tipoUsuario = formData.chaveAdmin === "admin" ? "admin" : "cliente";

    onRegister({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: tipoUsuario, // Salva o tipo correto
        dataCadastro: new Date().toLocaleDateString()
    });
    navigate("/");
  };

  return (
    <div className="container-fluid p-0 fade-in" style={{minHeight: '100vh', display: 'flex'}}>
      <div className="row g-0 w-100">
        
        {/* LADO ESQUERDO: IMAGEM */}
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900" 
            className="w-100 h-100 object-fit-cover" 
            alt="Design de Interiores" 
            style={{filter: 'brightness(0.7)'}}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-75">
            <h1 className="display-4 font-cinzel fw-bold mb-3">Junte-se a Nós</h1>
            <p className="lead opacity-75">Crie sua conta para ter acesso a ofertas exclusivas.</p>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="p-5 w-100" style={{maxWidth: '500px'}}>
            <h3 className="fw-bold mb-4 font-cinzel">Criar Conta</h3>
            
            {erro && <div className="alert alert-danger small">{erro}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">Nome Completo</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border"><User size={20} className="text-muted"/></span>
                  <input type="text" className="form-control bg-light border-start-0 border py-2" required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}/>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-uppercase text-muted">E-mail</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 border"><Envelope size={20} className="text-muted"/></span>
                  <input type="email" className="form-control bg-light border-start-0 border py-2" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Senha</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 border"><Lock size={20} className="text-muted"/></span>
                        <input type="password" className="form-control bg-light border-start-0 border py-2" required value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})}/>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Confirmar</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 border"><Lock size={20} className="text-muted"/></span>
                        <input type="password" className="form-control bg-light border-start-0 border py-2" required value={formData.confirmSenha} onChange={e => setFormData({...formData, confirmSenha: e.target.value})}/>
                    </div>
                </div>
              </div>

              {/* CAMPO DE CHAVE ADMIN */}
              <div className="mb-4">
                 <label className="form-label small fw-bold text-uppercase text-muted">Chave de Admin (Opcional)</label>
                 <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 border"><Key size={20} className="text-muted"/></span>
                    <input 
                        type="text" 
                        className="form-control bg-light border-start-0 border py-2" 
                        placeholder="Digite 'admin' para testar"
                        value={formData.chaveAdmin} 
                        onChange={e => setFormData({...formData, chaveAdmin: e.target.value})}
                    />
                 </div>
                 <div className="form-text small">Deixe em branco para criar conta de cliente comum.</div>
              </div>

              <button className="btn btn-primary-custom w-100 py-3 mb-4 d-flex justify-content-between align-items-center">
                <span className="fw-bold">CADASTRAR-SE</span>
                <ArrowRight size={20}/>
              </button>
            </form>

            <div className="text-center border-top pt-4">
              <span className="text-muted">Já possui conta? </span>
              <Link to="/login" className="fw-bold text-dark text-decoration-none">Fazer Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}