import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function PokemonCard({ name, url }) {
  const [details, setDetails] = useState(null)
  const id = url.split('/').filter(Boolean).pop()
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => setDetails(d))
  }, [url])
  return (
    <Link to={`/pokemon/${id}`} className="pokemon-card">
      <img src={img} alt={name} />
      <p className="pokemon-name">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
      {details && (
        <div className="card-hover">
          <p>ID: {id}</p>
          <p>Tipos: {details.types.map(t => t.type.name).join(', ')}</p>
          <p>Altura: {details.height}</p>
          <p>Peso: {details.weight}</p>
          <p>Experiencia Base: {details.base_experience}</p>
          <p>Habilidades: {details.abilities.map(a => a.ability.name).join(', ')}</p>
          <p>Stats:</p>
          <ul>
            {details.stats.map(s => (
              <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  )
}

export default PokemonCard
