import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from 'toast';
import { getError, getUser } from "../../../state-management/userState/userSlice";

import './displayusers.module.scss';

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user.user);
  console.log('user', user);
  const token = useSelector((state) => state.user.token);
  const URL = import.meta.env.VITE_SERVER_URL;

  const fetchUser = async () => {
    try {
        setLoading(true);
        const response = await axios.get(`${URL}/api/users/get-user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('response', response);

        const userData = response.data;
        console.log('userData', userData);
        
        dispatch(getUser(userData));
        setLoading(false);
    } catch (error) {
        setError(error.response.data.message);
        setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="user-profile">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <div>
          <h2>User Profile</h2>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> {user.isAdmin ? 'Admin' : 'User'}
          </div>
        </div>
        )}
    </div>
  );
};