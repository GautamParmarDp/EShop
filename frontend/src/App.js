import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import CartScreen from "./Screens/CartScreen"
import LoginScreen from "./Screens/LoginScreen"

function App() {

  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>

          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
          </Routes>

        </Container>
      </main>
      <Footer />
    </Router >
  );
}

export default App;
