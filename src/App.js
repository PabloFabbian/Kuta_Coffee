import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import NavBar from "./components/NavBar/NavBar";
import Header from "./components/Header";
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import ItemCount from './components/ItemCount/ItemCount';


function App() {
  return (
    <>
      <NavBar />
      <Header greeting={'Explora el arte del café: un sorbo, un mundo.'}/>
      <ItemListContainer />
      <ItemCount initial={1} stock={10} onAdd={(quantity) => console.log('Cantidad agregada ', quantity)}/>
    </>
  );
}

export default App;