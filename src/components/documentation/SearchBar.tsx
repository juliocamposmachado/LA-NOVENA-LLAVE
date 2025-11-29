import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { documentationSections } from "@/types/documentation";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results: Array<{ id: string; title: string }> = [];
    const lowerQuery = query.toLowerCase();

    documentationSections.forEach((section) => {
      if (section.title.toLowerCase().includes(lowerQuery)) {
        results.push({ id: section.id, title: section.title });
      }
      
      section.subsections?.forEach((subsection) => {
        if (subsection.title.toLowerCase().includes(lowerQuery)) {
          results.push({ id: subsection.id, title: `${section.title} > ${subsection.title}` });
        }
      });
    });

    setSearchResults(results);
  };

  const handleResultClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar na documentação..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isSearching && searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchResults.map((result, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left px-4 py-2 hover:bg-accent"
              onClick={() => handleResultClick(result.id)}
            >
              {result.title}
            </Button>
          ))}
        </div>
      )}

      {isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center text-muted-foreground">
          Nenhum resultado encontrado
        </div>
      )}
    </div>
  );
}
