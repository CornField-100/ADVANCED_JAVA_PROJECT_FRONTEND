import { useEffect, useState } from "react"
import { fetchProducts } from "../utils/fetchProduts"
import CardComponent from "../components/CardComponent"

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
    <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"> 
        {products.map((product) => (
          <CardComponent 
          key={product._id}
          title={product.Model}
          brand={product.brand}
          price={product.price}
          stock={product.stock}
          imageUrl={product.imageUrl} />
        ))}
    </section>
  )
}

export default HomePage
