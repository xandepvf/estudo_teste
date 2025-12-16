import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, EnvelopeSimple, ArrowLeft } from "phosphor-react";

export function Login({ onLogin, onRecoverPassword }) {
  const navigate = useNavigate();
  
  // Estados para alternar entre Login e Recuperação
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Estados dos formulários
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setErro("");
    
    if (onLogin(email, senha)) {
      navigate("/profile"); // Redireciona para o perfil após login
    } else {
      setErro("Credenciais inválidas. Verifique o e-mail e a senha.");
    }
  };

  const handleSubmitRecovery = (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!recoverEmail || !recoverEmail.includes('@')) {
        setErro("Por favor, introduza um e-mail válido.");
        return;
    }

    // Chama a função passada pelo App.jsx
    const enviou = onRecoverPassword(recoverEmail);
    
    if (enviou) {
        setSucesso("Link de recuperação enviado! Verifique o seu e-mail.");
        setRecoverEmail(""); // Limpa o campo
    } else {
        setErro("Não encontramos uma conta associada a este e-mail.");
    }
  };

  return (
    <div className="container py-5 fade-in min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card-custom bg-white p-5 rounded shadow-lg border w-100" style={{maxWidth: '450px'}}>
        
        {/* --- CABEÇALHO --- */}
        <div className="text-center mb-4">
            <h2 className="font-cinzel fw-bold mb-1">
                {isRecovering ? "Recuperar Conta" : "Bem-vindo de volta"}
            </h2>
            <p className="text-muted small">
                {isRecovering 
                    ? "Insira o seu e-mail para receber um link de redefinição." 
                    : "Aceda à sua conta para gerir pedidos e favoritos."}
            </p>
        </div>

        {/* --- FEEDBACK DE ERRO/SUCESSO --- */}
        {erro && <div className="alert alert-danger small text-center shake">{erro}</div>}
        {sucesso && <div className="alert alert-success small text-center fade-in">{sucesso}</div>}

        {/* --- FORMULÁRIO DE LOGIN --- */}
        {!isRecovering && (
            <form onSubmit={handleSubmitLogin}>
                <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">E-mail</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><EnvelopeSimple/></span>
                        <input 
                            type="email" 
                            className="form-control border-start-0 ps-0 bg-light" 
                            placeholder="seu@email.com" 
                            required 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small fw-bold text-muted m-0">Senha</label>
                        <button 
                            type="button" 
                            onClick={() => { setIsRecovering(true); setErro(""); setSucesso(""); }} 
                            className="btn btn-link p-0 text-decoration-none small text-muted hover-text-accent"
                            style={{fontSize: '11px'}}
                        >
                            Esqueceu a senha?
                        </button>
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock/></span>
                        <input 
                            type="password" 
                            className="form-control border-start-0 ps-0 bg-light" 
                            placeholder="••••••" 
                            required 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-primary-custom w-100 py-2 mb-3 shadow-sm">
                    ENTRAR
                </button>

                <div className="text-center pt-3 border-top">
                    <small className="text-muted">Ainda não tem conta? </small>
                    <Link to="/register" className="fw-bold text-dark text-decoration-none">Criar Conta</Link>
                </div>
            </form>
        )}

        {/* --- FORMULÁRIO DE RECUPERAÇÃO --- */}
        {isRecovering && (
            <form onSubmit={handleSubmitRecovery} className="fade-in">
                <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">E-mail Cadastrado</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><User/></span>
                        <input 
                            type="email" 
                            className="form-control border-start-0 ps-0 bg-light" 
                            placeholder="exemplo@email.com" 
                            required 
                            value={recoverEmail} 
                            onChange={e => setRecoverEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-dark w-100 py-2 mb-3 shadow-sm">
                    ENVIAR LINK
                </button>

                <button 
                    type="button" 
                    onClick={() => { setIsRecovering(false); setErro(""); setSucesso(""); }} 
                    className="btn btn-outline-light text-muted border-0 w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
                >
                    <ArrowLeft size={16}/> Voltar ao Login
                </button>
            </form>
        )}

      </div>
      <style>{`
        .shake { animation: shake 0.5s; }
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}