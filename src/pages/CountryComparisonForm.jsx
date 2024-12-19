import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCountryData, resetError, resetCountries } from "../redux/slice";

function CountryComparisonForm() {
  const [countryInput1, setCountryInput1] = React.useState("");
  const [countryInput2, setCountryInput2] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { country1, country2, error, isLoading } = useSelector((state) => ({
    country1: state.globalData.country1,
    country2: state.globalData.country2,
    error: state.globalData.error.countryComparison,
    isLoading: state.globalData.isLoading.countryComparison,
  }));

  // Reset error dan data negara saat input berubah
  useEffect(() => {
    dispatch(resetError());
    dispatch(resetCountries());
  }, [countryInput1, countryInput2, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!countryInput1 || !countryInput2) return;

    // Fetch data negara secara paralel
    await Promise.all([
      dispatch(fetchCountryData(countryInput1)),
      dispatch(fetchCountryData(countryInput2)),
    ]);

    // Navigasi ke halaman perbandingan jika kedua negara berhasil diambil
    if (country1 && country2) {
      navigate("/comparison", {
        state: {
          country1: country1.name,
          country2: country2.name,
        },
      });
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Compare Countries</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="country1" className="form-label">
            Country 1
          </label>
          <input
            type="text"
            className="form-control"
            id="country1"
            placeholder="Enter first country"
            value={countryInput1}
            onChange={(e) => setCountryInput1(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="country2" className="form-label">
            Country 2
          </label>
          <input
            type="text"
            className="form-control"
            id="country2"
            placeholder="Enter second country"
            value={countryInput2}
            onChange={(e) => setCountryInput2(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Compare"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CountryComparisonForm;
