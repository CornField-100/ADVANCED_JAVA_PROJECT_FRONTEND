import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import { useState } from "react";
import { checkEmail } from "../utils/checkFormErrors";
import AlertComp from "../components/AlertComp";
import { useNavigate } from "react-router-dom";

const LogInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (changedValue) => {
    setEmail(changedValue);
  };

  const handlePasswordChange = (changedPassword) => {
    setPassword(changedPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!checkEmail.checkEmpty(email)) throw Error("Email is empty");
      if (!checkEmail.checkFormat(email)) throw Error("Wrong email format");

      setError(null);

      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        throw Error("Invalid credentials, please check");
      }

      const token = await response.json();
      localStorage.setItem("token", token);

      console.log("Login successful");

      navigate("/"); // ✅ Redirect to Home page after login success
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
      <h1 className="text-center">Log In</h1>

      <div className="mb-3">
        <LabelComp htmlFor="emailInput" displayText="Email" />
        <InputForm
          onchange={handleEmailChange}
          value={email}
          type="email"
          id="emailInput"
          ariaDescribe="emailHelp"
        />
      </div>

      <div className="mb-3">
        <LabelComp htmlFor="passwordInput" displayText="Password" />
        <InputForm
          onchange={handlePasswordChange}
          value={password}
          type="password"
          id="passwordInput"
          ariaDescribe="passwordHelp"
        />
      </div>

      {error && <AlertComp alertType="alert-danger" text={error} />}

      <div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </div>
    </form>
  );
};

export default LogInPage;
