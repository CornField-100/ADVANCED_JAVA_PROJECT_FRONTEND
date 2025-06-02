import { useState } from "react";

const SearchProductPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `https://advanced-java-project.onrender.com/api/product/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-2">Search</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {results.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}>
            <div className="card p-3">
              <h5>{product.brand} - {product.Model}</h5>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              {/* Add "Add to Basket" button here later */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProductPage;
