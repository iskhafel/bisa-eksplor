import { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Label,
  TextInput,
  Radio,
  FileInput,
} from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "user",
    phoneNumber: "",
  });
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (formData.password !== formData.passwordRepeat) {
      setError("Passwords do not match");
      return;
    }

    try {
      let profilePictureUrl = "";

      if (file) {
        profilePictureUrl = await uploadImage(file); // Get the image URL
      }

      await registerUser(profilePictureUrl);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const uploadImage = async (file) => {
    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmd0ZXN0dXNlckB5b3BtYWlsLmNvbSIsInVzZXJJZCI6ImMyNDdiMjk2LTUyZTEtNDczMC1iYjdiLTUxOGJiMmUwYjJiOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI5OTk5MDU0fQ.cKaLrj5BXkA_7I4HPYt3kZZkk-SrpuynEmBfYUVlJ-U";

    const config = {
      headers: {
        apiKey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    };

    const data = new FormData();
    data.append("image", file);

    try {
      const response = await axios.post(api, data, config);
      return response.data.url; // Get URL from the upload response
    } catch (err) {
      console.error("Error uploading image:", err);
      throw new Error("Failed to upload profile picture. Please try again.");
    }
  };

  const registerUser = async (profilePictureUrl = "") => {
    const apiUrl =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

    const data = {
      ...formData,
      profilePictureUrl, // Include the image URL in the registration data
    };

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          apiKey: apiKey,
        },
      });
      console.log(response.data); // Log response with user details
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Error registering user:", error?.response);
      setError(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 pt-4">
      <Card className="max-w-sm w-full mx-auto">
        <h1 className="text-3xl font-bold mx-auto">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            {success && (
              <div className="text-green-500">
                You have successfully registered.
              </div>
            )}
            {error && <div className="text-red-500">{error}</div>}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
            </div>
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="passwordRepeat" value="Repeat Password" />
            </div>
            <TextInput
              id="passwordRepeat"
              type="password"
              value={formData.passwordRepeat}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="profilePicture" value="Profile Picture" />
            </div>
            <FileInput id="profilePicture" onChange={handleFileChange} />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="phoneNumber" value="Phone Number" />
            </div>
            <TextInput
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label value="Role" />
            </div>
            <div className="flex gap-4">
              <Radio
                id="role"
                name="role1"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
              />
              <Label htmlFor="user">User</Label>
              <Radio
                id="role"
                name="role2"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
              />
              <Label htmlFor="admin">Admin</Label>
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
    </div>
  );
}
