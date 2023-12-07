import { useState, useEffect } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_API_KEY;
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryPrompt, setQueryPrompt] = useState(false);
  const [newFilter, setNewFilter] = useState("");

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    setNewFilter(filterValue);

    if (filterValue.length > 0) {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(filterValue)
      );

      if (filtered.length > 10) {
        setQueryPrompt(true);
      } else {
        setQueryPrompt(false);
      }

      setSelectedCountry(filtered.length === 1 ? filtered[0] : null);
    } else {
      setQueryPrompt(false);
      setSelectedCountry(null);
    }
  };

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => {
        setCountries(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedCountry) {
        try {
          const weatherResponse = await axios.get(weatherApiUrl, {
            params: {
              q: `${
                selectedCountry.capital
              },${selectedCountry.cca2.toLowerCase()}`,
              appid: api_key,
              units: "metric",
            },
          });

          setSelectedCountry((prevCountry) => ({
            ...prevCountry,
            weather: {
              temperature: weatherResponse.data.main.temp,
              description: weatherResponse.data.weather[0].description,
              icon: weatherResponse.data.weather[0].icon,
              wind: weatherResponse.data.wind.speed,
            },
          }));
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeather();
  }, [selectedCountry]);

  return (
    <div>
      Find countries
      <input value={newFilter} onChange={handleFilter} />
      {(loading || newFilter) && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {queryPrompt ? (
                <p>Too many matches, specify another filter</p>
              ) : (
                <>
                  {countries.length > 0 && (
                    <ul>
                      {countries
                        .filter((country) =>
                          country.name.common.toLowerCase().includes(newFilter)
                        )
                        .map((country) => (
                          <li key={country.ccn3}>
                            {country.name.common}
                            <button onClick={() => setSelectedCountry(country)}>
                              Show Details
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                  {selectedCountry && (
                    <div>
                      <h2>{selectedCountry.name.common}</h2>
                      <p>Capital: {selectedCountry.capital}</p>
                      <p>Area: {selectedCountry.area} km²</p>
                      <p>Languages:</p>
                      <ul>
                        {Object.values(selectedCountry.languages).map(
                          (language, index) => (
                            <li key={index}>{language}</li>
                          )
                        )}
                      </ul>
                      <img
                        src={selectedCountry.flags.png}
                        alt={`${selectedCountry.name.common} Flag`}
                      />
                      {selectedCountry.weather && (
                        <div>
                          <h3>
                            Weather Information for {selectedCountry.capital}
                          </h3>
                          <p>
                            Temperature: {selectedCountry.weather.temperature}°C
                          </p>
                          <p>
                            Description: {selectedCountry.weather.description}
                          </p>
                          <img
                            src={`http://openweathermap.org/img/wn/${selectedCountry.weather.icon}.png`}
                            alt="Weather Icon"
                          />
                          <p>Wind Speed: {selectedCountry.weather.wind}m/s</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
