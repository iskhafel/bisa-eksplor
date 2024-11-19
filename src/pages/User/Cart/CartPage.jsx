import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import {
  Button,
  TextInput,
  Card,
  Select,
  Label,
  Checkbox,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/150";

  useEffect(() => {
    fetchCartItems();
    fetchPaymentMethods();
  }, []);

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

  const fetchPaymentMethods = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setPaymentMethods(response.data.data);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    }
  };

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
      fetchCartItems();
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };

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
      setCartItems(cartItems.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    if (selectedItems.includes(item.id)) {
      return sum + item.activity.price * item.quantity;
    }
    return sum;
  }, 0);

  const createTransaction = async () => {
    const token = localStorage.getItem("JWT_TOKEN");

    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    try {
      await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        { cartIds: selectedItems, paymentMethodId: selectedPaymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      navigate(`/transaction`);
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {cartItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-white shadow-lg">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="ml-2"
                  />
                  <img
                    src={item.activity.imageUrls[0] || fallbackImage}
                    alt={item.activity.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                    onError={(e) => (e.target.src = fallbackImage)}
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
                      <Button
                        onClick={() => deleteCartItem(item.id)}
                        color="failure"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold">
                Total: ${totalAmount.toFixed(2)}
              </h3>

              <Label htmlFor="paymentMethod" value="Select Payment Method" />
              <Select
                id="paymentMethod"
                required
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Choose Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </Select>

              <Button onClick={createTransaction} className="mt-4 w-full">
                Proceed to Checkout
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-700">Your cart is empty.</p>
        )}
      </div>
    </>
  );
}
