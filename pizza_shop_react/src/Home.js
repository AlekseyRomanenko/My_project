import {database} from './database.js';
import Pizza from './Pizza.js';

export function Home(props){
  return(
    <>
    <h1>Welcome to {props.text} </h1>
    <div className="shop">
    {
      database.map((item,index) => <Pizza key={index} data={item} />)
    }
    </div>
    </>

  );
}


export default Home;