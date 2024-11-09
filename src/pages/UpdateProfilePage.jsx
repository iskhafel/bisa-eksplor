/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Modal,
  Label,
  TextInput,
  FileInput,
  Toast,
} from "flowbite-react";
import Header from "../components/Header";
import CustomFooter from "../components/CustomFooter";

export default function UpdateProfilePage() {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [showToast, setShowToast] = useState(false); // Controls toast visibility
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profilePictureUrl: "",
  });
  const [file, setFile] = useState(null); // Stores the selected profile picture file

  const getUserProfile = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      })
      .then((response) => {
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          phoneNumber: response.data.data.phoneNumber,
          profilePictureUrl: response.data.data.profilePictureUrl,
        });
      })
      .catch((error) => console.error("Failed to fetch user profile:", error));
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleToast = () => setShowToast(!showToast);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("JWT_TOKEN");

    const updateData = { ...formData };
    const updateProfile = (profilePictureUrl) => {
      if (profilePictureUrl) {
        updateData.profilePictureUrl = profilePictureUrl;
      }

      axios
        .post(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
          updateData,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setUser(updateData); // Update local user state with new data
          toggleModal(); // Close the modal
          setShowToast(true); // Show the success toast
          setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
        })
        .catch((error) => console.error("Failed to update profile:", error));
    };

    if (file) {
      const uploadData = new FormData();
      uploadData.append("image", file);

      axios
        .post(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
          uploadData,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => updateProfile(response.data.url))
        .catch((error) => console.error("Image upload failed:", error));
    } else {
      updateProfile(); // Update profile without a new profile picture
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
        <Card className="max-w-sm" imgSrc={user.profilePictureUrl} horizontal>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
            Name: {user.name}
          </h5>
          <p className="font-normal text-gray-700 ">Email: {user.email}</p>
          <p className="font-normal text-gray-700 ">
            Phone: {user.phoneNumber}
          </p>
          <Button onClick={toggleModal}>
            Edit Profile
            <svg
              className="-mr-1 ml-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </Button>
        </Card>
      </div>

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
              Profile updated successfully!
            </div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal show={isModalOpen} onClose={toggleModal} className="pt-10">
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Label htmlFor="phoneNumber" value="Phone Number" />
            <TextInput
              id="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <Label htmlFor="profilePicture" value="Profile Picture" />
            <FileInput id="profilePicture" onChange={handleFileChange} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
          <Button color="gray" onClick={toggleModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <CustomFooter />
    </>
  );
}
