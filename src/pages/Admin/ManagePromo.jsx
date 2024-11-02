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
  Textarea,
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

export default function ManagePromo() {
  const [user, setUser] = useState(null);
  const [promos, setPromos] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [newImage, setNewImage] = useState(null);

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
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };

  const fetchPromos = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        setPromos(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch promos:", error);
      });
  };

  useEffect(() => {
    getUserProfile();
    fetchPromos();
  }, []);

  const handleEditPromo = (promo) => {
    setSelectedPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedPromo(null);
    setFormData({
      title: "",
      description: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setNewImage(null);
  };

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

  const createPromo = () => {
    const token = localStorage.getItem("JWT_TOKEN");

    uploadImage(newImage)
      .then((imageUrl) => {
        return axios.post(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-promo",
          {
            ...formData,
            imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
      })
      .then(() => {
        fetchPromos();
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to create promo:", error);
      });
  };

  // Update promo
  const updatePromo = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    let imageUrl = selectedPromo.imageUrl;

    const updateImagePromise = newImage
      ? uploadImage(newImage)
      : Promise.resolve(imageUrl);

    updateImagePromise
      .then((url) => {
        imageUrl = url;
        return axios.post(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-promo/${selectedPromo.id}`,
          {
            ...formData,
            imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
      })
      .then(() => {
        fetchPromos();
        closeModal();
      })
      .catch((error) => {
        console.error("Failed to update promo:", error);
      });
  };

  // Delete promo
  const deletePromo = (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-promo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then(() => {
        fetchPromos();
      })
      .catch((error) => {
        console.error("Failed to delete promo:", error);
      });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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
          <h2 className="text-2xl font-bold mb-6">Manage Promos</h2>
          <Button
            color="green"
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-6"
          >
            Create New Promo
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promos.map((promo) => (
              <Card key={promo.id} className="bg-white shadow-lg">
                <img
                  src={promo.imageUrl || "https://via.placeholder.com/150"}
                  alt={promo.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {promo.title}
                  </h3>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleEditPromo(promo)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button color="red" onClick={() => deletePromo(promo.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Create Promo Modal */}
      <Modal show={isCreateModalOpen} onClose={closeModal}>
        <Modal.Header>Create New Promo</Modal.Header>
        <Modal.Body>
          <div className="">
            <Label htmlFor="newTitle" value="Title" />
            <TextInput
              id="title"
              type="text"
              placeholder="Enter promo title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
            <Label htmlFor="terms_condition" value="Terms and Conditions" />
            <Textarea
              id="terms_condition"
              placeholder="Enter terms and conditions"
              value={formData.terms_condition}
              onChange={handleChange}
            />
            <Label htmlFor="promo_code" value="Promo Code" />
            <TextInput
              id="promo_code"
              type="text"
              placeholder="Enter promo code"
              value={formData.promo_code}
              onChange={handleChange}
            />
            <Label htmlFor="promo_discount_price" value="Discount Price" />
            <TextInput
              id="promo_discount_price"
              type="number"
              placeholder="Enter discount price"
              value={formData.promo_discount_price}
              onChange={handleChange}
            />
            <Label htmlFor="minimum_claim_price" value="Minimum Claim Price" />
            <TextInput
              id="minimum_claim_price"
              type="number"
              placeholder="Enter minimum claim price"
              value={formData.minimum_claim_price}
              onChange={handleChange}
            />
            <Label htmlFor="newImage" value="Image" />
            <FileInput
              id="newImage"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createPromo}>Create Promo</Button>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Promo Modal */}
      <Modal show={isEditModalOpen} onClose={closeModal}>
        <Modal.Header>Edit Promo</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="newTitle" value="Title" />
            <TextInput
              id="title"
              type="text"
              placeholder="Enter promo title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
            <Label htmlFor="terms_condition" value="Terms and Conditions" />
            <Textarea
              id="terms_condition"
              placeholder="Enter terms and conditions"
              value={formData.terms_condition}
              onChange={handleChange}
            />
            <Label htmlFor="promo_code" value="Promo Code" />
            <TextInput
              id="promo_code"
              type="text"
              placeholder="Enter promo code"
              value={formData.promo_code}
              onChange={handleChange}
            />
            <Label htmlFor="promo_discount_price" value="Discount Price" />
            <TextInput
              id="promo_discount_price"
              type="number"
              placeholder="Enter discount price"
              value={formData.promo_discount_price}
              onChange={handleChange}
            />
            <Label htmlFor="minimum_claim_price" value="Minimum Claim Price" />
            <TextInput
              id="minimum_claim_price"
              type="number"
              placeholder="Enter minimum claim price"
              value={formData.minimum_claim_price}
              onChange={handleChange}
            />
            <Label htmlFor="newImage" value="Image" />
            <FileInput
              id="newImage"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updatePromo}>Save Changes</Button>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
