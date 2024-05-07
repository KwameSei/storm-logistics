  import { useEffect, useRef, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router-dom";
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import { getError, getUser } from "../../../state-management/userState/userSlice";

  import classes from './display.module.scss';

  const UserProfile = () => {
    const { id } = useParams();
    console.log('User id', id);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useSelector((state) => state.user.user);
    console.log('user', user);
    const token = useSelector((state) => state.user.token);
    const URL = import.meta.env.VITE_SERVER_URL;

    // Fetch user
    const fetchUser = async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${URL}/api/users/get-user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('response', response);

          const userData = response.data.data;
          console.log('userData', userData);
          
          dispatch(getUser(userData));
          setLoading(false);
      } catch (error) {
          toast(error.message);
          setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Super Admin
    const fetchSuperAdmin = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/api/superadmin/get-single-superadmin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        const superAdminData = response.data.data;

        dispatch(getUser(superAdminData));
        setLoading(false);
      } catch (error) {
        toast(error.message)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      if (id) {
        fetchUser();
        fetchSuperAdmin();
      }
    }, [id]);

    return (
      <div className="user-profile">
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          user && user.name ? (
            <div className={classes.profile}>
              <h2>User Profile</h2>
              <div>
                <strong>Name:</strong> {user.name || user.username} 
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
            </div>
          ) : (
            <div className={classes.profile}>
              <h2>User Profile</h2>
              <div>
                <strong>Name:</strong> {user?.username} 
              </div>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Role:</strong> {user?.role}
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  export default UserProfile;