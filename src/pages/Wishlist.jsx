import { Link } from "react-router-dom";
import { HeartBreak, Heart } from "phosphor-react"; // CORREÇÃO: HeartBreak

export function Wishlist({ favoritos, toggleFav }) {
  if (favoritos.length === 0) {
    return (
      <div className="container py-5 text-center fade-in" style={{minHeight: '60vh', alignContent: 'center'}}>
        <HeartBreak size={64} className="text-muted mb-3" />
        <h2 className="mb-3">Sua lista de desejos está vazia</h2>
        <Link to="/catalogo" className="btn btn-dark rounded-0 px-4">Ver Coleção</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in">
      <h1 className="display-5 fw-bold mb-5 font-cinzel">Meus Favoritos</h1>
      <div className="row g-4">
        {favoritos.map((produto) => (
          <div className="col-md-6 col-lg-3" key={produto.id}>
              <div className="card-custom h-100 p-3 position-relative">
                  <button onClick={() => toggleFav(produto)} className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle shadow-sm p-2 z-3">
                    <Heart size={20} weight="fill" className="text-danger" />
                  </button>
                  <img src={produto.img} className="w-100 mb-3 rounded-1" style={{height:'200px', objectFit:'cover'}} />
                  <h6>{produto.nome}</h6>
                  <p className="fw-bold text-accent">R$ {produto.preco.toLocaleString('pt-BR')}</p>
                  <Link to={`/produto/${produto.id}`} className="btn btn-outline-dark btn-sm w-100 rounded-0">Ver Detalhes</Link>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}