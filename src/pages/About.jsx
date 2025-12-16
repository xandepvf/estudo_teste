import { Users, Tree, Heart } from "phosphor-react"; // CORREÇÃO: Heart no lugar de HandHeart

export function About() {
  return (
    <div className="fade-in">
      <div className="bg-dark text-white py-5 text-center">
        <div className="container py-5">
          <h1 className="display-3 font-cinzel mb-3">Nossa História</h1>
        </div>
      </div>
      <section className="bg-light py-5">
        <div className="container py-4">
          <div className="row g-4 text-center">
            <div className="col-md-4"><div className="p-4 bg-white shadow-sm h-100 rounded"><Tree size={48} className="text-accent mb-3"/><h4>Sustentabilidade</h4></div></div>
            {/* CORREÇÃO ABAIXO: Usando Heart */}
            <div className="col-md-4"><div className="p-4 bg-white shadow-sm h-100 rounded"><Heart size={48} className="text-accent mb-3"/><h4>Artesanal</h4></div></div>
            <div className="col-md-4"><div className="p-4 bg-white shadow-sm h-100 rounded"><Users size={48} className="text-accent mb-3"/><h4>Comunidade</h4></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}