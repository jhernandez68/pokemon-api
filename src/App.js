import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

function App(){
  return (
    <>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<PokemonList/>}/>
          <Route path="/pokemon/:id" element={<PokemonDetail/>}/>
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
