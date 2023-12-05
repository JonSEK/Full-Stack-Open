import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [queryPrompt, setQueryPrompt] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    setNewFilter(filterValue);

    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(filterValue)
    );

    setFilteredCountries(filtered);

    if (filtered.length > 10) {
      setQueryPrompt(true);
    } else {
      setQueryPrompt(false);
    }
    setSelectedCountry(null);
    if (filtered.length === 1) {
      setSelectedCountry(filtered[0]);
    }
  };

  const handleShowDetails = (country) => {
    setSelectedCountry(country);
  };

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                  {filteredCountries.length > 0 ? (
                    <ul>
                      {filteredCountries.map((country) => (
                        <li key={country.cca3}>
                          {country.name.common}
                          <button onClick={() => handleShowDetails(country)}>
                            Show Details
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No matching countries found.</p>
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
