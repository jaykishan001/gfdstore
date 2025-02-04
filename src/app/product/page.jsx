"use client";
import Container from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import { FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filter, setFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product", {
          params: {
            page: currentPage,
            limit,
            // categories: selectedCategories.join(","),
            // minPrice: priceRange[0],
            // maxPrice: priceRange[1],
            // sizes: selectedSizes.join(","),
          },
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err); // Debugging log
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategories, priceRange, selectedSizes]);

  useEffect(() => {
    console.log("Products State:", products); // Debugging log
  }, [products]);

  useEffect(() => {
    console.log("Filter Parameters:", {
      params: {
        page: currentPage,
        limit,
        categories: selectedCategories.join(","),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sizes: selectedSizes.join(","),
      },
    }); // Debugging log
  }, [currentPage, selectedCategories, priceRange, selectedSizes]);

  if (loading) return <p className="text-center mt-12">Loading products...</p>;
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;

  const handleFilter = () => {
    setFilter(!filter);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const categories = ["Electronics", "Clothing", "Home", "Books", "Toys"];
  const sizes = ["S", "M", "L", "XL"];

  return (
    <Container className="px-4 mt-12">
      <main className="mx-auto py-8 max-w-[1400px]">
        <h1 className="text-3xl font-semibold mb-8 text-center">
          Our Products
        </h1>

        <div className="mb-4">
          <Button
            onClick={handleFilter}
            className="rounded-md"
            variant="outline"
          >
            <FilterIcon className="mr-2" /> Filter
          </Button>
        </div>

        {filter && (
          <div className="w-full bg-gray-200 p-6 rounded-lg shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-lg">Category</h3>
                <div className="flex flex-wrap gap-4">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategories.includes(category)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleCategoryChange(category)}
                      className="rounded-full py-2 px-4 text-sm font-medium transition duration-200 ease-in-out hover:bg-blue-600 hover:text-white"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-lg">Price Range</h3>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceChange}
                  className="bg-blue-500 rounded-full"
                />
                <div className="mt-2 text-sm text-gray-700">
                  ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-lg">Size</h3>
                <div className="flex flex-wrap gap-4">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={
                        selectedSizes.includes(size) ? "default" : "outline"
                      }
                      onClick={() => handleSizeChange(size)}
                      className="rounded-full py-2 px-4 text-sm font-medium transition duration-200 ease-in-out hover:bg-green-600 hover:text-white"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Next
          </button>
        </div>
      </main>
    </Container>
  );
};

export default ProductPage;
