import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import { CircularProgress, DialogActions, DialogContent, DialogContentText, IconButton, Input, InputAdornment, TextField } from "@mui/material";
import { BlueButton } from "../../../components/ButtonStyled";
import { authSuccess, underControl } from "../../../state-management/userState/userSlice";

import classes from '../../../components/styles/auth.module.scss';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginAdmin = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Login');
  const [toggle, setToggle] = useState(false);
  // const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // const [address, setAddress] = useState('');
  // const [phone, setPhone] = useState('');

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentRole = currentUser?.data?.role;
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const token = useSelector((state) => state.user.token);
  const role = 'Admin';

  const URL = import.meta.env.VITE_SERVER_URL;

  // Use useEffect to change the title of the page
  // useEffect(() => {
  //   setTitle(isRegistered ? 'Register' : 'Login');
  // }, [isRegistered]);

  const fields = {
    email,
    password,
    role
  }

  const loginAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === '' || email === null || email === undefined || email.length < 3 || email.length > 50) {
      setEmailError(true);
      setLoading(false);
      return toast.error('Email is required and must be between 3 and 50 characters');
    } else {
      setEmailError(false);
    }

    if (password === '' || password === null || password === undefined || password.length < 3 || password.length > 50) {
      setPasswordError(true);
      setLoading(false);
      return toast.error('Password is required and must be between 3 and 20 characters');
    } else {
      setPasswordError(false);
    }

    try {
      const res = await axios.post(`${URL}/api/admin/login-admin/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });

      if (res.data.success) {
        // Extract the token from the response
        const token = res.data.token

        // Extract the role from the response
        const adminRole = res.data.data?.role;
        console.log('userRole: ', adminRole)
        

        // Store the token and role in the local storage
        localStorage.setItem('token', token);
        localStorage.setItem('currentRole', currentRole)

        const admin = res.data;
        console.log('Admin', admin);

        dispatch(authSuccess(admin, adminRole));
        setLoading(false);
        toast.success('User logged in successfully');
        navigate('/admin-dashboard/dashboard');
      } else {
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(e);
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate(-1);
    } else if (status === 'failed') {
      toast.error(error.message)
    } else if (status === 'error') {
      toast.error(error.message)
    }
  }, [ status, dispatch, navigate, error ]);

  return (
    <div className={classes.register_user}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <h2>{title}</h2>
        <TextField
          error={emailError}
          helperText={emailError && 'Email must be between 3 and 50 characters'}
          required
          className={classes.form_input}
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          error={passwordError}
          helperText={passwordError && 'Password must be between 6 and 20 characters'}
          required
          className={classes.form_input}
          id="password"
          label="Password"
          type={toggle ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label="toggle password visibility"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setToggle(!toggle)}
                >
                  {toggle ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Remember me and forgotten passwoed checkboxes */}
        <DialogActions
          className={classes.actions}
          // sx={{
          //   display: 'flex',
          //   justifyContent: 'left',
          //   alignItems: 'center'
          // }}
        >
          <div className={classes.remember_me}>
            <input type="checkbox" name="remember" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div className={classes.forgot_password}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </DialogActions>
        <BlueButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress color="primary" size={24} /> : title}
        </BlueButton>
      </form>
    </div>
  )
}

export default LoginAdmin;