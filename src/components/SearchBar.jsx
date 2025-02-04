"use client";
import axios from "axios";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Query updated:", query);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching data for:", query);

        const { data } = await axios.get(`/api/search`, {
          params: { query },
        });

        console.log("API Response:", data);

        if (data.success) {
          console.log("Setting suggestions:", data.data);
          setSuggestions(data.data);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  console.log("Suggestions:", suggestions);
  const router = useRouter();

  return (
    <div className="relative w-96">
      <div className="flex items-center border p-2 rounded-lg bg-white shadow-md">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button
          onClick={() => {
            if (query.trim() === "") {
              return;
            }

            router.push(`/search/${query}`);
            setQuery("");
          }}
        >
          Search
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Suggestions Container */}

      <div className="relative">
        {suggestions?.length > 0 && (
          <ul className=" left-0 w-full bg-white border border-gray-200 shadow-lg mt-1 rounded-md max-h-48 overflow-auto z-50">
            {suggestions.map((product) => (
              <li
                key={product._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery(product.name)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
