import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Envelope, Lock, ArrowRight } from "phosphor-react";

export function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(formData.email, formData.senha)) {
      navigate("/");
    } else {
      setErro("Credenciais inválidas.");
    }
  };

  return (
    <div className="container-fluid p-0 fade-in" style={{minHeight: '100vh', display: 'flex'}}>
      <div className="row g-0 w-100">
        <div className="col-lg-6 d-none d-lg-block position-relative">
          <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=900" className="w-100 h-100 object-fit-cover" style={{filter: 'brightness(0.8)'}} />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-75"><h1 className="display-4 font-cinzel fw-bold mb-3">Bem-vindo de volta</h1></div>
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="p-5 w-100" style={{maxWidth: '500px'}}>
            <h3 className="fw-bold mb-4 font-cinzel">Login</h3>
            {erro && <div className="alert alert-danger small">{erro}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4"><label className="form-label small fw-bold">E-mail</label><input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required/></div>
              <div className="mb-4"><label className="form-label small fw-bold">Senha</label><input type="password" className="form-control" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} required/></div>
              <button className="btn btn-primary-custom w-100 py-3 mb-4">ENTRAR</button>
            </form>
            <div className="text-center border-top pt-4"><Link to="/register" className="fw-bold text-dark text-decoration-none">Criar conta agora</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}