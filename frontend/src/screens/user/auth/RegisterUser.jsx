import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import { CircularProgress, DialogActions, DialogContent, DialogContentText, IconButton, Input, InputAdornment, TextField } from "@mui/material";
import { BlueButton } from "../../../components/ButtonStyled";
import { authSuccess, underControl } from "../../../state-management/userState/userSlice";

import classes from './userRegister.module.scss';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterUser = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [title, setTitle] = useState('Login')
  const [toggle, setToggle] = useState(false);
  // const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [address, setAddress] = useState('');
  // const [phone, setPhone] = useState('');

  const currentUser = useSelector((state) => state.user.currentUser);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const token = useSelector((state) => state.user.token);

  const URL = import.meta.env.VITE_SERVER_URL;

  const isLoggedIn = !isRegistered

  // Use useEffect to change the title of the page
  useEffect(() => {
    setTitle(isRegistered ? 'Register' : 'Login');
  }, [isRegistered]);

  const role = 'User';

  const fields = {
    username,
    email,
    password,
    confirmPassword,
    role
  }

  // Register User
  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/api/users/register-user/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });
      console.log('API response', res);

      const user = res.data;
      console.log('User', user);

      dispatch(authSuccess(user));
      setLoading(false);
      toast.success('User registered successfully');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${URL}/api/users/login-user/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });

      const user = res.data;
      console.log('User', user);

      dispatch(authSuccess(user));
      setLoading(false);
      toast.success('User logged in successfully');
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistered) {
      registerUser(e);
    } else {
      loginUser(e);
    }
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
          required
          className={classes.form_input}
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
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
        {isRegistered && (
          <>
          <TextField
            required
            className={classes.form_input}
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            className={classes.form_input}
            id="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type={toggle ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          </>
        )}

        {/* Remember me and forgotten passwoed checkboxes */}
        <DialogActions
          className={classes.actions}
          // sx={{
          //   display: 'flex',
          //   justifyContent: 'left',
          //   alignItems: 'center'
          // }}
        >
          {isLoggedIn && (
            <>
              <div className={classes.remember_me}>
                <input type="checkbox" name="remember" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className={classes.forgot_password}>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </>
          )}
        </DialogActions>
        <BlueButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress color="primary" size={24} /> : title}
        </BlueButton>
        <div className={classes.register}>
          <p>
            {isRegistered ? 'Already have an account?' : 'Don\'t have an account?'}
            <span
              className={classes.link}
              onClick={() => setIsRegistered(!isRegistered)}
            >
              {isRegistered ? 'Login' : 'Register'}
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterUser;