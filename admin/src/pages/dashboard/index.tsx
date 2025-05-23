import { useNavigate } from 'react-router-dom'
import './styles.css'
import { JSX, useEffect, useState } from 'react'
import { FaUserCircle, FaCheck, FaTimes, FaRegClock, FaCheckCircle, FaEye, FaSpinner } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

// Mock data for development
// const mockPendingListings = [
//   { id: 1, title: "Modern Apartment in Downtown", address: "123 Main St", price: "$350,000", created: "2025-04-28" },
//   { id: 2, title: "Cozy Suburban Home", address: "456 Oak Ave", price: "$450,000", created: "2025-04-27" },
//   { id: 3, title: "Luxury Penthouse", address: "789 Skyline Blvd", price: "$1,200,000", created: "2025-04-26" }
// ];

const mockApprovedListings = [
  { id: 4, title: "Beachfront Villa", address: "101 Ocean Dr", price: "$850,000", approved: "2025-04-25" },
  { id: 5, title: "Mountain Cabin", address: "202 Pine Trail", price: "$250,000", approved: "2025-04-24" }
];

const Dashboard = (): JSX.Element => {


  useEffect(() => {
    // Fetch pending listings from the server when the component mounts
    getPendingListings();
  }, []);


  const getPendingListings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://real-estate-xbh8.onrender.com/api/listing/pending', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pending listings');
      }
      const data = await response.json();
      setPendingListings(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching pending listings:', error);
    }
  }


  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const [pendingListings, setPendingListings] = useState<any>([]);
  const [approvedListings, setApprovedListings] = useState(mockApprovedListings);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<{ show: boolean, message: string, type: 'approve' | 'reject' } | null>(null);
  const [showIdProofModal, setShowIdProofModal] = useState<boolean>(false);
  const [currentIdProof, setCurrentIdProof] = useState<string>("");


  const handleLogout = (): void => {
    // In a real app, you'd clear auth tokens here
    navigate('/login');
  };

  const handleApprove = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://real-estate-xbh8.onrender.com/api/listing/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve listing');
      }

      const data = await response.json();

      // Remove the approved listing from pending listings
      setPendingListings(pendingListings.filter((listing: any) => listing._id !== id));

      setIsLoading(false);
      alert(`Listing approved successfully!`);

      console.log("Listing approved:", data);
    } catch (error) {
      setIsLoading(false);
      alert(`Error approving listing: ${error}`);
      console.error("Error approving listing:", error);
      // You might want to show an error toast or message here
    }

  };

  const openRejectModal = (id: number): void => {
    setSelectedListingId(id);
    setRejectReason("");
    setShowModal(true);
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://real-estate-xbh8.onrender.com/api/listing/reject/${selectedListingId}`, {
        method: 'POST',
        body: JSON.stringify({ comment: rejectReason }),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject listing');
      }

      const data = await response.json();

      // Remove the approved listing from pending listings
      setPendingListings(pendingListings.filter((listing: any) => listing._id !== selectedListingId));
      setSelectedListingId(null);
      setRejectReason("");
      setShowModal(true);
      setIsLoading(false);
      alert(`Listing reject successfully!`);

      console.log("Listing reject:", data);
    } catch (error) {
      setIsLoading(false);
      alert(`Error reject listing: ${error}`);
      console.error("Error reject listing:", error);
      // You might want to show an error toast or message here
    }
  };

  return (
    <div className="dashboard-container">

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="loading-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaSpinner className="loading-spinner" />
              <p>{'Loading...'}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Header */}
      <motion.header
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome Admin
          </motion.h1>
          <div className="profile-section">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="avatar-container"
            >
              <FaUserCircle size={28} />
            </motion.div>
            <motion.button
              onClick={handleLogout}
              className="logout-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Confirmation Toast */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className={`toast-notification ${showConfirmation.type === 'approve' ? 'toast-success' : 'toast-error'}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="toast-icon">
              {showConfirmation.type === 'approve' ? <FaCheckCircle /> : <FaTimes />}
            </div>
            <span>{showConfirmation.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Pending Listings Section */}
        {
          !isLoading ?
            <motion.div
              className="dashboard-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="card-header">
                <h2>Pending Listings</h2>
                <div className="pending-badge">{pendingListings.length}</div>
              </div>
              {pendingListings.length === 0 ? (
                <motion.div
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <FaRegClock size={48} color="#ddd" />
                  <p>No pending listings to review</p>
                </motion.div>
              ) : (
                <div className="listings-table-container">
                  <table className="listings-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Price</th>
                        <th>Created</th>
                        <th>Id Proof</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {pendingListings.map((listing: any, index: number) => (
                          <motion.tr
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <td>{listing.name}</td>
                            <td>{listing.street},{listing.city},{listing.state},{listing.pincode}</td>
                            <td className="price-cell">₹{listing.minPrice?.toLocaleString("en-IN")} – ₹{listing.maxPrice?.toLocaleString("en-IN")}</td>
                            <td>{listing.createdAt.split('T')[0]}</td>
                            <td>
                              <FaEye
                                size={22}
                                onClick={() => {
                                  setCurrentIdProof(listing.userIdCard);
                                  setShowIdProofModal(true);
                                }}
                                style={{ cursor: 'pointer', color: '#007bff' }}
                              />
                            </td>
                            <td className="action-buttons">
                              <motion.button
                                className="approve-button"
                                onClick={() => handleApprove(listing._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaCheck /> <span>Approve</span>
                              </motion.button>
                              <motion.button
                                className="reject-button"
                                onClick={() => openRejectModal(listing._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes /> <span>Decline</span>
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
            :
            <motion.div
              className="dashboard-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="card-header">
                <h2>Pending Listings</h2>
                <div className="pending-badge">{pendingListings.length}</div>
                <span>Loading...</span>
              </div>

            </motion.div>
        }


        {/* Approved Listings Section */}
        {/* <motion.div 
          className="dashboard-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="card-header">
            <h2>Approved Listings</h2>
            <div className="approved-badge">{approvedListings.length}</div>
          </div>
          {approvedListings.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <FaCheckCircle size={48} color="#ddd" />
              <p>No approved listings yet</p>
            </motion.div>
          ) : (
            <div className="listings-table-container">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Approved Date</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedListings.map((listing, index) => (
                    <motion.tr 
                      key={listing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                    >
                      <td>{listing.title}</td>
                      <td>{listing.address}</td>
                      <td className="price-cell">{listing.price}</td>
                      <td>{listing.approved}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div> */}
      </main>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Decline Listing</h3>
              <p>Please provide a reason for declining this listing:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                autoFocus
              />
              <div className="modal-buttons">
                <motion.button
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="confirm-button"
                  onClick={handleReject}
                >
                  Confirm Decline
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ID Proof Modal */}
      <AnimatePresence>
        {showIdProofModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowIdProofModal(false)}
          >
            <motion.div
              className="modal id-proof-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>ID Proof</h3>
              <div className="id-proof-image-container">
                <img
                  src={currentIdProof}
                  alt="User ID Card"
                  className="id-proof-image"
                />
              </div>
              <div className="modal-buttons">
                <motion.button
                  className="close-button"
                  onClick={() => setShowIdProofModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;