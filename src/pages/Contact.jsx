import { useState } from "react";
import { MapPin, Phone, EnvelopeSimple, PaperPlaneRight } from "phosphor-react";

export function Contact({ onSendMessage }) {
  const [formData, setFormData] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(formData);
    setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  return (
    <div className="fade-in">
      <div className="bg-dark text-white py-5 text-center">
        <div className="container py-5">
          <h1 className="display-4 font-cinzel mb-3">Fale Conosco</h1>
          <p className="lead opacity-75">Estamos aqui para ajudar com qualquer dúvida.</p>
        </div>
      </div>

      <div className="container py-5 my-5">
        <div className="row g-5">
          <div className="col-lg-5">
            <h3 className="font-cinzel mb-4">Informações</h3>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-3">
                <div className="bg-light p-3 rounded-circle"><MapPin size={24}/></div>
                <div><h6 className="fw-bold m-0">Nosso Showroom</h6><p className="text-muted m-0">Av. Paulista, 1000 - São Paulo</p></div>
              </div>
              <div className="d-flex gap-3">
                <div className="bg-light p-3 rounded-circle"><Phone size={24}/></div>
                <div><h6 className="fw-bold m-0">Telefone</h6><p className="text-muted m-0">(11) 3003-0000</p></div>
              </div>
              <div className="d-flex gap-3">
                <div className="bg-light p-3 rounded-circle"><EnvelopeSimple size={24}/></div>
                <div><h6 className="fw-bold m-0">E-mail</h6><p className="text-muted m-0">contato@atelierwood.com.br</p></div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="bg-white p-5 shadow-sm rounded border">
              <h3 className="font-cinzel mb-4">Envie uma mensagem</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6"><label className="small fw-bold">Seu Nome</label><input className="form-control" value={formData.nome} onChange={e=>setFormData({...formData, nome:e.target.value})} required/></div>
                  <div className="col-md-6"><label className="small fw-bold">Seu E-mail</label><input type="email" className="form-control" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required/></div>
                  <div className="col-12"><label className="small fw-bold">Assunto</label><input className="form-control" value={formData.assunto} onChange={e=>setFormData({...formData, assunto:e.target.value})} required/></div>
                  <div className="col-12"><label className="small fw-bold">Mensagem</label><textarea rows="4" className="form-control" value={formData.mensagem} onChange={e=>setFormData({...formData, mensagem:e.target.value})} required></textarea></div>
                  <div className="col-12"><button className="btn btn-dark w-100 py-3 fw-bold"><PaperPlaneRight className="me-2"/> ENVIAR MENSAGEM</button></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}