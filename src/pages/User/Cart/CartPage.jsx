import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { Button, Card, Select, Label, Checkbox, Toast } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // State for toast message
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

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedItems([]); // Deselect all items
    } else {
      const allItemIds = cartItems.map((item) => item.id); // Select all items
      setSelectedItems(allItemIds);
    }
    setIsSelectAll(!isSelectAll);
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
      setToastMessage("Please select a payment method.");
      return;
    }

    if (selectedItems.length === 0) {
      setToastMessage("Please select at least one item to checkout.");
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
            {/* Select All Button */}
            <div className="flex items-center mb-4 gap-2">
              <Checkbox
                id="selectAll"
                checked={isSelectAll}
                onChange={handleSelectAll}
              />
              <Label htmlFor="selectAll" value="Select All" />
            </div>

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

        {/* Toast Notifications */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 112-0 1 1 0 01-2 0zm2-3a1 1 0 00-2 0v2a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 text-sm font-normal">{toastMessage}</div>
              <Toast.Toggle onClick={() => setToastMessage(null)} />
            </Toast>
          </div>
        )}
      </div>
    </>
  );
}
