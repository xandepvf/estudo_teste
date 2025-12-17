import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { TopBar, WhatsAppButton } from './components/Marketing';
import { ScrollButton } from './components/ScrollButton';

import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Catalog } from './pages/Catalog';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Tracking } from './pages/Tracking';

import { PRODUTOS_INICIAIS } from './data';

const carregarDados = (chave, valorPadrao) => {
  try {
    const item = localStorage.getItem(chave);
    return item ? JSON.parse(item) : valorPadrao;
  } catch (error) {
    console.error(`Erro ao carregar ${chave}:`, error);
    return valorPadrao;
  }
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  // --- CONFIGURAÇÃO DA LOJA (WHITE LABEL) ---
  const [configLoja, setConfigLoja] = useState(() => carregarDados('loja_config', {
      nome: "Minha Loja Premium",
      emailContato: "contato@loja.com",
      telefone: "(11) 99999-9999",
      corPrincipal: "#c5a065",
      moeda: "BRL"
  }));

  const [produtos, setProdutos] = useState(() => carregarDados('loja_produtos', PRODUTOS_INICIAIS));
  const [usuarios, setUsuarios] = useState(() => carregarDados('loja_usuarios', []));
  const [userLogado, setUserLogado] = useState(() => carregarDados('loja_sessao', null));
  const [carrinho, setCarrinho] = useState(() => carregarDados('loja_carrinho', []));
  const [favoritos, setFavoritos] = useState(() => carregarDados('loja_favoritos', []));
  const [pedidos, setPedidos] = useState(() => carregarDados('loja_pedidos', []));
  const [avaliacoes, setAvaliacoes] = useState(() => carregarDados('loja_avaliacoes', []));
  
  const [cupons, setCupons] = useState(() => carregarDados('loja_cupons', [{codigo: 'BEMVINDO10', desconto: 10}]));
  const [newsletter, setNewsletter] = useState(() => carregarDados('loja_newsletter', []));
  const [mensagens, setMensagens] = useState(() => carregarDados('loja_mensagens', []));
  const [enderecos, setEnderecos] = useState(() => carregarDados('loja_enderecos', []));
  const [recentes, setRecentes] = useState(() => carregarDados('loja_recentes', []));

  const [termoBusca, setTermoBusca] = useState("");
  const [toastMsg, setToastMsg] = useState(null);

  // --- PERSISTÊNCIA ---
  useEffect(() => { localStorage.setItem('loja_config', JSON.stringify(configLoja)); }, [configLoja]);
  useEffect(() => { localStorage.setItem('loja_produtos', JSON.stringify(produtos)); }, [produtos]);
  useEffect(() => { localStorage.setItem('loja_usuarios', JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem('loja_carrinho', JSON.stringify(carrinho)); }, [carrinho]);
  useEffect(() => { localStorage.setItem('loja_pedidos', JSON.stringify(pedidos)); }, [pedidos]);
  useEffect(() => { localStorage.setItem('loja_avaliacoes', JSON.stringify(avaliacoes)); }, [avaliacoes]);
  useEffect(() => { localStorage.setItem('loja_cupons', JSON.stringify(cupons)); }, [cupons]);
  useEffect(() => { localStorage.setItem('loja_newsletter', JSON.stringify(newsletter)); }, [newsletter]);
  useEffect(() => { localStorage.setItem('loja_mensagens', JSON.stringify(mensagens)); }, [mensagens]);
  useEffect(() => { localStorage.setItem('loja_enderecos', JSON.stringify(enderecos)); }, [enderecos]);
  useEffect(() => { localStorage.setItem('loja_recentes', JSON.stringify(recentes)); }, [recentes]);
  
  // Atualiza CSS Variables dinamicamente baseado na config
  useEffect(() => {
      document.documentElement.style.setProperty('--accent-color', configLoja.corPrincipal);
  }, [configLoja]);

  useEffect(() => {
    if (userLogado) {
      const usuariosAtualizados = usuarios.map(u => u.email === userLogado.email ? { ...u, favoritosSalvos: favoritos } : u);
      localStorage.setItem('loja_usuarios', JSON.stringify(usuariosAtualizados));
      localStorage.setItem('loja_sessao', JSON.stringify({ ...userLogado, favoritosSalvos: favoritos }));
      localStorage.setItem('loja_favoritos', JSON.stringify(favoritos));
    } else {
       localStorage.setItem('loja_favoritos', JSON.stringify(favoritos));
    }
  }, [favoritos, userLogado]);

  // --- FUNÇÕES DE NEGÓCIO ---
  const atualizarConfiguracao = (novaConfig) => {
      setConfigLoja({ ...configLoja, ...novaConfig });
      setToastMsg("Configurações da loja atualizadas!");
  };

  const enviarMensagemContato = (msg) => {
      setMensagens([{ ...msg, id: Date.now(), data: new Date().toLocaleDateString(), status: 'Pendente' }, ...mensagens]);
      setToastMsg("Mensagem enviada com sucesso!");
  };

  const resolverMensagem = (id) => {
      setMensagens(mensagens.map(m => m.id === id ? { ...m, status: 'Resolvido' } : m));
      setToastMsg("Atendimento finalizado.");
  };

  const salvarEndereco = (novoEnd) => {
      setEnderecos([...enderecos, { ...novoEnd, id: Date.now() }]);
      setToastMsg("Endereço salvo!");
  };

  const removerEndereco = (id) => {
      setEnderecos(enderecos.filter(e => e.id !== id));
      setToastMsg("Endereço removido.");
  };

  const adicionarAosRecentes = (p) => { setRecentes(prev => [p, ...prev.filter(x=>x.id!==p.id)].slice(0,4)); };
  
  const registrarUsuario = (novo) => { 
      if(usuarios.some(u=>u.email===novo.email)) return setToastMsg("Email em uso."); 
      const u={...novo, favoritosSalvos:[], dataCadastro: new Date().toLocaleDateString()}; 
      setUsuarios([...usuarios, u]); 
      setUserLogado(u); 
      setFavoritos([]); 
      setToastMsg(`Bem-vindo ${novo.nome}!`); 
  };
  
  const loginUsuario = (email, senha) => { 
      const u = usuarios.find(x=>x.email===email && x.senha===senha); 
      if(u){ 
          setUserLogado(u); 
          setFavoritos(u.favoritosSalvos||[]); 
          setToastMsg("Logado!"); 
          return true; 
      } 
      return false; 
  };

  const recuperarSenha = (email) => {
      const usuarioExiste = usuarios.some(u => u.email === email);
      if (usuarioExiste) {
          setToastMsg(`Um link de recuperação foi enviado para ${email}.`);
          return true;
      } else {
          setToastMsg("E-mail não encontrado na nossa base.");
          return false;
      }
  };
  
  const logoutUsuario = () => { 
      setUserLogado(null); 
      setFavoritos([]); 
      localStorage.removeItem('loja_sessao'); 
      setToastMsg("Saiu."); 
  };
  
  const atualizarUsuario = (u) => { 
      setUsuarios(usuarios.map(x=>x.email===u.email?u:x)); 
      setUserLogado(u); 
      setToastMsg("Perfil salvo!"); 
  };
  
  const adminEditarUsuario = (antigo, novo) => { 
      if(antigo!==novo.email && usuarios.some(u=>u.email===novo.email)) return setToastMsg("Email em uso!"); 
      setUsuarios(usuarios.map(u=>u.email===antigo?{...u,...novo}:u)); 
      if(userLogado.email===antigo) setUserLogado({...userLogado,...novo}); 
      setToastMsg("Atualizado!"); 
  };
  
  const adicionarCupom = (n) => { setCupons([...cupons, n]); setToastMsg("Cupom criado!"); };
  const removerCupom = (c) => { setCupons(cupons.filter(x=>x.codigo!==c)); setToastMsg("Removido."); };
  const assinarNewsletter = (e) => { if(!newsletter.includes(e)){setNewsletter([...newsletter,e]); setToastMsg("Inscrito!");} else setToastMsg("Já na lista."); };
  
  const adicionarProdutoNovo = (p) => { setProdutos([{...p, estoque: Number(p.estoque)||10}, ...produtos]); setToastMsg("Criado!"); };
  const removerProduto = (id) => { setProdutos(produtos.filter(p => p.id !== id)); setToastMsg("Removido."); };
  
  const editarProduto = (p) => {
      setProdutos(produtos.map(prod => prod.id === p.id ? p : prod));
      setToastMsg("Produto atualizado!");
  };
  
  const toggleFavorito = (p) => { 
      if(favoritos.some(f=>f.id===p.id)) { 
          setFavoritos(favoritos.filter(f=>f.id!==p.id)); 
          setToastMsg("Removido dos favoritos."); 
      } else { 
          setFavoritos([...favoritos, p]); 
          setToastMsg("Salvo nos favoritos!"); 
      } 
  };
  
  const adicionarAoCarrinho = (p) => { 
      if (!userLogado) {
          setToastMsg("Faça login para adicionar à sacola.");
          return;
      }
      if(p.estoque<=0) return setToastMsg("Esgotado."); 
      setCarrinho(prev => { 
          const ex=prev.find(i=>i.id===p.id); 
          if(ex && ex.quantidade>=p.estoque) return prev; 
          if(ex) { 
              setToastMsg("Qtd atualizada."); 
              return prev.map(i=>i.id===p.id?{...i,quantidade:i.quantidade+1}:i); 
          } 
          setToastMsg("Adicionado à sacola."); 
          return [...prev, {...p, quantidade:1}]; 
      }); 
  };
  
  const removerDoCarrinho = (id) => setCarrinho(prev=>prev.filter(i=>i.id!==id));
  const atualizarQtd = (id, d) => setCarrinho(prev=>prev.map(i=>{ if(i.id===id){ const q=i.quantidade+d; if(q>i.estoque)return i; return {...i, quantidade:Math.max(1,q)}; } return i; }));
  
  const realizarPedido = (d, t) => { 
      const np = { 
          id: Math.floor(Math.random()*100000), 
          data: new Date().toLocaleDateString(), 
          hora: new Date().toLocaleTimeString(), 
          cliente: userLogado?userLogado.nome:d.nome, 
          emailCliente: userLogado?userLogado.email:'guest', 
          total: t, 
          itens: carrinho, 
          status: "Processando" 
      }; 
      setProdutos(produtos.map(p=>{ 
          const i=carrinho.find(x=>x.id===p.id); 
          return i ? {...p, estoque:Math.max(0, p.estoque-i.quantidade)} : p; 
      })); 
      setPedidos([np, ...pedidos]); 
      setCarrinho([]); 
      return np.id; 
  };
  
  const atualizarStatusPedido = (id, st) => { setPedidos(pedidos.map(p=>p.id===id?{...p, status:st}:p)); setToastMsg(`Status: ${st}`); };
  const adicionarAvaliacao = (r) => { setAvaliacoes([r, ...avaliacoes]); setToastMsg("Avaliado!"); };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopBar />
      <div className="d-flex flex-column min-vh-100">
        {/* Passando configLoja para a Navbar */}
        <Navbar cartCount={carrinho.reduce((a,b)=>a+b.quantidade,0)} favCount={favoritos.length} onSearch={setTermoBusca} userLogado={userLogado} configLoja={configLoja}/>
        
        <Routes>
          <Route path="/" element={<Home produtos={produtos} addToCart={adicionarAoCarrinho} onSubscribe={assinarNewsletter} produtosRecentes={recentes} />} />
          <Route path="/catalogo" element={<Catalog produtos={produtos.filter(p=>p.nome.toLowerCase().includes(termoBusca.toLowerCase()))} addToCart={adicionarAoCarrinho} onProductView={adicionarAosRecentes} />} />
          <Route path="/produto/:id" element={<ProductDetails produtos={produtos} addToCart={adicionarAoCarrinho} toggleFav={toggleFavorito} favoritos={favoritos} avaliacoes={avaliacoes} onAddReview={adicionarAvaliacao} userLogado={userLogado} addToRecent={adicionarAosRecentes} />} />
          <Route path="/carrinho" element={<Cart cartItems={carrinho} updateQty={atualizarQtd} removeFromCart={removerDoCarrinho} produtos={produtos} addToCart={adicionarAoCarrinho}/>} />
          <Route path="/wishlist" element={<Wishlist favoritos={favoritos} toggleFav={toggleFavorito} />} />
          <Route path="/checkout" element={<Checkout cartItems={carrinho} onPlaceOrder={realizarPedido} notify={setToastMsg} cuponsDisponiveis={cupons}/>} />
          
          <Route path="/admin" element={<Admin 
              onAddProduct={adicionarProdutoNovo} 
              onRemoveProduct={removerProduto} 
              onEditProduct={editarProduto}
              onUpdateConfig={atualizarConfiguracao} // NOVA FUNÇÃO PASSADA
              configLoja={configLoja}               // ESTADO PASSADO
              pedidos={pedidos} 
              produtos={produtos} 
              onUpdateStatus={atualizarStatusPedido} 
              userLogado={userLogado} 
              listaUsuarios={usuarios} 
              onRemoveUser={(email)=>setUsuarios(usuarios.filter(u=>u.email!==email))} 
              onEditUser={adminEditarUsuario} 
              cupons={cupons} 
              onAddCoupon={adicionarCupom} 
              onRemoveCoupon={removerCupom} 
              listaNewsletter={newsletter} 
              mensagens={mensagens} 
              onResolverMensagem={resolverMensagem}
          />} />
          
          <Route path="/register" element={<Register onRegister={registrarUsuario} />} />
          <Route path="/login" element={<Login onLogin={loginUsuario} onRecoverPassword={recuperarSenha} />} />
          <Route path="/profile" element={<Profile user={userLogado} onLogout={logoutUsuario} onUpdateUser={atualizarUsuario} favoritos={favoritos} pedidos={pedidos} enderecos={enderecos} onSaveAddress={salvarEndereco} onRemoveAddress={removerEndereco}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact onSendMessage={enviarMensagemContato} configLoja={configLoja} />} />
          <Route path="/tracking" element={<Tracking pedidos={pedidos} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer configLoja={configLoja} />
        <WhatsAppButton />
        <ScrollButton />
        {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg(null)} />}
      </div>
    </BrowserRouter>
  );
}

export default App;