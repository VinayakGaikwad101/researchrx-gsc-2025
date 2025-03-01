import React, { useState } from "react";
import { Search, Loader, X } from "lucide-react"; // Importing icons from Lucide React

const Research = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchResults = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${query}`
      );
      const data = await response.json();
      console.log("Fetched Data:", data); // Console log the fetched data
      setResults(data.docs || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Error fetching results");
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchResults(searchQuery);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(results.length / pageSize);
  const paginatedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Research Results
      </h1>
      <div className="flex items-center mb-6 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search Query"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="ml-2 text-gray-500 focus:outline-none"
        >
          <X className="clear-icon" />
        </button>
        {isLoading && <Loader className="ml-2 animate-spin text-gray-500" />}
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
        >
          <Search className="mr-2" /> Search
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {paginatedResults && paginatedResults.length > 0 ? (
          paginatedResults.map((result, index) => (
            <li
              key={index}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-blue-500">
                {result.title}
              </h3>
              <p className="text-gray-700">
                {result.author_name
                  ? result.author_name.join(", ")
                  : "Unknown Author"}
              </p>
              <p className="text-gray-600">{result.first_publish_year}</p>
              <a
                href={`https://openlibrary.org${result.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </li>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </ul>
      {results.length > pageSize && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition duration-300"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition duration-300"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Research;
