import { useEffect, useState } from 'react'
import PokemonCard from './PokemonCard'

function PokemonList() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [types, setTypes] = useState([])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(r => r.json())
      .then(d => {
        Promise.all(d.results.map(p => fetch(p.url).then(r => r.json())))
          .then(all => {
            const list = all.map(p => ({
              id: p.id,
              name: p.name,
              url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
              types: p.types.map(t => t.type.name)
            }))
            setPokemons(list)
            setTypes(Array.from(new Set(list.flatMap(p => p.types))))
          })
      })
  }, [])

  const filtered = pokemons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === 'all' || p.types.includes(filterType))
  )

  const categories = {}
  filtered.forEach(p => {
    p.types.forEach(t => {
      if (filterType === 'all' || t === filterType) {
        if (!categories[t]) categories[t] = []
        categories[t].push(p)
      }
    })
  })

  return (
    <div className="pokemon-list-page">
      <div className="list-controls">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar Pokémon"
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">Todos</option>
          {types.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {Object.keys(categories).map(type => (
        <section key={type}>
          <h3 className="category-title">{type}</h3>
          <div className="pokemon-grid">
            {categories[type].map(p => (
              <PokemonCard key={p.id} name={p.name} url={p.url} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default PokemonList
