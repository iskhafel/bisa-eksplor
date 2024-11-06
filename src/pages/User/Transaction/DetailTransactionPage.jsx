import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { Card } from "flowbite-react";

export default function DetailTransactionPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("JWT_TOKEN");
    if (!token) {
      console.error("JWT token is missing.");
      return;
    }

    axios
      .get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setTransaction(response.data.data))
      .catch((error) =>
        console.error("Failed to fetch transaction details:", error)
      );
  }, [id]);

  if (!transaction) return <p>Transaction not found or still loading...</p>;

  return (
    <>
      <Header user={user} />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
        <Card className="bg-white p-4">
          <p>Transaction ID: {transaction.id}</p>
          <p>Status: {transaction.status}</p>
          <p>Total Amount: ${transaction.totalAmount}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <ul>
              {transaction.items &&
                transaction.items.map((item) => (
                  <li key={item.itemId} className="mb-2">
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}
