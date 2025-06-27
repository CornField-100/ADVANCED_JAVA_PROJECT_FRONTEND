import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import AlertComp from "../components/AlertComp";
import { BASE_URL } from "../utils/api";
import { getCurrentUser, isAdmin } from "../utils/auth";

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

  // Debug current user state
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();

  console.log("CreateProduct - Current User:", currentUser);
  console.log("CreateProduct - Is Admin:", userIsAdmin);

  // Enhanced auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    const isUserAdmin = isAdmin();

    console.log("CreateProduct Auth Check:", {
      hasToken: !!token,
      user,
      isUserAdmin,
    });

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    if (!user) {
      console.log("Invalid token, redirecting to login");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (!isUserAdmin) {
      console.log("User is not admin, redirecting to home");
      navigate("/");
      return;
    }

    console.log("Auth check passed - user can create products");
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

      const response = await fetch(`${BASE_URL}/api/product/addProduct`, {
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
      });

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
