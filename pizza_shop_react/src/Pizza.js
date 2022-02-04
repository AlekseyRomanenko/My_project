import store from './store';

function Pizza(props){
  return(
    <div className="pizza">
      <img src={props.data.img} />
      <h2>{props.data.name}</h2>
      <div className="price">{props.data.price} UAH</div>
      <button onClick={()=> store.dispatch({type: 'ADD_TO_CART', name: props.data.name})}>Add to cart</button>
    </div>
  );
}


export default Pizza;