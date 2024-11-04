import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContextProvider";
import {
  Sidebar,
  Card,
  Button,
  Modal,
  Label,
  Select,
  Pagination,
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

export default function ManageUser() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const fallbackImage = "https://via.placeholder.com/150";

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
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole("");
  };

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
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === selectedUser.id ? { ...u, role: newRole } : u
          )
        );
        closeModal();
      })
      .catch((error) => console.error("Failed to update user role:", error));
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="bg-white shadow-lg">
                <img
                  src={user.profilePictureUrl || fallbackImage}
                  alt={user.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                  onError={(e) => (e.currentTarget.src = fallbackImage)}
                />
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {user.name}
                  </h3>
                  <p className="text-slate-600 mt-4">{user.email}</p>
                  <p className="text-slate-600 mb-4">{user.phoneNumber}</p>
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

          {/* Pagination Component */}
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

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
