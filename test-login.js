// Test script to check what the backend returns
const testLogin = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "testpassword",
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Success response:", data);
    console.log("Response type:", typeof data);
    console.log("Is string?", typeof data === "string");
    console.log("Is object?", typeof data === "object");

    if (typeof data === "object") {
      console.log("Object keys:", Object.keys(data));
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Run the test (you can run this in browser console)
testLogin();
