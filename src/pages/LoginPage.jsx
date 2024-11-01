import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card, Label, TextInput, Toast } from "flowbite-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // Controls toast visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    axios
      .post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
        { email, password },
        { headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" } }
      )
      .then((response) => {
        // Store JWT token in localStorage and set success state
        localStorage.setItem("JWT_TOKEN", response.data.token);
        setShowToast(true); // Show success toast
        setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds

        setTimeout(() => {
          if (response.data.data.role === "user") navigate("/");
          else navigate("/dashboard/user");
        }, 3000);
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("An error occurred while logging in. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <Card className="max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Success and Error Messages */}
          <div>{error && <div className="text-red-500">{error}</div>}</div>

          {/* Email Input */}
          <div>
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Link to Register Page */}
          <Label className="flex justify-center gap-1">
            Don&apos;t have an account?
            <Link className="text-blue-500" to="/register">
              Register
            </Link>
          </Label>

          {/* Submit Button */}
          <Button type="submit">Submit</Button>
        </form>
      </Card>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.707-4.707a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 text-sm font-normal">Login successful!</div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
