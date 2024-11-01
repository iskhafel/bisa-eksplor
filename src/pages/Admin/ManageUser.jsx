import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import { Sidebar, Card, Button, Modal, Label, Select } from "flowbite-react";
import {
  HiUser,
  HiPhotograph,
  HiTag,
  HiViewGrid,
  HiOutlineClipboardList,
  HiShoppingCart,
} from "react-icons/hi";

export default function ManageUser() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // State to store the list of all users
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // Stores user being edited
  const [newRole, setNewRole] = useState(""); // Stores the new role for the user

  // Fetch the logged-in user profile
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
        setUser(response.data.data); // Set user data, including role
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  };

  // Fetch all users
  const fetchAllUsers = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        setUsers(response.data.data); // Assuming users are in response.data.data
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  };

  useEffect(() => {
    getUserProfile();
    fetchAllUsers(); // Fetch all users when component mounts
  }, []);

  // Open the modal and set selected user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role); // Set the initial value of newRole
    setIsModalOpen(true); // Open modal
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole(""); // Reset role
  };

  // Update the user's role
  const updateUserRole = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${selectedUser.id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      )
      .then((response) => {
        // Update users state with the new role
        console.log("User role updated:", response.data.data);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === selectedUser.id ? { ...u, role: newRole } : u
          )
        );
        closeModal(); // Close modal after update
      })
      .catch((error) => {
        console.error("Failed to update user role:", error);
      });
  };

  return (
    <>
      <Header user={user} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar aria-label="Admin Dashboard Sidebar" className="h-full w-48">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/dashboard/user" icon={HiUser}>
                User
              </Sidebar.Item>
              <Sidebar.Item href="/dashboard/banner" icon={HiPhotograph}>
                Banner
              </Sidebar.Item>
              <Sidebar.Item href="/dashboard/promo" icon={HiTag}>
                Promo
              </Sidebar.Item>
              <Sidebar.Item href="/dashboard/category" icon={HiViewGrid}>
                Category
              </Sidebar.Item>
              <Sidebar.Item
                href="/dashboard/activity"
                icon={HiOutlineClipboardList}
              >
                Activity
              </Sidebar.Item>
              <Sidebar.Item href="/dashboard/transaction" icon={HiShoppingCart}>
                Transaction
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        {/* User Cards Section */}
        <div className="flex-1 p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="bg-white shadow-lg">
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <h3 className=" text-xl font-bold text-slate-800 mb-2">
                    {user.name}
                  </h3>
                  <p className=" text-slate-600">{user.email}</p>
                  <p className=" text-slate-600">{user.phoneNumber}</p>
                  <p
                    className={`mt-2 px-4 py-1 rounded-full text-sm ${
                      user.role === "admin"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {user.role}
                  </p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Edit User Role Modal */}
      {selectedUser && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <Modal.Header>Edit User Role</Modal.Header>
          <Modal.Body>
            <div className="space-y-2">
              <Label htmlFor="role" value="Select Role" />
              <Select
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={updateUserRole}>Save Changes</Button>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
