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

export default function ManageCategory() {
  const { user } = useContext(UserContext);

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const fallbackImage = "https://via.placeholder.com/150";
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Show Toast with Message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  };

  const openCreateModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({ name: "", imageUrl: "" });
    setNewImage(null);
  };

  const uploadImage = (file) => {
    const token = localStorage.getItem("JWT_TOKEN");
    const data = new FormData();
    data.append("image", file);

    return axios.post(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    );
  };

  const createCategory = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (!formData.name) {
      showToastMessage("Please enter a title for the category.");
      return;
    }

    // Ensure an image is uploaded
    if (!newImage) {
      showToastMessage("Please upload an image to create the category.");
      return;
    }

    try {
      const uploadResponse = await uploadImage(newImage);
      const imageUrl = uploadResponse.data.url;

      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-category",
        { name: formData.name, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      fetchCategories();
      closeModal();
      showToastMessage("Category created successfully!");
    } catch (error) {
      console.error("Failed to create category:", error);
      showToastMessage("Failed to create category.");
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setNewTitle(category.name);
    setIsEditModalOpen(true);
  };

  const updateCategory = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      let imageUrl = selectedCategory.imageUrl;
      if (newImage) {
        const uploadResponse = await uploadImage(newImage);
        imageUrl = uploadResponse.data.url;
      }

      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-category/${selectedCategory.id}`,
        { name: newTitle, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      fetchCategories();
      closeModal();
      showToastMessage("Category updated successfully!");
    } catch (error) {
      console.error("Failed to update category:", error);
      showToastMessage("Failed to update category.");
    }
  };

  const deleteCategory = (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-category/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchCategories();
        showToastMessage("Category deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete category:", error);
        showToastMessage("Failed to delete category.");
      });
  };

  return (
    <>
      <Header user={user} />
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
          <Button onClick={openCreateModal} className="mb-6">
            Create New Category
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white shadow-lg">
                <img
                  src={category.imageUrl || fallbackImage}
                  alt={category.name}
                  className="h-40 w-full object-cover rounded-t-lg"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {category.name}
                  </h3>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button onClick={() => handleEditCategory(category)}>
                      Edit
                    </Button>
                    <Button
                      color="red"
                      onClick={() => deleteCategory(category.id)}
                    >
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

        {/* Create Category Modal */}
        <Modal show={isModalOpen} onClose={closeModal} className="z-10">
          <Modal.Header>Create New Category</Modal.Header>
          <Modal.Body>
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Label htmlFor="newImage" value="Image" />
            <FileInput
              id="newImage"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={createCategory}>Create Category</Button>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Category Modal */}
        {selectedCategory && (
          <Modal show={isEditModalOpen} onClose={closeModal}>
            <Modal.Header>Edit Category</Modal.Header>
            <Modal.Body>
              <Label htmlFor="editTitle" value="Name" />
              <TextInput
                id="editTitle"
                type="text"
                placeholder={selectedCategory.name}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Label htmlFor="editImage" value="Image" />
              <FileInput
                id="editImage"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={updateCategory}>Save Changes</Button>
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
