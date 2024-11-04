import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import Header from "../../components/Header";
import {
  Sidebar,
  Card,
  Button,
  Modal,
  Label,
  TextInput,
  Select,
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

export default function ManageActivity() {
  const { user } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    price_discount: 0,
    rating: 0,
    total_reviews: 0,
    categoryId: "",
    imageUrls: [],
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
  });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchCategoriesAndActivities();
  }, []);

  const fetchCategoriesAndActivities = async () => {
    try {
      const [categoriesRes, activitiesRes] = await Promise.all([
        axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        ),
        axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
          {
            headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
          }
        ),
      ]);
      setCategories(categoriesRes.data.data);
      setActivities(activitiesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch categories or activities:", error);
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedActivity(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      price_discount: 0,
      rating: 0,
      total_reviews: 0,
      categoryId: "",
      imageUrls: [],
      facilities: "",
      address: "",
      province: "",
      city: "",
      location_maps: "",
    });
    setNewImages([]);
  };

  const uploadImage = async (imageFile) => {
    const token = localStorage.getItem("JWT_TOKEN");
    const formData = new FormData();
    formData.append("image", imageFile);
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
  };

  const createActivity = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const imageUrls = await Promise.all(
        newImages.map((file) => uploadImage(file))
      );
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity",
        { ...formData, imageUrls },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      fetchCategoriesAndActivities();
      closeModal();
    } catch (error) {
      console.error("Failed to create activity:", error);
    }
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setFormData({ ...activity });
    setIsEditModalOpen(true);
  };

  const updateActivity = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      let imageUrls = selectedActivity.imageUrls;
      if (newImages.length) {
        imageUrls = await Promise.all(
          newImages.map((file) => uploadImage(file))
        );
      }
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${selectedActivity.id}`,
        { ...formData, imageUrls },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      fetchCategoriesAndActivities();
      closeModal();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const deleteActivity = (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchCategoriesAndActivities();
      })
      .catch((error) => {
        console.error("Failed to delete activity:", error);
      });
  };

  return (
    <>
      <Header user={user} />
      <div className="flex">
        <Sidebar aria-label="Admin Dashboard Sidebar" className="h-full w-48">
          {/* Sidebar links */}
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item icon={HiUser} as={Link} to="/dashboard/user">
                User
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiPhotograph}
                as={Link}
                to="/dashboard/banner"
              >
                Banner
              </Sidebar.Item>
              <Sidebar.Item icon={HiTag} as={Link} to="/dashboard/promo">
                Promo
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiViewGrid}
                as={Link}
                to="/dashboard/category"
              >
                Category
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiOutlineClipboardList}
                as={Link}
                to="/dashboard/activity"
              >
                Activity
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiShoppingCart}
                as={Link}
                to="/dashboard/transaction"
              >
                Transaction
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Activities</h2>
          <Button
            color="green"
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-6"
          >
            Create New Activity
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-white shadow-lg">
                <img
                  src={
                    activity.imageUrls[0] || "https://via.placeholder.com/150"
                  }
                  alt={activity.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {activity.title}
                  </h3>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => handleEditActivity(activity)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    className="mt-2 w-full"
                    onClick={() => deleteActivity(activity.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal show={isCreateModalOpen || isEditModalOpen} onClose={closeModal}>
        <Modal.Header>
          {isEditModalOpen ? "Edit Activity" : "Create Activity"}
        </Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Label htmlFor="category" value="Category" />
            <Select
              id="category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {/* Additional fields for description, address, price, etc. */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={isEditModalOpen ? updateActivity : createActivity}>
            Save Changes
          </Button>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
