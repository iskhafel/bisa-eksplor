/* eslint-disable react/prop-types */
import { Navbar, Button, Avatar, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaAtlassian,
  FaShoppingCart,
  FaEdit,
  FaSignOutAlt,
  FaTicketAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

import { HiMenuAlt3 } from "react-icons/hi";

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

      <Navbar.Toggle>
        <HiMenuAlt3 className="text-white" size={24} />
      </Navbar.Toggle>

      <div className="md:hidden flex flex-col items-start">
        {user ? (
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
            <Dropdown.Item
              className="flex gap-2"
              onClick={() => navigate("/profile")}
            >
              <FaEdit /> Profile
            </Dropdown.Item>
            <Dropdown.Item
              className="flex gap-2"
              onClick={() => navigate("/transaction")}
            >
              <GrTransaction /> My Transaction
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="flex gap-2" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => navigate("/login")} className="text-white">
            Login
          </Button>
        )}
      </div>

      <Navbar.Collapse>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-10 py-2">
          <Link
            className="flex gap-2 text-white hover:text-gray-300 hover:underline"
            to="/"
          >
            <FaHome size={20} />
            Home
          </Link>
          <Link
            className="flex gap-2 text-white hover:text-gray-300 hover:underline"
            to="/activity"
          >
            <FaAtlassian size={20} /> Activity
          </Link>
          <Link
            className="flex gap-2 text-white hover:text-gray-300 hover:underline"
            to="/promo"
          >
            <FaTicketAlt size={20} /> Promo
          </Link>
          {user && user.role === "user" && (
            <Link
              className="flex gap-2 text-white hover:text-gray-300 hover:underline"
              to="/cart"
            >
              <FaShoppingCart size={20} /> Cart
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              className="flex gap-2 text-white hover:text-gray-300 hover:underline"
              to="/dashboard/user"
            >
              <FaTachometerAlt size={20} /> Dashboard
            </Link>
          )}
        </div>
      </Navbar.Collapse>

      <div className="hidden md:flex items-center md:order-2">
        {user ? (
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
            <Dropdown.Item
              className="flex gap-2"
              onClick={() => navigate("/profile")}
            >
              <FaEdit /> Profile
            </Dropdown.Item>
            {user && user.role === "user" && (
              <Dropdown.Item
                className="flex gap-2"
                onClick={() => navigate("/transaction")}
              >
                <GrTransaction /> My Transaction
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item className="flex gap-2" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => navigate("/login")} className="text-white">
            Login
          </Button>
        )}
      </div>
    </Navbar>
  );
}
