import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import axios from "axios";
import Header from "../../../components/Header";
import { Card, Button, Modal, FileInput } from "flowbite-react";

export default function TransactionPage() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
  const cancelTransaction = async (id) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${id}`,
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

  // Open modal and set selected transaction ID for uploading proof
  const openUploadModal = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setIsUploadModalOpen(true);
  };

  // Close the upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("JWT_TOKEN");
    const formData = new FormData();
    formData.append("image", selectedFile);

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

      // Log response to check the structure
      console.log("Upload Response:", uploadResponse);

      // Safely retrieve the URL from the response
      const imageUrl = uploadResponse.data.url;
      if (!imageUrl) {
        console.error("Failed to retrieve image URL from response.");
        return;
      }

      // Step 2: Send the image URL to the proof of payment endpoint
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${selectedTransactionId}`,
        { proofPaymentUrl: imageUrl },
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh transactions and close the modal
      fetchTransactions();
      closeUploadModal();
    } catch (error) {
      console.error("Failed to upload proof of payment:", error);
    }
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
                  onClick={() => openUploadModal(transaction.id)}
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

      {/* Upload Proof of Payment Modal */}
      <Modal show={isUploadModalOpen} onClose={closeUploadModal}>
        <Modal.Header>Upload Proof of Payment</Modal.Header>
        <Modal.Body>
          <FileInput
            onChange={handleFileChange}
            accept="image/*"
            className="mt-4"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleFileUpload}>Upload</Button>
          <Button color="gray" onClick={closeUploadModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
