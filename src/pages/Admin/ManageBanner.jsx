import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
  Sidebar,
  Card,
  Button,
  Modal,
  Label,
  TextInput,
  FileInput,
} from "flowbite-react";
import {
  HiUser,
  HiPhotograph,
  HiTag,
  HiViewGrid,
  HiOutlineClipboardList,
  HiShoppingCart,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContextProvider";

export default function ManageBanner() {
  const { user } = useContext(UserContext);

  const [banners, setBanners] = useState([]); // Stores fetched banners
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controls create modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility
  const [selectedBanner, setSelectedBanner] = useState(null); // Stores banner being edited
  const [newTitle, setNewTitle] = useState(""); // Stores new banner title
  const [newImage, setNewImage] = useState(null); // Stores new banner image file

  // Fetch all banners
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
    fetchBanners(); // Fetch banners on component mount
  }, []);

  // Open edit modal and set selected banner
  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setNewTitle(banner.title);
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedBanner(null);
    setNewTitle("");
    setNewImage(null);
  };

  // Upload image and return imageUrl
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
      return response.data.url; // Return the uploaded image URL
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  };

  // Create new banner
  const createBanner = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    try {
      // Upload image first
      const imageUrl = await uploadImage(newImage);

      // Then create banner with the image URL
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

      fetchBanners(); // Refresh banners list
      closeModal();
    } catch (error) {
      console.error("Failed to create banner:", error);
    }
  };

  // Update banner
  const updateBanner = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    try {
      let imageUrl = selectedBanner.imageUrl;

      // Upload new image if available
      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      // Update banner with new details
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

      fetchBanners(); // Refresh banners list
      closeModal();
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  // Delete banner
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
      })
      .catch((error) => {
        console.error("Failed to delete banner:", error);
      });
  };

  return (
    <>
      <Header user={user} />

      <div className="flex">
        <Sidebar aria-label="Admin Dashboard Sidebar" className="h-full w-48">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item icon={HiUser} to="/dashboard/user" as={Link}>
                User
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiPhotograph}
                to="/dashboard/banner"
                as={Link}
              >
                Banner
              </Sidebar.Item>
              <Sidebar.Item icon={HiTag} to="/dashboard/promo" as={Link}>
                Promo
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiViewGrid}
                to="/dashboard/category"
                as={Link}
              >
                Category
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiOutlineClipboardList}
                to="/dashboard/activity"
                as={Link}
              >
                Activity
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiShoppingCart}
                to="/dashboard/transaction"
                as={Link}
              >
                Transaction
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        {/* Banner Cards Section */}
        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Banners</h2>

          {/* Create Banner Button */}
          <Button
            color="green"
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-6"
          >
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

      {/* Create Banner Modal */}
      <Modal show={isCreateModalOpen} onClose={closeModal}>
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
    </>
  );
}
