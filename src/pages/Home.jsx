import { useState, useEffect } from "react";
import { ArrowRight, EnvelopeSimple, X, Star, ChatCircleDots, Truck, ShieldCheck, CreditCard } from "phosphor-react";
import { Link } from "react-router-dom";

const SLIDES = [
  { id: 1, titulo: "Essência Natural", subtitulo: "O encontro entre a madeira maciça e o design moderno.", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600" },
  { id: 2, titulo: "Minimalismo Suave", subtitulo: "Tons terrosos e texturas orgânicas para o seu refúgio.", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=1600" }
];

const DEPOIMENTOS = [
  { nome: "Ana Souza", texto: "A qualidade dos móveis é impressionante. Superou minhas expectativas!", nota: 5 },
  { nome: "Carlos Lima", texto: "Entrega rápida e atendimento excelente. Recomendo muito!", nota: 5 },
  { nome: "Mariana Costa", texto: "Design único que transformou minha sala. Amei!", nota: 4 }
];

export function Home({ produtos, addToCart, onSubscribe, produtosRecentes }) {
  const destaques = produtos && produtos.length > 0 ? produtos.slice(0, 4) : [];
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Verifica se já fechou antes (simulado)
      const popupFechado = localStorage.getItem("popup_fechado");
      if (!popupFechado) setShowPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = () => {
    if(email && email.includes('@')) { 
        onSubscribe(email); 
        setEmail(""); 
        setShowPopup(false);
        localStorage.setItem("popup_fechado", "true");
    } 
    else { alert("Digite um e-mail válido."); }
  };

  const fecharPopup = () => {
      setShowPopup(false);
      localStorage.setItem("popup_fechado", "true");
  };

  return (
    <div className="fade-in position-relative">
      
      {/* --- POPUP NEWSLETTER --- */}
      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in" style={{zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)'}}>
            <div className="bg-white p-0 rounded shadow-lg position-relative overflow-hidden d-flex flex-column flex-md-row" style={{maxWidth: '700px', width: '90%', maxHeight: '90vh'}}>
                <button onClick={fecharPopup} className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle p-1 shadow-sm" style={{zIndex:10}}><X size={20}/></button>
                
                <div className="d-none d-md-block w-50 bg-light" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600")', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                
                <div className="w-100 w-md-50 p-5 d-flex flex-column justify-content-center text-center">
                    <h3 className="font-cinzel fw-bold mb-2">Bem-vindo!</h3>
                    <p className="text-muted small mb-4">Inscreva-se e ganhe <strong className="text-dark">10% OFF</strong> na sua primeira compra.</p>
                    <input type="email" className="form-control mb-2 text-center bg-light" placeholder="Seu melhor e-mail" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <button onClick={handleSubscribe} className="btn btn-dark w-100 text-uppercase fw-bold">Quero Desconto</button>
                    <button onClick={fecharPopup} className="btn btn-link btn-sm text-muted mt-2 text-decoration-none" style={{fontSize:'10px'}}>Não, obrigado</button>
                </div>
            </div>
        </div>
      )}

      {/* --- HERO CAROUSEL --- */}
      <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-indicators">
            {SLIDES.map((_, i) => <button key={i} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} className={i===0?"active":""}></button>)}
        </div>
        <div className="carousel-inner">
          {SLIDES.map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.id} style={{ height: '85vh' }}>
              <div className="position-relative w-100 h-100">
                  <img src={slide.img} className="d-block w-100 h-100 object-fit-cover" style={{ filter: 'brightness(0.65)' }} alt={slide.titulo} />
                  <div className="carousel-caption position-absolute top-50 start-50 translate-middle w-100 text-center text-white p-3">
                      <h1 className="display-1 mb-3 fade-in-up font-cinzel fw-bold" style={{textShadow: '2px 2px 10px rgba(0,0,0,0.5)'}}>{slide.titulo}</h1>
                      <p className="lead mb-4 fade-in-up d-none d-md-block" style={{textShadow: '1px 1px 5px rgba(0,0,0,0.5)'}}>{slide.subtitulo}</p>
                      <Link to="/catalogo" className="btn btn-outline-light rounded-0 px-5 py-3 text-uppercase fw-bold fade-in-up hover-scale border-2">Ver Coleção <ArrowRight className="ms-2"/></Link>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- BENEFÍCIOS (Por que escolher-nos) --- */}
      <section className="bg-light py-5 border-bottom">
          <div className="container py-4">
              <div className="row g-4 text-center">
                  <div className="col-md-4">
                      <div className="p-3">
                          <Truck size={48} className="text-primary-custom mb-3"/>
                          <h5 className="font-cinzel fw-bold">Entrega Rápida e Segura</h5>
                          <p className="text-muted small">Enviamos para todo o país com rastreamento em tempo real e seguro de carga.</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="p-3 border-start border-end">
                          <ShieldCheck size={48} className="text-primary-custom mb-3"/>
                          <h5 className="font-cinzel fw-bold">Garantia Estendida</h5>
                          <p className="text-muted small">Todos os nossos móveis possuem garantia de 1 ano contra defeitos de fabricação.</p>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="p-3">
                          <CreditCard size={48} className="text-primary-custom mb-3"/>
                          <h5 className="font-cinzel fw-bold">Pagamento Facilitado</h5>
                          <p className="text-muted small">Parcele suas compras em até 12x sem juros no cartão de crédito.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CATEGORIAS / AMBIENTES --- */}
      <section className="container py-5 mt-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <h2 className="font-cinzel display-6 fw-bold m-0">Ambientes</h2>
            <Link to="/catalogo" className="text-decoration-none text-dark fw-bold d-none d-md-block hover-text-accent">Ver Todos <ArrowRight/></Link>
          </div>
          <div className="row g-4">
              <div className="col-lg-6">
                  <Link to="/catalogo">
                      <div className="hover-zoom-card position-relative overflow-hidden rounded shadow-sm" style={{height: '400px'}}>
                          <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800" className="hover-zoom-img w-100 h-100 object-fit-cover" alt="Sala de Estar" />
                          <div className="hover-overlay d-flex flex-column justify-content-end p-4 text-white">
                              <h3 className="font-cinzel fw-bold mb-0">Sala de Estar</h3>
                              <span className="small text-uppercase letter-spacing-2 opacity-75">Conforto & Estilo</span>
                          </div>
                      </div>
                  </Link>
              </div>
              <div className="col-lg-6">
                  <Link to="/catalogo">
                      <div className="hover-zoom-card position-relative overflow-hidden rounded shadow-sm" style={{height: '400px'}}>
                          <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800" className="hover-zoom-img w-100 h-100 object-fit-cover" alt="Sala de Jantar" />
                          <div className="hover-overlay d-flex flex-column justify-content-end p-4 text-white">
                              <h3 className="font-cinzel fw-bold mb-0">Sala de Jantar</h3>
                              <span className="small text-uppercase letter-spacing-2 opacity-75">Sofisticação & União</span>
                          </div>
                      </div>
                  </Link>
              </div>
          </div>
      </section>
      
      {/* --- PRODUTOS EM DESTAQUE --- */}
      <section className="container py-5 my-5">
          <h2 className="display-5 font-cinzel fw-bold mb-5 text-center">Destaques da Semana</h2>
          <div className="row g-4">
              {destaques.map((produto) => (
                  <div className="col-md-6 col-lg-3" key={produto.id}>
                      <div className="card-custom h-100 p-3 d-flex flex-column bg-white border">
                          <div className="position-relative overflow-hidden mb-3 rounded" style={{height: '280px'}}>
                              <Link to={`/produto/${produto.id}`}>
                                  <img src={produto.img} className="w-100 h-100 object-fit-cover transition-transform duration-700 hover-scale" alt={produto.nome} />
                              </Link>
                              {produto.estoque < 5 && <span className="position-absolute top-0 end-0 m-2 badge bg-danger">Poucas Unidades</span>}
                          </div>
                          <div className="mt-auto text-center">
                              <small className="text-muted text-uppercase" style={{fontSize:'10px'}}>{produto.categoria}</small>
                              <h6 className="mb-2 text-truncate font-cinzel fw-bold"><Link to={`/produto/${produto.id}`} className="text-dark text-decoration-none">{produto.nome}</Link></h6>
                              <p className="fw-bold text-primary-custom mb-3">R$ {produto.preco.toLocaleString('pt-BR')}</p>
                              <button onClick={() => addToCart(produto)} className="btn btn-outline-dark btn-sm w-100 rounded-0 text-uppercase fw-bold hover-bg-dark hover-text-white transition-all">Adicionar à Sacola</button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
          <div className="text-center mt-5">
              <Link to="/catalogo" className="btn btn-primary-custom px-5 py-3 shadow-sm">Ver Todo o Catálogo</Link>
          </div>
      </section>

      {/* --- PROVA SOCIAL (DEPOIMENTOS) --- */}
      <section className="py-5 bg-white border-top border-bottom">
          <div className="container py-4 text-center">
              <h2 className="font-cinzel fw-bold mb-5">O que dizem nossos clientes</h2>
              <div className="row g-4 justify-content-center">
                  {DEPOIMENTOS.map((depoimento, idx) => (
                      <div className="col-md-4" key={idx}>
                          <div className="p-4 h-100 bg-light rounded shadow-sm position-relative mt-3">
                              <div className="position-absolute top-0 start-50 translate-middle bg-primary-custom text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" style={{width:'40px', height:'40px'}}>
                                  <span className="font-cinzel fw-bold fs-5">“</span>
                              </div>
                              <div className="text-warning mb-3 mt-2">
                                  {[...Array(depoimento.nota)].map((_, i) => <Star key={i} weight="fill"/>)}
                              </div>
                              <p className="text-muted fst-italic mb-3">"{depoimento.texto}"</p>
                              <h6 className="fw-bold m-0 font-cinzel">{depoimento.nome}</h6>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- VISTOS RECENTEMENTE --- */}
      {produtosRecentes && produtosRecentes.length > 0 && (
          <section className="container py-5 mb-5">
              <h4 className="font-cinzel mb-4 text-muted small fw-bold text-uppercase border-bottom pb-2">Vistos Recentemente</h4>
              <div className="row g-4">
                  {produtosRecentes.map(p => (
                      <div className="col-6 col-md-3" key={p.id}>
                          <Link to={`/produto/${p.id}`} className="text-decoration-none text-dark">
                              <div className="d-flex align-items-center gap-3 border p-2 rounded bg-white shadow-sm hover-scale transition-transform">
                                  <img src={p.img} width="60" height="60" className="rounded object-fit-cover" alt={p.nome}/>
                                  <div className="overflow-hidden">
                                      <small className="d-block fw-bold text-truncate">{p.nome}</small>
                                      <small className="text-muted">R$ {p.preco.toLocaleString('pt-BR')}</small>
                                  </div>
                              </div>
                          </Link>
                      </div>
                  ))}
              </div>
          </section>
      )}

      {/* --- NEWSLETTER --- */}
      <section className="bg-dark text-white py-5">
        <div className="container py-4 text-center">
          <EnvelopeSimple size={48} className="mb-3 text-warning opacity-75"/>
          <h2 className="font-cinzel mb-3">Assine nossa Newsletter</h2>
          <p className="text-muted mb-4">Receba novidades exclusivas e ofertas especiais diretamente no seu e-mail.</p>
          <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="input-group input-group-lg">
                    <input type="email" className="form-control rounded-0 border-0 ps-4 fs-6" placeholder="Digite seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} />
                    <button onClick={handleSubscribe} className="btn btn-primary-custom rounded-0 px-4 fw-bold fs-6">INSCREVER</button>
                </div>
                <small className="text-muted mt-2 d-block text-start">*Não enviamos spam. Cancele quando quiser.</small>
            </div>
          </div>
        </div>
      </section>

      {/* --- CHAT FLUTUANTE (VISUAL) --- */}
      <div className="position-fixed bottom-0 end-0 m-4 z-index-modal">
          <Link to="/contact" className="btn btn-primary-custom rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center hover-scale border-white border-2" style={{width:'60px', height:'60px'}} title="Fale Conosco">
              <ChatCircleDots size={32} weight="fill"/>
          </Link>
      </div>

      <style>{`
        .hover-bg-dark:hover { background-color: #212529 !important; border-color: #212529 !important; }
        .hover-text-white:hover { color: #fff !important; }
      `}</style>
    </div>
  );
}