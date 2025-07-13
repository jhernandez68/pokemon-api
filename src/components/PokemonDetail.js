import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [compareQuery, setCompareQuery] = useState('')
  const [compareData, setCompareData] = useState(null)
  const [allNames, setAllNames] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [battleResult, setBattleResult] = useState('')
  const [battleReason, setBattleReason] = useState('')

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
      .then(setData)
  }, [id])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(r => r.json())
      .then(d => setAllNames(d.results.map(p => p.name)))
  }, [])

  useEffect(() => {
    if (!compareQuery) return setSuggestions([])
    setSuggestions(
      allNames
        .filter(n => n.startsWith(compareQuery.toLowerCase()))
        .slice(0, 5)
    )
  }, [compareQuery, allNames])

  const selectSuggestion = name => {
    setCompareQuery(name)
    setSuggestions([])
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(r => r.json())
      .then(d => {
        setCompareData(d)
        setBattleResult('')
        setBattleReason('')
      })
  }

  const handleCompare = () => {
    if (!compareQuery) return
    fetch(`https://pokeapi.co/api/v2/pokemon/${compareQuery.toLowerCase()}`)
      .then(r => r.json())
      .then(d => {
        setCompareData(d)
        setBattleResult('')
        setBattleReason('')
        setSuggestions([])
      })
  }

  const handleBattle = () => {
    if (!data || !compareData) return
    const sum = p => p.stats.reduce((a, s) => a + s.base_stat, 0)
    const s1 = sum(data), s2 = sum(compareData)
    if (s1 > s2) {
      setBattleResult(`${cap(data.name)} gana!`)
      setBattleReason(`Stats: ${s1} vs ${s2}`)
    } else if (s2 > s1) {
      setBattleResult(`${cap(compareData.name)} gana!`)
      setBattleReason(`Stats: ${s2} vs ${s1}`)
    } else {
      setBattleResult('Empate!')
      setBattleReason(`Igualados: ${s1}`)
    }
  }

  if (!data) return null

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
        <h2>{cap(data.name)}</h2>
      </div>
      <div className="compare-section">
        <h3 className="compare-title">¡Busca otro pokemon para compararlos!</h3>
        <div className="compare-search">
          <div className="input-wrapper">
            <input
              value={compareQuery}
              onChange={e => setCompareQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCompare()}
              placeholder="Buscar Pokémon"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map(n => (
                  <li key={n} onMouseDown={() => selectSuggestion(n)}>
                    {cap(n)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="battle-wrap">
        <div className="detail-card">
          <img src={data.sprites.front_default} alt={data.name} />
          <p>Tipos: {data.types.map(t => t.type.name).join(', ')}</p>
          <p>Altura: {data.height}</p>
          <p>Peso: {data.weight}</p>
        </div>
        {compareData && (
          <>
            <div className="vs-area">
              <button className="vs-btn" onClick={handleBattle}>VS</button>
              {battleResult && <p className="battle-result">{battleResult}</p>}
              {battleReason && <p className="battle-reason">{battleReason}</p>}
            </div>
            <div className="detail-card">
              <img src={compareData.sprites.front_default} alt={compareData.name} />
              <p>Tipos: {compareData.types.map(t => t.type.name).join(', ')}</p>
              <p>Altura: {compareData.height}</p>
              <p>Peso: {compareData.weight}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
