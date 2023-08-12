import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from "./components/NavBar";
import Header from "./components/Header";
import ItemListContainer from './ItemListContainer/ItemListContainer';
import ItemCount from './components/ItemCount/ItemCount';

function App() {
  return (
    <>
      <NavBar />
      <Header />
      <ItemListContainer greeting={'¡Bienvenidos!'} />
      <ItemCount initial={1} stock={10} onAdd={(quantity) => console.log('Cantidad agregada ', quantity)}/>
    </>
  );
}

export default App;