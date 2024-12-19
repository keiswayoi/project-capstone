import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper untuk memproses response API
const processResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Action async untuk fetch artikel
export const fetchArticles = createAsyncThunk(
  "globalData/fetchArticles",
  async (_, { rejectWithValue }) => {
    const apiKey = "y2werQlGhUGtDFGzENJKGU7ESP6FKM9G";
    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=peace&api-key=${apiKey}`
      );
      const data = await processResponse(response);

      return data.response.docs
        .filter(
          (article) => article.multimedia && article.multimedia.length > 0
        )
        .slice(0, 6)
        .map((article) => ({
          title: article.headline?.main || "No Title",
          description: article.abstract || "No description available.",
          url: article.web_url,
          imageUrl: article.multimedia[0]?.url
            ? `https://www.nytimes.com/${article.multimedia[0]?.url}`
            : null,
        }));
    } catch (error) {
      console.error("Error fetching articles:", error);
      return rejectWithValue(error.message || "Failed to fetch articles.");
    }
  }
);

// Action async untuk fetch countries
export const fetchCountries = createAsyncThunk(
  "globalData/fetchCountries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await processResponse(response);

      return data.map((country) => ({
        name: country.name.common,
        capital: country.capital?.[0] || "No capital",
        population: country.population,
        region: country.region,
        flag: country.flags?.png || null,
      }));
    } catch (error) {
      console.error("Error fetching countries:", error);
      return rejectWithValue(error.message || "Failed to fetch countries.");
    }
  }
);

// Action async untuk fetch specific country data
export const fetchCountryData = createAsyncThunk(
  "globalData/fetchCountryData",
  async (countryName, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      const data = await processResponse(response);

      return { inputFor: countryName, data: data[0] };
    } catch (error) {
      console.error(`Error fetching data for ${countryName}:`, error);
      return rejectWithValue(error.message);
    }
  }
);

// Action async untuk fetch news
export const fetchNews = createAsyncThunk(
  "globalData/fetchNews",
  async (_, { rejectWithValue }) => {
    const apiKey = "y2werQlGhUGtDFGzENJKGU7ESP6FKM9G"; // Ganti dengan API key Anda
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
      );
      const data = await processResponse(response);

      return data.articles.slice(0, 10).map((article) => ({
        title: article.title || "No Title",
        description: article.description || "No description available.",
        url: article.url,
        imageUrl: article.urlToImage || null,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      return rejectWithValue(error.message || "Failed to fetch news.");
    }
  }
);

// Slice untuk globalData
const globalDataSlice = createSlice({
  name: "globalData",
  initialState: {
    articles: [],
    countries: [],
    news: [],
    country1: null,
    country2: null,
    isLoading: {
      articles: false,
      countries: false,
      news: false,
      countryComparison: false,
    },
    error: {
      articles: null,
      countries: null,
      news: null,
      countryComparison: null,
    },
  },
  reducers: {
    resetError: (state) => {
      state.error.countryComparison = null;
    },
    resetCountries: (state) => {
      state.country1 = null;
      state.country2 = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state, key) => {
      state.isLoading[key] = true;
      state.error[key] = null;
    };

    const handleFulfilled = (state, key, payloadKey) => {
      state.isLoading[key] = false;
      state[key] = payloadKey;
      state.error[key] = null;
    };

    const handleRejected = (state, key, action) => {
      state.isLoading[key] = false;
      state[key] = [];
      state.error[key] = action.payload;
    };

    builder
      .addCase(fetchArticles.pending, (state) =>
        handlePending(state, "articles")
      )
      .addCase(fetchArticles.fulfilled, (state, action) =>
        handleFulfilled(state, "articles", action.payload)
      )
      .addCase(fetchArticles.rejected, (state, action) =>
        handleRejected(state, "articles", action)
      )

      .addCase(fetchCountries.pending, (state) =>
        handlePending(state, "countries")
      )
      .addCase(fetchCountries.fulfilled, (state, action) =>
        handleFulfilled(state, "countries", action.payload)
      )
      .addCase(fetchCountries.rejected, (state, action) =>
        handleRejected(state, "countries", action)
      )

      .addCase(fetchCountryData.pending, (state) =>
        handlePending(state, "countryComparison")
      )
      .addCase(fetchCountryData.fulfilled, (state, action) => {
        state.isLoading.countryComparison = false;
        if (!state.country1) {
          state.country1 = action.payload.data;
        } else if (!state.country2) {
          state.country2 = action.payload.data;
        }
      })
      .addCase(fetchCountryData.rejected, (state, action) =>
        handleRejected(state, "countryComparison", action)
      )

      .addCase(fetchNews.pending, (state) => handlePending(state, "news"))
      .addCase(fetchNews.fulfilled, (state, action) =>
        handleFulfilled(state, "news", action.payload)
      )
      .addCase(fetchNews.rejected, (state, action) =>
        handleRejected(state, "news", action)
      );
  },
});

export const { resetError, resetCountries } = globalDataSlice.actions;
export default globalDataSlice.reducer;
