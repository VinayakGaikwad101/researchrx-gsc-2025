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
    // Add logic to fetch results from another endpoint or perform some action
    set({
      results: [],
      totalResults: 0,
      currentPage: page,
      query: query,
      maxResults: maxResults,
      patents: patents,
      citations: citations,
      isLoading: false,
    });
  },
  fetchSuggestions: async (query) => {
    set({ isLoading: true });
    try {
      const url = `https://keyword-expander.p.rapidapi.com/suggest?query=${query}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_x_rapidapi_key,
          "x-rapidapi-host": "keyword-expander.p.rapidapi.com",
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
