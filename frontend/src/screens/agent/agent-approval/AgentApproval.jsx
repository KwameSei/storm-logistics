import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import classes from "./agent_approval.module.scss";
import { BlueButton } from "../../../components/ButtonStyled";

const AgentApproval = () => {
  const [agents, setAgents] = useState([]);

  const currentUser = useSelector(state => state.user.currentUser);
  // const token = localStorage.getItem("token");
  const token = currentUser?.token;
  const URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  const fetchPendingAgents = async () => {
    try {
      const response = await axios.get(`${URL}/api/agent/pending-agents`, {
        headers: {
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });
      console.log("Pending agents:", response.data.data); // Log the pending shipments for debugging

      const PendingData = response.data.data.filter(agent => agent.status !== "Approved");
      toast.success("Pending agents waiting for approval fetched successfully!");

      setAgents(PendingData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pending shipments");
    }
  }

  const approveAgent = async (id, email) => {
    try {
      const response = await axios.put(
        `${URL}/api/agent/approve-agent/${id}`,
        {
          approvedByAdmin: true,
          status: "Approved",
          email: email, // Add the user's email address
        },
        {
          headers: {
            Authorization: `Bearer ${token}` || `Bearer ${currentUser.token || ""}`,
          },
        }
      );
      console.log("Approved agent:", response.data.data); // Log the approved agent for debugging
      
      // Save token to local storage
      localStorage.setItem("token", response.data.token);
      // Update the local state with the new list of pending shipments
      fetchPendingAgents();
      toast.success(response.data.message || "Agent approved successfully");
  
      // Remove the approved agent from the local state
      setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve Agent");
    }
  };  

  return (
    <div className={classes.approve}>
      <div className={classes.approve_container}>
        <h1>Pending Agents</h1>
        <ul className={classes.unordered_list}>
          {agents.map((agent) => {
            console.log("Agent ID:", agent._id); // Log the ID for debugging
            return (
              <li className={classes.list} key={agent._id}>
                <div className={classes.list_container}>
                  <span><h3>Name:</h3> <p>{agent.username}</p></span>
                  <span><h3>Email:</h3> <p>{agent.email}</p></span>
                  <span><h3>Country:</h3> <p>{agent.country}</p></span>
                  <span><h3>Status:</h3> <p>{agent.status}</p></span>
                </div>
                <BlueButton onClick={() => approveAgent(agent._id, agent.userMail)}>Approve</BlueButton>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AgentApproval;
