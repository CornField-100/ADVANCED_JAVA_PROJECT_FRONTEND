const uri = "http://localhost:3001/api/product/getAllProduct"

export const fetchProducts = async () => {
    try {
        const response = await fetch(uri)
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        const data = await response.json()
        const products = Array.isArray(data) ? data : data.products || [];
        return products;
    } catch (error) {
        console.error("Error fetching products:", error)
        throw error
    }
}