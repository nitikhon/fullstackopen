import { useEffect, useState } from "react"
import countryService from "../services/countries"

const api_key = import.meta.env.VITE_OPENWEATHER_KEY

const Country = ({ country, forceShow = false, showToggle = true }) => {
    const [isShow, setIsShow] = useState(forceShow)
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        countryService
            .getCountryWeather(country.capital, api_key)
            .then(response => {
                console.log(response)
                setWeather(response)
            })
    }, [])

    if (weather === null) {
        return <div>Loading...</div>
    }

    const handleDisplay = () => {
        setIsShow(prev => !prev)
    }

    const languages = Object.values(country.languages).map((lang, index) =>
        <li key={index}>{lang}</li>
    )

    const shouldShowDetails = forceShow || isShow

    return (
        <div>
            {shouldShowDetails ? (
                <div>
                    <h1>{country.name.common}</h1>
                    <div>
                        <p>Capital: {country.capital}</p>
                        <p>Area: {country.area}</p>
                    </div>
                    <h2>Languages</h2>
                    <ul>
                        {languages}
                    </ul>
                    <img src={country.flags.png} alt={`A flag of ${country.name.common}`} />
                    <h1>Weather in {country.capital}</h1>
                    <p>Temperature {weather.main.temp} Celcius</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                        alt={`A picture of ${weather?.weather[0].description}`}
                    />
                    <p>Wind {weather.wind.speed} m/s</p>
                    {showToggle && <button onClick={handleDisplay}>hide</button>}
                </div>
            ) : (
                <div>
                    {country.name.common}
                    {showToggle && <button onClick={handleDisplay}>show</button>}
                </div>
            )}
        </div>
    )
}

export default Country