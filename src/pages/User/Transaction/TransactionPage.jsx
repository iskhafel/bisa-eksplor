import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { Card, Button } from "flowbite-react";

export default function TransactionPage() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setTransactions(response.data.data))
      .catch((error) => console.error("Failed to fetch transactions:", error));
  };

  return (
    <>
      <Header user={user} />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>
        {transactions.length > 0 ? (
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4 bg-white">
                <h3 className="text-lg font-semibold mb-2">
                  Transaction ID: {transaction.id}
                </h3>
                <p>
                  Date: {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
                <p>Status: {transaction.status}</p>
                <p>Total Amount: ${transaction.totalAmount}</p>
                <Button
                  size="sm"
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                  className="mt-2"
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No transactions found.</p>
        )}
      </div>
    </>
  );
}
