import { useState, useEffect } from "react";
import { ArrowRight, EnvelopeSimple, X } from "phosphor-react";
import { Link } from "react-router-dom";

const SLIDES = [{ id: 1, titulo: "Essência Natural", subtitulo: "O encontro entre a madeira maciça.", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600" }, { id: 2, titulo: "Minimalismo Suave", subtitulo: "Tons terrosos e texturas orgânicas.", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=1600" }];

export function Home({ produtos, addToCart, onSubscribe, produtosRecentes }) {
  const destaques = produtos && produtos.length > 0 ? produtos.slice(0, 4) : [];
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Estado do Popup

  // --- NOVA LÓGICA: POPUP APÓS 3 SEGUNDOS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      // Poderia verificar localStorage aqui se já fechou antes
      setShowPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = () => {
    if(email && email.includes('@')) { 
        onSubscribe(email); 
        setEmail(""); 
        setShowPopup(false); // Fecha popup se inscrever por ele
    } 
    else { alert("Digite um e-mail válido."); }
  };

  return (
    <div className="fade-in position-relative">
      
      {/* --- POPUP NEWSLETTER --- */}
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in" style={{zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)'}}>
            <div className="bg-white p-0 rounded shadow-lg position-relative overflow-hidden d-flex" style={{maxWidth: '700px', width: '90%', maxHeight: '450px'}}>
                <button onClick={() => setShowPopup(false)} className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle p-1 shadow-sm" style={{zIndex:10}}><X size={20}/></button>
                
                {/* Imagem Popup (Escondida em mobile) */}
                <div className="d-none d-md-block w-50">
                    <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600" className="w-100 h-100 object-fit-cover" alt="Oferta"/>
                </div>
                
                {/* Conteúdo Popup */}
                <div className="w-100 w-md-50 p-5 d-flex flex-column justify-content-center text-center">
                    <h3 className="font-cinzel fw-bold mb-2">Bem-vindo!</h3>
                    <p className="text-muted small mb-4">Inscreva-se e ganhe <strong className="text-dark">10% OFF</strong> na sua primeira compra.</p>
                    <input type="email" className="form-control mb-2 text-center bg-light" placeholder="Seu melhor e-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <button onClick={handleSubscribe} className="btn btn-dark w-100 text-uppercase fw-bold">Quero Desconto</button>
                    <button onClick={() => setShowPopup(false)} className="btn btn-link btn-sm text-muted mt-2 text-decoration-none" style={{fontSize:'10px'}}>Não, obrigado</button>
                </div>
            </div>
        </div>
      )}

      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          {SLIDES.map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.id} style={{ height: '85vh' }}>
              <div className="position-relative w-100 h-100"><img src={slide.img} className="d-block w-100 h-100 object-fit-cover" style={{ filter: 'brightness(0.65)' }} /><div className="carousel-caption position-absolute top-50 start-50 translate-middle w-100"><h1 className="display-1 mb-4 fade-in-up font-cinzel fw-bold">{slide.titulo}</h1><Link to="/catalogo" className="btn btn-outline-light rounded-0 px-5 py-3 text-uppercase fade-in-up">Ver Coleção</Link></div></div>
            </div>
          ))}
        </div>
      </div>
      
      <section className="container py-5 mt-4"><h2 className="text-center font-cinzel mb-5 display-6 fw-bold">Ambientes</h2><div className="row g-4"><div className="col-lg-6"><Link to="/catalogo"><div className="hover-zoom-card position-relative" style={{height: '400px'}}><img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800" className="hover-zoom-img" /><div className="hover-overlay"><h3>Sala</h3></div></div></Link></div><div className="col-lg-6"><Link to="/catalogo"><div className="hover-zoom-card position-relative" style={{height: '400px'}}><img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800" className="hover-zoom-img" /><div className="hover-overlay"><h3>Jantar</h3></div></div></Link></div></div></section>
      
      <section className="container py-5 my-5"><h2 className="display-5 font-cinzel fw-bold mb-5">Destaques</h2><div className="row g-4">{destaques.map((produto) => (<div className="col-md-6 col-lg-3" key={produto.id}><div className="card-custom h-100 p-3 d-flex flex-column"><div className="position-relative overflow-hidden mb-3" style={{height: '280px'}}><Link to={`/produto/${produto.id}`}><img src={produto.img} className="w-100 h-100 object-fit-cover rounded-1" /></Link></div><div className="mt-auto"><h6 className="mb-2 text-truncate">{produto.nome}</h6><p className="fw-bold text-primary-custom">R$ {produto.preco.toLocaleString('pt-BR')}</p><button onClick={() => addToCart(produto)} className="btn btn-outline-dark btn-sm w-100 rounded-0">ADICIONAR</button></div></div></div>))}</div></section>

      {produtosRecentes && produtosRecentes.length > 0 && (
          <section className="container py-5 mb-5 border-top">
              <h4 className="font-cinzel mb-4 text-muted">Vistos Recentemente</h4>
              <div className="row g-4">
                  {produtosRecentes.map(p => (
                      <div className="col-6 col-md-3" key={p.id}>
                          <Link to={`/produto/${p.id}`} className="text-decoration-none text-dark">
                              <div className="d-flex align-items-center gap-3 border p-2 rounded bg-white shadow-sm hover-scale">
                                  <img src={p.img} width="60" height="60" className="rounded object-fit-cover"/>
                                  <div><small className="d-block fw-bold text-truncate" style={{maxWidth:'120px'}}>{p.nome}</small><small className="text-muted">R$ {p.preco.toLocaleString('pt-BR')}</small></div>
                              </div>
                          </Link>
                      </div>
                  ))}
              </div>
          </section>
      )}

      <section className="bg-dark text-white py-5">
        <div className="container py-4 text-center">
          <EnvelopeSimple size={48} className="mb-3 text-warning opacity-75"/>
          <h2 className="font-cinzel mb-3">Assine nossa Newsletter</h2>
          <div className="row justify-content-center">
            <div className="col-md-6"><div className="input-group"><input type="email" className="form-control rounded-0 border-0 py-3 ps-4" placeholder="Seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} /><button onClick={handleSubscribe} className="btn btn-primary-custom rounded-0 px-4 fw-bold">INSCREVER</button></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}