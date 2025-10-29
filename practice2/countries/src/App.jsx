import { useEffect, useState } from 'react'
import countriesService from './services/countries'
import Country from './components/Country'


function App() {
  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    countriesService
      .getAllCountries()
      .then(data => {
        setCountries(data)
      })
  }, [])

  if (!countries) {
    return <h1>Loading...</h1>
  }

  const handleOnChange = (event) => {
    setQuery(event.target.value)
  }

  const filteredCountries = countries.filter(country => String(country.name.common).toLowerCase().includes(query.toLowerCase()))

  const displayIfSingleCountryCond = () => {
    const country = filteredCountries[0]
    return <Country country={country} forceShow={true} showToggle={false} />
  }

  const displayCond = (
    filteredCountries.length > 10
      ? <p>Too many matches, specify another filter</p>
      : filteredCountries.length == 1
        ? displayIfSingleCountryCond()
        : <div>
          {filteredCountries?.map(country =>
            <Country key={country.name.common} country={country} forceShow={false} showToggle={true} />
          )}
        </div>
  )

  return (
    <div>
      <div>find countries <input type="text" onChange={handleOnChange} /></div>
      {
        query !== ''
          ? displayCond
          : <p>Search for Countries!</p>
      }
    </div>
  )
}

export default App
