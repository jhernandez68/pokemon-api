import { Link } from 'react-router-dom'

function Header(){
  return (
    <header>
      <Link to="/" className="logo">PokemonWiki</Link>
    </header>
  )
}

export default Header
