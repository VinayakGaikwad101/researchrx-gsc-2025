import React, { useState } from "react";
import { Search, Loader, X } from "lucide-react";
import DrugSearch from "./DrugSearch";
import MoleculeViewer from "./MoleculeViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ResearchPapers = () => {
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
      setResults(data.docs || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("Error fetching results");
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Research Papers</h2>
      <div className="flex items-center gap-2 mb-6">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search Query"
          className="flex-grow"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchQuery("")}
          className="text-gray-500"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {paginatedResults && paginatedResults.length > 0 ? (
          paginatedResults.map((result, index) => (
            <Card
              key={index}
              className="p-4 hover:bg-gray-50 transition-colors"
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
            </Card>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
      {results.length > pageSize && (
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant={currentPage === 1 ? "secondary" : "default"}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant={currentPage === totalPages ? "secondary" : "default"}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
};

const Research = () => {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="drugs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drugs">Drug Database</TabsTrigger>
          <TabsTrigger value="papers">Research Papers</TabsTrigger>
          <TabsTrigger value="molecule">Molecule Viewer</TabsTrigger>
        </TabsList>
        <TabsContent value="drugs">
          <DrugSearch />
        </TabsContent>
        <TabsContent value="papers">
          <ResearchPapers />
        </TabsContent>
        <TabsContent value="molecule">
          <MoleculeViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Research;
