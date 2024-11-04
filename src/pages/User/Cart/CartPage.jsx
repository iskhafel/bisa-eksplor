import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { Button, TextInput, Card } from "flowbite-react";

export default function CartPage() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch all items in the cart
  const fetchCartItems = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setCartItems(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // Update quantity of an item
  const updateCartQuantity = async (id, quantity) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      fetchCartItems(); // Refresh cart after updating quantity
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };

  // Delete an item from the cart
  const deleteCartItem = async (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setCartItems(cartItems.filter((item) => item.id !== id)); // Update state after deleting
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-white shadow-lg">
                <img
                  src={
                    item.activity.imageUrls[0] ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.activity.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    {item.activity.title}
                  </h3>
                  <p className="text-slate-600">
                    Price: ${item.activity.price}
                  </p>
                  <p className="text-slate-600">Quantity: {item.quantity}</p>
                  <div className="flex gap-2 mt-4">
                    <TextInput
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-16"
                    />
                    <Button onClick={() => deleteCartItem(item.id)} color="red">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">Your cart is empty.</p>
        )}
      </div>
    </>
  );
}
