import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListProducts } from './Pages/listProducts';
import { ProductsId } from './Pages/productsId';
import Header from './Header';
import styles from './App.module.css';
import { useState } from 'react';

5

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false); // Estado compartilhado

  return (
    <BrowserRouter>
      <div className={styles.header}>
        <h1>
          ESQUERDA <strong style={{ color: "#000000" }}>A FRENTE</strong>
        </h1>
      </div>
      <Header showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm} />
      <div>
        <Routes>
          <Route index element={<ListProducts />} />
          <Route path='/productsId/:id' element={<ProductsId setShowLoginForm={setShowLoginForm} />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
