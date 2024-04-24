import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getUser, getError } from "../../../state-management/userState/userSlice";
import classes from "./displayusers.module.scss";

const GetSingleUser = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector(state => state.user.user);
  console.log("User: ", user);
  const userError = useSelector(state => state.user.error);
  const token = useSelector(state => state.user.token);
  const URL = import.meta.env.VITE_SERVER_URL;

  const fetchSingleUser = async () => {
    try {
      const response = await axios.get(`${URL}/api/users/get-user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        toast.success(response.data.message);
        dispatch(getUser(response.data.data));
      } else {
        toast.error("No user found");
      }
    } catch (error) {
      dispatch(getError(error.message));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSingleUser();
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>; // Render loading indicator until user data is fetched
  }

  return (
    <div className={classes.single_user}>
      <div className={classes.user_inner}>
        <h1>User Details</h1>
        {userError && <div className={classes.error}>{userError}</div>}
        <div className={classes.user_details}>
          <div className={classes.user_item}>
            <h3>User ID:</h3>
            <span>{user._id}</span>
          </div>
          <div className={classes.user_item}>
            <h3>Username: </h3>
            <span>{user.username}</span>
          </div>
          <div className={classes.user_item}>
            <h3>Email: </h3>
            <span>{user.email}</span>
          </div>
          <div className={classes.user_item}>
            <h3>Role: </h3>
            <span>{user.role}</span>
          </div>
          <div className={classes.user_item}>
            <h3>Created At: </h3>
            <span>{new Date(user.createdAt).toDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSingleUser;