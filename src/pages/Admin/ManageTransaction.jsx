import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContextProvider";
import axios from "axios";
import Header from "../../components/Header";
import { Card, Button, Modal, Select } from "flowbite-react";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageTransaction() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Fetch all transactions
  const fetchAllTransactions = async () => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setTransactions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  // Fetch transaction details by ID
  const fetchTransactionById = async (transactionId) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      const response = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setSelectedTransaction(response.data.data);
      setStatus(response.data.data.status);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch transaction details:", error);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (transactionId) => {
    const token = localStorage.getItem("JWT_TOKEN");
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transactionId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      fetchAllTransactions(); // Refresh transactions after updating
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to update transaction status:", error);
    }
  };

  return (
    <>
      <Header user={user} />
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Manage Transactions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="bg-white shadow-lg p-4">
                <p className="font-semibold">
                  Transaction ID: {transaction.id}
                </p>
                <p>Status: {transaction.status}</p>
                <p>Total Amount: ${transaction.totalAmount}</p>
                <Button
                  onClick={() => fetchTransactionById(transaction.id)}
                  className="mt-4 w-full"
                >
                  View & Edit Status
                </Button>
              </Card>
            ))}
          </div>

          {/* Transaction Details Modal */}
          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Modal.Header>Transaction Details</Modal.Header>
            <Modal.Body>
              {selectedTransaction && (
                <div>
                  <p>
                    <strong>Transaction ID:</strong> {selectedTransaction.id}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedTransaction.status}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> $
                    {selectedTransaction.totalAmount}
                  </p>
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <ul>
                    {selectedTransaction.items.map((item) => (
                      <li key={item.itemId}>
                        {item.name} - {item.quantity} x ${item.price}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => updateTransactionStatus(selectedTransaction.id)}
              >
                Update Status
              </Button>
              <Button color="gray" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}
