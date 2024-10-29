import { useState } from "react";
import axios from "axios";
import { Button, TextInput, Label, Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    axios
      .post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login",
        {
          email,
          password,
        },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        console.log("Login successful:", response.data);
        localStorage.setItem("JWT_TOKEN", response.data.token);
        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("An error occurred while logging in. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
      <Card className="max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold mx-auto">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            {success && (
              <div className="text-green-500">
                You have successfully logged in
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="text"
              value={email}
              onChange={handleEmail}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={handlePassword}
              required
            />
          </div>
          <Label className="flex mx-auto gap-1">
            Don&apos;t have an account?
            <Link className="text-blue-500" to="/register">
              Register
            </Link>
          </Label>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
