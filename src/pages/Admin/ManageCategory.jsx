import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Sidebar,
  Card,
  Button,
  Modal,
  Label,
  TextInput,
  FileInput,
} from "flowbite-react";
import { Link } from "react-router-dom";
import {
  HiUser,
  HiPhotograph,
  HiTag,
  HiViewGrid,
  HiOutlineClipboardList,
  HiShoppingCart,
} from "react-icons/hi";

export default function ManageCategory() {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    getUserProfile();
    fetchCategories();
  }, []);

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
      })
      .catch((error) => console.error("Failed to fetch user profile:", error));
  };

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
    try {
      let imageUrl = "";
      if (newImage) {
        const uploadResponse = await uploadImage(newImage);
        imageUrl = uploadResponse.data.url;
      }

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
    } catch (error) {
      console.error("Failed to create category:", error);
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
    } catch (error) {
      console.error("Failed to update category:", error);
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
      .then(() => fetchCategories())
      .catch((error) => console.error("Failed to delete category:", error));
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

        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
          <Button color="green" onClick={openCreateModal} className="mb-6">
            Create New Category
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-white shadow-lg">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-40 w-full object-cover rounded-t-lg"
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

      {/* Create Category Modal */}
      <Modal show={isModalOpen} onClose={closeModal}>
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
    </>
  );
}
