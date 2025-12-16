import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

// Configuração do Firebase injetada pelo ambiente
const firebaseConfig = JSON.parse(__firebase_config || '{}');
const app = initializeApp(firebaseConfig);

// Serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

// ID da Aplicação para separar dados (Multi-tenancy simulado)
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app';

// --- Funções Auxiliares de Caminho (Seguindo as Regras Estritas do Canvas) ---

// Caminho para dados públicos (Produtos, Catálogo)
export const getPublicCollection = (collectionName) => {
  return collection(db, 'artifacts', appId, 'public', 'data', collectionName);
};

// Caminho para dados privados do usuário (Carrinho, Perfil, Pedidos Pessoais)
export const getUserCollection = (userId, collectionName) => {
  if (!userId) throw new Error("UserID é necessário para acessar dados privados.");
  return collection(db, 'artifacts', appId, 'users', userId, collectionName);
};

// Função de Inicialização de Auth (Obrigatória antes de queries)
export const initAuth = async () => {
  if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
    await signInWithCustomToken(auth, __initial_auth_token);
  } else {
    await signInAnonymously(auth);
  }
};