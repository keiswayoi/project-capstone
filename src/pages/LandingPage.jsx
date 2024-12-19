import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, resetError } from "../redux/slice";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { countries, isLoading, error } = useSelector((state) => ({
    countries: state.globalData.countries,
    isLoading: state.globalData.isLoading.countries,
    error: state.globalData.error.countries,
  }));

  useEffect(() => {
    dispatch(fetchCountries());
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const formatPopulation = (population) => {
    if (population >= 1_000_000_000) {
      return `${(population / 1_000_000_000).toFixed(1)}B`;
    }
    if (population >= 1_000_000) {
      return `${(population / 1_000_000).toFixed(1)}M`;
    }
    return population.toLocaleString();
  };

  const sortedCountries = [...countries].sort(
    (a, b) => b.population - a.population
  );

  return (
    <div className="container py-4">
      <h1 className="text-center">🌍 Country Population Rank</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Flag</th>
              <th>Country</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((country, index) => (
              <tr
                key={country.code || country.name} // Menggunakan kombinasi unik
                onClick={() => navigate(`/news/${country.name}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>
                  {country.flag ? (
                    <img
                      src={country.flag}
                      alt={`Flag of ${country.name}`}
                      style={{ width: "40px", height: "30px" }}
                    />
                  ) : (
                    "No flag"
                  )}
                </td>
                <td>{country.name || "No name"}</td>
                <td>{formatPopulation(country.population)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LandingPage;
