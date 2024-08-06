import { Container } from "react-bootstrap"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import CartScreen from "./Screens/CartScreen"
import LoginScreen from "./Screens/LoginScreen"
import RegisterScreen from "./Screens/RegisterScreen"
import ProfileScreen from "./Screens/ProfileScreen"
import ShippingScreen from "./Screens/ShippingScreen"
import PaymentScreen from "./Screens/PaymentScreen"
import PlaceOrderScreen from "./Screens/PlaceOrderScreen"
import OrderScreen from "./Screens/OrderScreen"
import OrderListScreen from "./Screens/OrderListScreen"
import UserListScreen from "./Screens/UserListScreen"
import UserEditScreen from "./Screens/UserEditScreen"
import ProductListScreen from "./Screens/ProductListScreen"
import ProductEditScreen from "./Screens/ProductEditScreen"


function App() {

  return (
    <Router>
      <Header />
      <main className="py-5">
        <Container>

          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/admin/userList" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />

          </Routes>

        </Container>
      </main>
      <Footer />
    </Router >
  );
}

export default App;
