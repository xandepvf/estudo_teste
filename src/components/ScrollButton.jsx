import { useState, useEffect } from "react";
import { ArrowUp } from "phosphor-react";

export function ScrollButton() {
  const [visivel, setVisivel] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisivel(true);
    } else if (scrolled <= 300) {
      setVisivel(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button 
        onClick={scrollToTop}
        className={`btn btn-dark position-fixed bottom-0 start-0 m-4 rounded-circle shadow p-2 fade-in ${visivel ? 'd-block' : 'd-none'}`}
        style={{zIndex: 1000, width: '50px', height: '50px'}}
        title="Voltar ao topo"
    >
        <ArrowUp size={24} />
    </button>
  );
}