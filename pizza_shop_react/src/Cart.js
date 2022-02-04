import './App.css';
import store from './store';
import { connect } from 'react-redux';



function ItemInCart(props){
  return(
    <div className="item_in_cart">
      <img src={props.item.img} />
      <h2>{props.item.name}</h2>
      <button onClick={() => store.dispatch({type: 'DECREMENT', name: props.item.name})}>-</button>
      <span>{props.item.count}</span>
      <button onClick={() => store.dispatch({type: 'INCREMENT',name: props.item.name})}>+</button>
      <div className="price total">{props.item.price * props.item.count} UAH</div>
      <button onClick={() => store.dispatch({type: 'DELETE_FROM_CART',name: props.item.name})}>x</button>
    </div>
  );
}


function Cart(){
  return(
    <>
    <h1>Cart </h1>
    {
      store.getState().cart.map((item,index) => <ItemInCart key={index} item={item} />)
    }
    </>
  );
}

const mapStateToProps = function(state) {
  return {
    cart: state.cart,
    cartTotal: state.cartTotal,
    cartCount: state.cartCount
  };
}

export default connect(mapStateToProps)(Cart);