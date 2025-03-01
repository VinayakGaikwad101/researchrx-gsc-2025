import React, { useState, useEffect } from "react";
import { useGoogleScholarStore } from "../store/useGoogleScholarStore";
import { Search, Loader, X } from "lucide-react"; // Importing icons from Lucide React

const Research = () => {
  const {
    results,
    totalResults,
    currentPage,
    pageSize,
    fetchResults,
    fetchSuggestions,
    query,
    maxResults,
    patents,
    citations,
    suggestions,
    isLoading,
  } = useGoogleScholarStore();

  const [searchQuery, setSearchQuery] = useState(query);
  const [searchMaxResults, setSearchMaxResults] = useState(maxResults);
  const [searchPatents, setSearchPatents] = useState(patents);
  const [searchCitations, setSearchCitations] = useState(citations);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    }
  }, [searchQuery]);

  const handlePageChange = async (newPage) => {
    try {
      await fetchResults(
        searchQuery,
        newPage,
        searchMaxResults,
        searchPatents,
        searchCitations
      );
      setError(null); // Reset error state on successful fetch
    } catch (err) {
      setError("An error occurred while fetching results.");
    }
  };

  const handleSearch = () => {
    fetchResults(
      searchQuery,
      1,
      searchMaxResults,
      searchPatents,
      searchCitations
    );
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    fetchSuggestions(e.target.value);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      position: "relative",
    },
    searchInput: {
      flexGrow: 1,
      padding: "8px",
      marginRight: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    clearButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    loadingIcon: {
      marginLeft: "8px",
      animation: "spin 1s linear infinite",
    },
    searchButton: {
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      backgroundColor: "#007bff",
      border: "none",
      color: "white",
      borderRadius: "4px",
      cursor: "pointer",
    },
    suggestionsList: {
      position: "absolute",
      top: "40px",
      left: 0,
      right: 0,
      zIndex: 1,
      marginTop: "8px",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "white",
      listStyleType: "none",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    suggestionItem: {
      padding: "8px",
      cursor: "pointer",
    },
    resultsList: {
      listStyleType: "none",
      padding: 0,
    },
    resultItem: {
      marginBottom: "20px",
    },
    pagination: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <h1>Research Results</h1>
      <div style={styles.searchBar}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search Query"
          style={styles.searchInput}
        />
        <button onClick={() => setSearchQuery("")} style={styles.clearButton}>
          <X className="clear-icon" />
        </button>
        {isLoading && <Loader style={styles.loadingIcon} />}
        <button onClick={handleSearch} style={styles.searchButton}>
          <Search className="button-icon" /> Search
        </button>
        {showSuggestions && suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
                style={styles.suggestionItem}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p>{error}</p>}
      <ul style={styles.resultsList}>
        {results && results.length > 0 ? (
          results.map((result, index) => (
            <li key={index} style={styles.resultItem}>
              <h3>{result.title}</h3>
              <p>{result.abstract}</p>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </li>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </ul>
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * pageSize >= totalResults}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Research;
