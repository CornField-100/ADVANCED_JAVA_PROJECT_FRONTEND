import { useState } from "react";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import AlertComp from "../components/AlertComp"; // For error display
import { BASE_URL } from "../utils/api";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    imageUrl: "", // corrected to match your fieldConfig key
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // NEW: track success

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const fieldConfig = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      id: "firstNameInput",
    },
    { name: "lastName", label: "Last Name", type: "text", id: "lastNameInput" },
    { name: "email", label: "Email", type: "email", id: "emailInput" },
    { name: "password", label: "Password", type: "password", id: "pwdInput" },
    { name: "role", label: "Role", type: "text", id: "roleInput" },
    { name: "imageUrl", label: "Avatar", type: "text", id: "imageInput" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const serverData = await response.json();

      if (!response.ok) {
        throw Error(serverData.message || "Signup failed");
      }

      console.log("Signup successful:", serverData);
      setSuccess(true); // Show success message
      setFormData({
        // Reset form if you want
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <form
      className="card shadow-sm p-4 w-100"
      style={{ maxWidth: "480px", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Sign Up</h1>

      {fieldConfig.map(({ name, label, type, id }) => (
        <div className="mb-3" key={name}>
          <LabelComp htmlFor={id} displayText={label} />
          <InputForm
            id={id}
            type={type}
            value={formData[name]}
            onchange={handleChange(name)}
            ariaDescribe={`${id}Help`}
          />
        </div>
      ))}

      {error && <AlertComp alertType="alert-danger" text={error} />}

      {/* Success message */}
      {success && (
        <div className="alert alert-success" role="alert">
          Signup successful! You can now log in.
        </div>
      )}

      <div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpPage;
