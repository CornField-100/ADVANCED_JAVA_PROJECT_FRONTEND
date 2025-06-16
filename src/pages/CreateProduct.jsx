import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import AlertComp from "../components/AlertComp";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    Model: "",
    stock: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const fieldConfig = [
    { name: "brand", label: "Brand", type: "text", id: "brandInput" },
    { name: "Model", label: "Model", type: "text", id: "modelInput" },
    { name: "stock", label: "Stock", type: "number", id: "stockInput" },
    { name: "price", label: "Price", type: "number", id: "priceInput" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
        "http://localhost:3001/api/product/addProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            brand: formData.brand,
            Model: formData.Model,
            stock: Number(formData.stock),
            price: Number(formData.price),
          }),
        }
      );

      const serverData = await response.json();

      if (!response.ok) {
        throw new Error(serverData.message || "Product creation failed");
      }

      setSuccess("✅ Product created successfully!");
      setFormData({ brand: "", Model: "", stock: "", price: "" });

      // Delay for visual feedback then redirect
      setTimeout(() => {
        navigate("/", { replace: true });
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="card shadow-sm p-4 w-100"
      style={{ maxWidth: "480px", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center mb-4">Add a New Product</h1>

      {fieldConfig.map(({ name, label, type, id }) => (
        <div className="mb-3" key={name}>
          <LabelComp htmlFor={id} displayText={label} />
          <InputForm
            id={id}
            type={type}
            value={formData[name]}
            onchange={handleChange(name)}
            aria-describedby={`${id}Help`}
            disabled={loading}
          />
        </div>
      ))}

      {error && <AlertComp alertType="alert-danger" text={error} />}
      {success && <AlertComp alertType="alert-success" text={success} />}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Add Product"}
      </button>
    </form>
  );
};

export default CreateProduct;
