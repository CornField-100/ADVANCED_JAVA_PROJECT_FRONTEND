import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchProductPage = () => {
  const [queryParams] = useSearchParams();
  const query = queryParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const search = async () => {
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/product/search?query=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (query.trim()) {
      search();
    } else {
      setResults([]); // Clear results if query is empty
    }
  }, [query]);

  return (
    <div className="container mt-5">
      <h3>Search results for: "{query}"</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {results.length === 0 && !error && <p>No products found.</p>}
        {results.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}>
            <div className="card p-3">
              <h5>
                {product.brand} - {product.model}
              </h5>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProductPage;
