import { Navbar, Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const api =
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout";
    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = localStorage.getItem("JWT_TOKEN");

    try {
      await axios.get(api, {
        headers: {
          apiKey: apiKey,
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("JWT_TOKEN");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="#">
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            BisaEksplor
          </span>
        </Navbar.Brand>

        <Navbar.Collapse>
          <Link to="/">Home</Link>
          <Link to="/">Promo</Link>
          <Link to="/">Activity</Link>
          <Link to="/">Cart</Link>
        </Navbar.Collapse>
        <div className="flex">
          {localStorage.JWT_TOKEN ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </Navbar>
    </div>
  );
}
