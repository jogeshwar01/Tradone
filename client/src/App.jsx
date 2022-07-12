import Product from "./pages/Product";
import Home from "./pages/Home"
import ProductList from "./pages/ProductList.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import {
  BrowserRouter,
  Routes, //same as Switch
  Route,
  Navigate
} from "react-router-dom";

const App = () => {
  const user = true;  //just for temporary purpose
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>

        <Route path="/products/:category" element={<ProductList />}>
        </Route>

        <Route path="/product/:id" element={<Product />}>
        </Route>

        <Route path="/cart" element={<Cart />}>
        </Route>

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}>
        </Route>

        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />}>
        </Route>

      </Routes>
    </BrowserRouter>

  );
};

export default App;