/* eslint-disable react/prop-types */
import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = localStorage.getItem("JWT_TOKEN");

    axios
      .get(api, {
        headers: { apiKey, Authorization: `Bearer ${token}` },
      })
      .then(() => {
        localStorage.removeItem("JWT_TOKEN");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <Navbar fluid={true} className="bg-slate-700 text-white">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-2xl font-bold text-white">
          BisaEksplor
        </span>
      </Navbar.Brand>

      <Navbar.Collapse>
        <Link className="text-white hover:text-gray-300 hover:underline" to="/">
          Home
        </Link>
        <Link className="text-white hover:text-gray-300 hover:underline" to="/">
          Activity
        </Link>
        <Link className="text-white hover:text-gray-300 hover:underline" to="/">
          Card
        </Link>
      </Navbar.Collapse>

      <div className="flex items-center">
        {user ? ( // Display user avatar and dropdown if logged in
          <div className="flex md:order-2">
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar img={user.profilePictureUrl} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={() => navigate("/profile")}>
                Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <Button onClick={() => navigate("/login")} className="text-white">
            Login
          </Button>
        )}
      </div>
    </Navbar>
  );
}
