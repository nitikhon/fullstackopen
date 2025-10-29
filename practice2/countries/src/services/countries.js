import axios from "axios"

const BaseUrl = "https://studies.cs.helsinki.fi/restcountries"

const getAllCountries = () => {
    const result = axios.get(`${BaseUrl}/api/all`)
    return result.then(response => response.data)
}

const getCountriesByName = (name) => {
    const result = axios.get(`${BaseUrl}/api/name/${name}`)
    return result.then(response => response.data)
}

const getCountryWeather = (city, api_key) => {
    const result = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
    return result.then(response => response.data)
}

export default { getAllCountries, getCountriesByName, getCountryWeather }