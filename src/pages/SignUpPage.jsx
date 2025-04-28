import { useState } from "react";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import AlertComp from "../components/AlertComp"; // Assuming you want error display like login page

const SignUpPage = () => {
  // State variables
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    image: "", // This will be the image file name or a URL depending on your backend
  });
  const [error, setError] = useState("");

  // General input handler
  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Field configurations
  const fieldConfig = [
    { name: "firstName", label: "First Name", type: "text", id: "firstNameInput" },
    { name: "lastName", label: "Last Name", type: "text", id: "lastNameInput" },
    { name: "email", label: "Email", type: "email", id: "emailInput" },
    { name: "password", label: "Password", type: "password", id: "pwdInput" },
    { name: "role", label: "Role", type: "text", id: "roleInput" },
    { name: "imageUrl", label: "Avatar", type: "text", id: "imageInput" }, // If you want file upload, it needs special handling
  ];

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError(null);

      const response = await fetch("http://localhost:3001/api/users/signup", {
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
      // You can redirect to login page or homepage after successful signup
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

      <div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpPage;
