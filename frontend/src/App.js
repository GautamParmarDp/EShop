import { Container } from "react-bootstrap"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="py-5">
        <Container>

          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/product/:id" element={<ProductScreen />} />
          </Routes>

        </Container>
      </main>
      <Footer />
    </BrowserRouter >
  );
}

export default App;
