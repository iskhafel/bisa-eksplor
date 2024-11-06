import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import Header from "../../components/Header";
import AdminSidebar from "../../components/AdminSidebar";
import { Card, Button, Modal, Label, TextInput, Select } from "flowbite-react";

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

  const uploadImages = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    const uploadedUrls = [];
    for (const image of newImages) {
      const formData = new FormData();
      formData.append("image", image);

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
        uploadedUrls.push(response.data.url);
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const imageUrls = await uploadImages();
      const activityData = { ...formData, imageUrls };

      const url = isEditModalOpen
        ? `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${selectedActivity.id}`
        : "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity";

      await axios.post(url, activityData, {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      });

      fetchCategoriesAndActivities();
      closeModal();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setFormData({ ...activity });
    setIsEditModalOpen(true);
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
        <AdminSidebar />

        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Activities</h2>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mb-6">
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
                  onError={(e) =>
                    (e.currentTarget.src = "https://via.placeholder.com/150")
                  }
                />
                <div className="p-4 text-center h-32 flex flex-col justify-between">
                  <h3 className="text-md font-bold text-slate-800">
                    {activity.title}
                  </h3>
                  <div className="flex justify-center gap-2">
                    <Button
                      className="w-full"
                      onClick={() => handleEditActivity(activity)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="red"
                      className="w-full"
                      onClick={() => deleteActivity(activity.id)}
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

      <Modal show={isCreateModalOpen || isEditModalOpen} onClose={closeModal}>
        <Modal.Header>
          {isEditModalOpen ? "Edit Activity" : "Create Activity"}
        </Modal.Header>
        <Modal.Body>
          <div className="">
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
            <Label htmlFor="description" value="Description" />
            <TextInput
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Label htmlFor="imageUrls" value="Upload Images" />
            <input
              id="imageUrls"
              type="file"
              multiple
              onChange={(e) => setNewImages([...e.target.files])}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
            {/* Price */}
            <Label htmlFor="price" value="Price" />
            <TextInput
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
            />

            {/* Price Discount */}
            <Label htmlFor="price_discount" value="Discounted Price" />
            <TextInput
              id="price_discount"
              type="number"
              value={formData.price_discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_discount: parseInt(e.target.value),
                })
              }
            />

            {/* Rating */}
            <Label htmlFor="rating" value="Rating" />
            <TextInput
              id="rating"
              type="number"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
            />

            {/* Total Reviews */}
            <Label htmlFor="total_reviews" value="Total Reviews" />
            <TextInput
              id="total_reviews"
              type="number"
              value={formData.total_reviews}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_reviews: parseInt(e.target.value),
                })
              }
            />

            {/* Facilities */}
            <Label htmlFor="facilities" value="Facilities" />
            <TextInput
              id="facilities"
              type="text"
              value={formData.facilities}
              onChange={(e) =>
                setFormData({ ...formData, facilities: e.target.value })
              }
            />

            {/* Address */}
            <Label htmlFor="address" value="Address" />
            <TextInput
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            {/* Province */}
            <Label htmlFor="province" value="Province" />
            <TextInput
              id="province"
              type="text"
              value={formData.province}
              onChange={(e) =>
                setFormData({ ...formData, province: e.target.value })
              }
            />

            {/* City */}
            <Label htmlFor="city" value="City" />
            <TextInput
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />

            {/* Location Maps */}
            <Label htmlFor="location_maps" value="Location Maps Embed Code" />
            <TextInput
              id="location_maps"
              type="text"
              value={formData.location_maps}
              onChange={(e) =>
                setFormData({ ...formData, location_maps: e.target.value })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Save Changes</Button>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
