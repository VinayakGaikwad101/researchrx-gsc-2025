import { create } from "zustand";

export const useGoogleScholarStore = create((set) => ({
  results: [],
  totalResults: 0,
  currentPage: 1,
  pageSize: 10,
  query: "",
  maxResults: 10,
  patents: true,
  citations: true,
  suggestions: [],
  isLoading: false,
  fetchResults: async (
    query,
    page = 1,
    maxResults = 10,
    patents = true,
    citations = true
  ) => {
    const startIndex = (page - 1) * maxResults;
    const sortBy = "relevance";
    const includeLastYear = "abstracts"; // Hardcoded to "abstracts"
    set({ isLoading: true });
    try {
      const url = `https://google-scholar1.p.rapidapi.com/search_pubs?query=${query}&max_results=${maxResults}&patents=${patents}&citations=${citations}&sort_by=${sortBy}&include_last_year=${includeLastYear}&start_index=${startIndex}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_x_rapidapi_key,
          "X-RapidAPI-Host": import.meta.env.VITE_x_rapidapi_host,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Fetched Data:", data); // Console log the fetched data
      set({
        results: data.results || [],
        totalResults: data.totalResults || 0,
        currentPage: page,
        query: query,
        maxResults: maxResults,
        patents: patents,
        citations: citations,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching results:", error);
      set({ isLoading: false });
    }
  },
  fetchSuggestions: async (query) => {
    set({ isLoading: true });
    try {
      const url = `https://keyword-expander.p.rapidapi.com/suggest?query=${query}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": import.meta.env.VITE_x_rapidapi_key,
          "X-RapidAPI-Host": "keyword-expander.p.rapidapi.com",
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Fetched Suggestions:", data); // Console log the fetched suggestions
      set({
        suggestions: data.suggestions || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      set({ isLoading: false });
    }
  },
}));
