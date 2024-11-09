import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Label,
  TextInput,
  Radio,
  FileInput,
  Toast,
} from "flowbite-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "user", // Default role
    phoneNumber: "",
  });
  const [file, setFile] = useState(null);

  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // Controls toast visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleRoleChange = (e) =>
    setFormData({ ...formData, role: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match");
      return;
    }

    // Upload image if file is selected, then register user with the profile picture URL
    if (file) {
      uploadImage(file)
        .then((uploadResponse) => {
          const profilePictureUrl = uploadResponse.data.url;
          return registerUser(profilePictureUrl);
        })
        .then(() => {
          setShowToast(true); // Show success toast
          setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch((err) => {
          console.error("Registration error:", err);
          setError("An error occurred during registration. Please try again.");
        });
    } else {
      // Register user without profile picture URL
      registerUser()
        .then(() => {
          setShowToast(true); // Show success toast
          setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
          setTimeout(() => navigate("/login"), 1000);
        })
        .catch((err) => {
          console.error("Registration error:", err);
          setError("An error occurred during registration. Please try again.");
        });
    }
  };

  const uploadImage = (file) => {
    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = localStorage.getItem("JWT_TOKEN");
    const data = new FormData();
    data.append("image", file);

    return axios.post(api, data, {
      headers: { apiKey: apiKey, Authorization: `Bearer ${token}` },
    });
  };

  const registerUser = (profilePictureUrl = "") => {
    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

    return axios.post(
      api,
      { ...formData, profilePictureUrl },
      {
        headers: { apiKey: apiKey },
      }
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-slate-800 pt-4"
      style={{
        backgroundImage: `url("/rich-martello-jZ5tuGIWzRo-unsplash.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold mx-auto">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <div className="text-red-500">{error}</div>}

          <div>
            <Label htmlFor="name" value="Name" className="mb-2 block" />
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" className="mb-2 block" />
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" value="Password" className="mb-2 block" />
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label
              htmlFor="passwordRepeat"
              value="Repeat Password"
              className="mb-2 block"
            />
            <TextInput
              id="passwordRepeat"
              type="password"
              value={formData.passwordRepeat}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label
              htmlFor="profilePicture"
              value="Profile Picture"
              className="mb-2 block"
            />
            <FileInput id="profilePicture" onChange={handleFileChange} />
          </div>

          <div>
            <Label
              htmlFor="phoneNumber"
              value="Phone Number"
              className="mb-2 block"
            />
            <TextInput
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label value="Role" className="mb-2 block" />
            <div className="flex gap-4">
              <Radio
                id="role"
                name="role1"
                value="user"
                checked={formData.role === "user"}
                onChange={handleRoleChange}
              />
              <Label htmlFor="userRole">User</Label>
              <Radio
                id="role"
                name="role2"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleRoleChange}
              />
              <Label htmlFor="adminRole">Admin</Label>
            </div>
          </div>

          <Label className="flex mx-auto gap-1">
            Already have an account?
            <Link className="text-blue-500" to="/login">
              Login
            </Link>
          </Label>

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
            <div className="ml-3 text-sm font-normal">
              Registration successful!
            </div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
    </div>
  );
}
