import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import axios from "axios";
import Header from "../../../components/Header";
import { Card, Button } from "flowbite-react";

export default function TransactionPage() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    const token = localStorage.getItem("JWT_TOKEN");
    axios
      .get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
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

  // Cancel transaction function
  const cancelTransaction = async (transactionId) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${transactionId}`,
        {},
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTransactions(); // Refresh transactions after canceling
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
    }
  };

  // Handle file upload for proof of payment
  const uploadProof = async (transactionId) => {
    const token = localStorage.getItem("JWT_TOKEN");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Step 1: Upload image to `upload-image` endpoint
        const uploadResponse = await axios.post(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image`,
          formData,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Extract image URL from the response
        const imageUrl = uploadResponse.data.data.url;

        // Step 2: Send the image URL to the proof of payment endpoint
        await axios.post(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${transactionId}`,
          { proofPaymentUrl: imageUrl },
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchTransactions(); // Refresh transactions after uploading proof
      } catch (error) {
        console.error("Failed to upload proof of payment:", error);
      }
    };
    fileInput.click();
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
                <p>Proof of Payment: {transaction.proofPaymentUrl}</p>
                <Button
                  size="sm"
                  onClick={() => uploadProof(transaction.id)}
                  className="mt-2"
                >
                  Upload Bukti Pembayaran
                </Button>
                {transaction.status === "pending" && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => cancelTransaction(transaction.id)}
                    className="mt-2"
                  >
                    Cancel Transaction
                  </Button>
                )}
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
