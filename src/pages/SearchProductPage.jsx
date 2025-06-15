import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

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
      setResults([]);
    }
  }, [query]);

  return (
    <div className="container mt-5">
      <h3>
        Search results for: "<span className="text-primary">{query}</span>"
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {results.length === 0 && !error && (
          <p className="mt-3 text-muted">No products found.</p>
        )}

        {results.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}>
            <Link
              to={`/products/${product._id}`} // ✅ correct route!
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="card p-3 shadow-sm border-0 h-100"
                style={{ cursor: "pointer" }}
              >
                <h5 className="text-capitalize">
                  {product.brand} - {product.Model}
                </h5>
                <p className="mb-1">
                  <strong>Price:</strong> ${product.price}
                </p>
                <p className="mb-0">
                  <strong>Stock:</strong> {product.stock}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProductPage;
