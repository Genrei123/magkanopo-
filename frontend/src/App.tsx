import { useState, type KeyboardEvent } from 'react';
import { Search, Pill, PackageX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from './api/axiosInstance';
import * as XLSX from 'xlsx'

// Define TypeScript interfaces for the data structure
interface Product {
  title: string;
  price: string;
  link: string;
}

interface SearchResults {
  [source: string]: Product[];
}

function App() {
  // State for the search query input
  const [searchQuery, setSearchQuery] = useState<string>('');
  // State to manage the loading state during the search
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store the search results
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  // State to track the active tab
  const [activeTab, setActiveTab] = useState<string>('all');
  // State to track if search has been performed
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const exportToExcel = (data: SearchResults) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Iterate over each source in the data
    Object.keys(data).forEach((source) => {
      // Map the products to the desired format
      const products = data[source].map((product) => ({
        Source: source,
        Title: product.title,
        Price: product.price,
        Link: product.link
      }));
      
      // Create a worksheet for this source
      const sourceSheet = XLSX.utils.json_to_sheet(products);
      
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, sourceSheet, source);
    });

    // Save the workbook to a file
    XLSX.writeFile(workbook, 'search_results.xlsx');
  };

  const handleSearch = async () => {
    try {
      const payload = searchQuery.trim();
      if (!payload) {
        return;
      }

      setIsLoading(true);
      setSearchResults(null);
      setHasSearched(true);

      await axiosInstance.get(`/scrape/all?SEARCH_TERM=${encodeURIComponent(payload)}`)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            console.log(data);
            setSearchResults(data.data as SearchResults);
            // Set the active tab to the first source that has results
            const sourcesWithResults = Object.keys(data.data).filter(source => 
              data.data[source] && data.data[source].length > 0
            );
            if (sourcesWithResults.length > 0) {
              setActiveTab(sourcesWithResults[0]);
            } else {
              setActiveTab('all');
            }
          } else {
            console.error("Error fetching search results:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Loading Spinner Component (inline)
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-teal-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-teal-200 animate-pulse"></div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-teal-700">Searching pharmacies...</h3>
        <p className="text-sm text-slate-500 mt-1">This may take a moment</p>
      </div>
    </div>
  );

  // Empty State Component (inline)
  const EmptyState = ({ sourceName }: { sourceName: string }) => (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
      <PackageX className="h-10 w-10 text-slate-400 mb-3" />
      <h3 className="text-lg font-medium text-slate-700">No results found</h3>
      <p className="text-sm text-slate-500 text-center mt-1">We couldn't find this medicine at {sourceName}</p>
    </div>
  );

  // Product Card Component (inline)
  const ProductCard = ({ product, source, index, link }: { product: Product; source: string; index: number, link?: string }) => (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 py-3 px-4">
          <div className="flex items-center text-white">
            <Pill className="h-4 w-4 mr-2" />
            <h3 className="font-medium text-sm truncate">{source}</h3>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-slate-800">{product.title}</h3>
          <div className="flex items-center text-teal-700 font-bold text-xl">
            <span>{product.price.replace("PHP", "")}</span>
          </div>
          <a href={product.link}>Go to medicine..</a>
        </div>
      </CardContent>
    </Card>
  );

  // Function to render all results in a combined view
  const renderAllResults = () => {
    if (!searchResults) return null;
    
    return Object.keys(searchResults).map(source => (
      <div key={source} className="mb-10 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-teal-700 flex items-center">
          <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
          {source}
        </h2>
        {searchResults[source] && searchResults[source].length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults[source].map((product, index) => (
              <ProductCard key={index} product={product} source={source} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState sourceName={source} />
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-3">Magkano Po?</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Compare medicine prices across multiple pharmacies to find the best deal for your prescriptions
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-10 shadow-md border-teal-100">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Textarea
                  placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] pr-10 resize-none border-teal-200 focus-visible:ring-teal-500"
                />
                <div className="absolute right-3 top-3 text-teal-300">
                  <Search size={20} />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white h-auto py-3"
              >
                {isLoading ? "Searching..." : "Search Pharmacies"}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Press Enter to search or use the button</p>
          </CardContent>
        </Card>

        {/* Loading Animation */}
        {isLoading && <LoadingSpinner />}

        {/* Empty state when no search has been performed */}
        {!isLoading && !hasSearched && (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-teal-100 mb-4">
              <Search className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">Ready to search</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter a medicine name above to compare prices across multiple pharmacies
            </p>
          </div>
        )}

        {/* No results found */}
        {!isLoading && hasSearched && (!searchResults || Object.keys(searchResults).length === 0) && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Search className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-700 mb-2">No results found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any results for "{searchQuery}". Please try a different search term.
            </p>
          </div>
        )}

        {/* Search Results Display */}
        {!isLoading && searchResults && Object.keys(searchResults).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
            <div className = "flex flex-col items-center mb-4">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Search Results</h2>
              <Button
                variant="outline"
                className="bg-teal-600 hover:bg-teal-700 text-white h-auto py-3"
                onClick={() => exportToExcel(searchResults)}
              >
                Download Results
              </Button>
              
            </div>

            {/* Tabs for sources */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-6 bg-slate-100 p-1 overflow-x-auto flex w-full justify-start space-x-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm"
                >
                  All Sources
                </TabsTrigger>
                {Object.keys(searchResults).map((source) => (
                  <TabsTrigger
                    key={source}
                    value={source}
                    className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm whitespace-nowrap"
                  >
                    {source}
                    <span className="ml-1 text-xs bg-slate-200 px-1.5 py-0.5 rounded-full">
                      {searchResults[source] ? searchResults[source].length : 0}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {renderAllResults()}
              </TabsContent>

              {Object.keys(searchResults).map((source) => (
                <TabsContent key={source} value={source} className="mt-0 animate-fadeIn">
                  <h2 className="text-xl font-semibold mb-4 text-teal-700 flex items-center">
                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    {source}
                  </h2>
                  {searchResults[source] && searchResults[source].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults[source].map((product, index) => (
                        <ProductCard key={index} product={product} source={source} index={index} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState sourceName={source} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default App;
