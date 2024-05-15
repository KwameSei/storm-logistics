import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
import { CircularProgress, DialogActions, DialogContent, DialogContentText, IconButton, Input, InputAdornment, TextField } from "@mui/material";
import { BlueButton } from "../../../components/ButtonStyled";
import { CountryDropdown } from "../../../components";
import { authSuccess, underControl } from "../../../state-management/userState/userSlice";

import classes from '../../../components/styles/auth.module.scss';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterAgent = ({ situation }) => {
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
  const [country, setCountry] = useState({country: '', state: ''});
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  // const [address, setAddress] = useState('');
  // const [phone, setPhone] = useState('');

  const currentUser = useSelector((state) => state.user?.currentUser);
  console.log('Current user in agent component: ', currentUser);
  const currentRole = currentUser?.data?.role;
  console.log(`Current role in agent component: ${currentRole}`)
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const token = currentUser?.token;
  console.log('Token in agent component: ', token);
  const role = 'Agent';

  const URL = import.meta.env.VITE_SERVER_URL;

  const isLoggedIn = !isRegistered

  // Use useEffect to change the title of the page
  useEffect(() => {
    setTitle(isRegistered ? 'Register' : 'Login');
  }, [isRegistered]);

  const fields = {
    username,
    email,
    password,
    country,
    confirmPassword,
    role
  }

  // Register Agent
  const registerAgent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (username === '' || username === null || username === undefined || username.length < 3 || username.length > 50) {
      setUsernameError(true);
      setLoading(false);
      return toast.error('Username is required and must be between 3 and 50 characters');
    } else {
      setUsernameError(false);
    }

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

    if (confirmPassword === '' || confirmPassword === null || confirmPassword === undefined || confirmPassword.length < 3 || confirmPassword.length > 50) {
      setConfirmPasswordError(true);
      setLoading(false);
      return toast.error('Confirm password is required and must be between 3 and 20 characters');
    } else {
      setConfirmPasswordError(false);
    }

    try {
      const res = await axios.post(`${URL}/api/agent/register-agent/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });
      console.log('API response', res);

      const agent = res.data;
      console.log('Agent', agent);

      console.log('Token', agent.token);
      
      // Store the token in the local storage
      if (agent.token) {
        localStorage.setItem('token', agent.token);
      }

      dispatch(authSuccess(agent));
      setLoading(false);
      toast.success('Agent registered successfully');
      // navigate('/agent-dashboard/dashboard');
      navigate('/agent-creation-success');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }

  const loginAgent = async (e) => {
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
      const res = await axios.post(`${URL}/api/agent/login-agent/${role}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` || `Bearer ${currentUser.token || ''}`
        },
      });
  
      const agent = res.data;
  
      // Check if the agent is approved by the admin
      if (agent.approvedByAdmin === false) {
        toast.error('Your account has not been approved by admin yet.');
        setLoading(false);
        return;
      }
  
      // Extract the token from the response
      // const token = res.data.token;
  
      // Extract the role from the response
      const agentRole = agent.role;
  
      console.log('Token', agent.token);
      
      // Store the token in the local storage
      if (agent.token) {
        localStorage.setItem('token', agent.token);
      }
      localStorage.setItem('currentRole', agentRole);
  
      dispatch(authSuccess(agent, agentRole));
      setLoading(false);
      toast.success('Agent logged in successfully');
      navigate('/agent-dashboard/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };    

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistered) {
      registerAgent(e);
    } else {
      loginAgent(e);
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

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
  }

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
        {isRegistered && (
          <>
          <TextField
            error={confirmPasswordError}
            helperText={confirmPasswordError && 'Password confirmation must be the same as the password entered'}
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
          <TextField
            error={usernameError}
            helperText={usernameError && 'Name must be between 3 and 50 characters'}
            required
            className={classes.form_input}
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <CountryDropdown
            error={countryError}
            helperText={countryError && 'Country is required'}
            required
            className={classes.form_input}
            id="country"
            label="Country"
            variant="outlined"
            value={country}
            onChange={handleCountryChange}
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

export default RegisterAgent;