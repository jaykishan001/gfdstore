"use client";
import { ProductCard } from "@/components/ProductCard";
import axios from "axios";
import { use, useEffect, useState } from "react";

const Page = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const query = params.query || ""; // Ensure query is defined

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return; // If no query, don't fetch

    console.log("params updated:", query);

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

    fetchSuggestions();
  }, [query]);

  return (
    <div className="mt-32">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {suggestions?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {suggestions.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      ) : (
        !loading && <p>No Products found</p>
      )}
    </div>
  );
};

export default Page;
