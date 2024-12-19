import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchCountryData, resetCountries, resetError } from "../redux/slice";

function CountryComparison() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { country1, country2 } = state || {};
  const {
    country1: data1,
    country2: data2,
    isLoading,
    error,
  } = useSelector((state) => state.globalData);

  useEffect(() => {
    dispatch(resetCountries());
    if (country1) dispatch(fetchCountryData(country1));
    if (country2) dispatch(fetchCountryData(country2));
    return () => {
      dispatch(resetError());
    };
  }, [country1, country2, dispatch]);

  return (
    <div className="container text-center mt-4">
      <h1>Country Comparison</h1>
      {error.countryComparison ? (
        <p>{error.countryComparison}</p>
      ) : isLoading.countryComparison ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {[data1, data2].map((data, idx) => (
            <div key={idx} className="col-md-6">
              {data && (
                <>
                  <img src={data.flags.png} alt={data.name.common} />
                  <h2>{data.name.common}</h2>
                  <p>Population: {data.population.toLocaleString()}</p>
                  <p>Area: {data.area.toLocaleString()} km²</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CountryComparison;
