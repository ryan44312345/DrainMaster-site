import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './pages/App.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import Jogo from './pages/Jogo.jsx'
import NotFound from './pages/NotFound.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='/cadastro' element={<Cadastro/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/jogo' element={<Jogo/>}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
