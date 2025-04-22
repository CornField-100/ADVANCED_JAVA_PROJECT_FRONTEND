import { useEffect, useState } from "react"
import { fetchProducts } from "../utils/fetchProduts"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts()
        console.log("Fetched data:", data)
        setProducts(data)
      } catch (err) {
        console.error("Error loading products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!products.length) return <p>No products found</p>

  return (
    <ul>
      {products.map((product) => (
        <li key={product._id}>
          {product.brand} - {product.Model}
        </li>
      ))}
    </ul>
  )
}

export default HomePage
