import './App.css';
import React from 'react';
// router
import {
  Routes,
  Route
} from "react-router-dom";

import { Link } from "react-router-dom";
import Cart from './Cart.js';
import Home from './Home.js';
import Contact from './Contact.js';
import { connect } from 'react-redux';



function App(props){
    return (
      <div className="App">
        <header className="App-header">
          <div className="logo">SuperAPP</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/cart">Cart</Link>
          </nav>
          <div className="cart_info">
            {props.cartCount} items, 
            {props.cartTotal} UAH
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home text='SuperApp Homepage' />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        <footer> &copy; SuperApp </footer>
      </div>
    );
}



const mapStateToProps = function(state) {
  return {
    cart: state.cart,
    cartTotal: state.cartTotal,
    cartCount: state.cartCount
  };
}

export default connect(mapStateToProps)(App);