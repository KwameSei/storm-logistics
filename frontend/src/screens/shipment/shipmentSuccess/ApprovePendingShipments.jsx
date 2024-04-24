import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import classes from "./shipmentSuccess.module.scss";
import { BlueButton } from "../../../components/ButtonStyled";

const ApprovePendingShipments = () => {
  const [shipments, setShipments] = useState([]);

  const currentUser = useSelector(state => state.user.currentUser);
  const token = localStorage.getItem("token");
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchPendingShipments();
  }, []);

  const fetchPendingShipments = async () => {
    try {
      const response = await axios.get(`${URL}/api/shipment/get-pending-shipments`, {
        headers: {
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });
      console.log("Pending Shipments:", response.data.data); // Log the pending shipments for debugging

      const PendingData = response.data.data.filter(shipment => shipment.status !== "Approved");
      toast.success("Pending shipments waiting for approval fetched successfully!");

      setShipments(PendingData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pending shipments");
    }
  }

  const approveShipment = async (id, senderMail) => {
    try {
      const response = await axios.put(`${URL}/api/shipment/approve-shipment/${id}`, {
        approvedByAdmin: true,
        status: "Approved",
        senderMail: senderMail // Add the sender's email address
      });

      // Update the local state with the new list of pending shipments
      fetchPendingShipments();
      toast.success(response.data.message || "Shipment approved successfully");

      // Remove the approved shipment from the local state
    setShipments(prevShipments => prevShipments.filter(shipment => shipment._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve shipment");
    }
  }

  return (
    <div className={classes.approve}>
      <div className={classes.approve_container}>
        <h1>Pending Shipments</h1>
        <ul className={classes.unordered_list}>
          {shipments.map((shipment) => {
            console.log("Shipment ID:", shipment._id); // Log the ID for debugging
            return (
              <li className={classes.list} key={shipment._id}>
                <div className={classes.list_container}>
                  <span>Tracking Number: {shipment.trackingNumber}</span>
                  <span>Sender: {shipment.senderName}</span>
                  <span>Recipient: {shipment.recipientName}</span>
                  <span>Status: {shipment.status}</span>
                </div>
                <BlueButton onClick={() => approveShipment(shipment._id, shipment.senderMail)}>Approve</BlueButton>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ApprovePendingShipments;
