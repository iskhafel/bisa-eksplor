import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
  Card,
  Button,
  Modal,
  Label,
  TextInput,
  FileInput,
  Toast,
} from "flowbite-react";
import { UserContext } from "../../context/UserContextProvider";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageBanner() {
  const { user } = useContext(UserContext);
  const [banners, setBanners] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Show Toast with Message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch All Banners
  const fetchBanners = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        setBanners(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch banners:", error);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Open Edit Modal and Set Selected Banner
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setNewTitle(banner.name);
    setNewImage(null);
    setIsEditModalOpen(true);
  };

  // Close Modals
  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedBanner(null);
    setNewTitle("");
    setNewImage(null);
  };

  // Upload Image and Return URL
  const uploadImage = async (imageFile) => {
    const token = localStorage.getItem("JWT_TOKEN");
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  };

  // Create New Banner
  const createBanner = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (!newTitle) {
      showToastMessage("Please enter a title for the banner.");
      return;
    }

    // Ensure an image is uploaded
    if (!newImage) {
      showToastMessage("Please upload an image to create the banner.");
      return;
    }

    try {
      const imageUrl = await uploadImage(newImage);

      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner",
        {
          name: newTitle,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      fetchBanners();
      closeModal();
      showToastMessage("Banner created successfully!");
    } catch (error) {
      console.error("Failed to create banner:", error);
      showToastMessage("Failed to create banner.");
    }
  };

  // Update Banner
  const updateBanner = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    try {
      let imageUrl = selectedBanner.imageUrl;

      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${selectedBanner.id}`,
        {
          name: newTitle,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      fetchBanners();
      closeModal();
      showToastMessage("Banner updated successfully!");
    } catch (error) {
      console.error("Failed to update banner:", error);
      showToastMessage("Failed to update banner.");
    }
  };

  // Delete Banner
  const deleteBanner = (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then(() => {
        fetchBanners();
        showToastMessage("Banner deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete banner:", error);
        showToastMessage("Failed to delete banner.");
      });
  };

  return (
    <>
      <Header user={user} />

      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Banners</h2>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mb-6">
            Create New Banner
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} className="bg-white shadow-lg">
                <img
                  src={banner.imageUrl || "https://via.placeholder.com/150"}
                  alt={banner.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {banner.name}
                  </h3>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button onClick={() => handleEditBanner(banner)}>
                      Edit
                    </Button>
                    <Button color="red" onClick={() => deleteBanner(banner.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div>
        {/* Toast Notification Outside Modal Context */}
        {showToast && (
          <div
            className="fixed bottom-4 right-4 z-50" // High z-index ensures it appears above modal overlay
          >
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
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
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <Toast.Toggle />
            </Toast>
          </div>
        )}

        {/* Create Banner Modal */}
        <Modal show={isCreateModalOpen} onClose={closeModal} className="z-10">
          <Modal.Header>Create New Banner</Modal.Header>
          <Modal.Body>
            <div>
              <Label htmlFor="newTitle" value="Title" />
              <TextInput
                id="newTitle"
                type="text"
                placeholder="Enter banner title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Label htmlFor="newImage" value="Image" />
              <FileInput
                id="newImage"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={createBanner}>Create Banner</Button>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Banner Modal */}
        {selectedBanner && (
          <Modal show={isEditModalOpen} onClose={closeModal}>
            <Modal.Header>Edit Banner</Modal.Header>
            <Modal.Body>
              <div>
                <Label htmlFor="editTitle" value="Title" />
                <TextInput
                  id="editTitle"
                  type="text"
                  placeholder={selectedBanner.name}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <Label htmlFor="editImage" value="Image" />
                <FileInput
                  id="editImage"
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={updateBanner}>Save Changes</Button>
              <Button color="gray" onClick={closeModal}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}
