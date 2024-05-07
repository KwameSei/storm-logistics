import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import { authLogout } from '../../../state-management/userState/userSlice';
import classes from './display.module.scss';
import { VisibilityOutlined } from '@mui/icons-material';

const ProfileModal = ({ profile, show, onHide }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentRole = useSelector((state) => state.user?.currentUser?.data?.role);
  const id = useSelector((state) => state.user.currentUser?.data?._id);
  console.log('User Id: ', id)
  console.log('Navbar current role', currentRole);
  console.log('Navbar current user', currentUser);

  // Logout user
  const logoutUser = () => {
    dispatch(authLogout());
    navigate('/home');
  };

  return (
    <Modal show={show} className={classes.modal_container}>
      <Modal.Header className={classes.modal_header}>
        <Modal.Title className={classes.modal_title}>
          {profile.name}
        </Modal.Title>
        <CloseButton onClick={onHide} className={classes.header_close}>X</CloseButton>
      </Modal.Header>
      <Modal.Body className={classes.modal_body}>
        {/* <div>
          <strong>Name:</strong> {profile.name || profile.username}
        </div>*/}
        <div className={classes.name_image}>
          {profile.image ? (
            <img src={profile.image} alt='User' className={classes.user_image} />
          ) : (
            <div className={classes.username}>
              {profile.name ? profile.name[0].toUpperCase() : profile.username[0]}
            </div>
          )}
        </div>
        <div className={classes.text}>
          <span>Name:</span> {profile.name || profile.username}
        </div>
        <div className={classes.text}>
          <span>Email:</span> {profile.email}
        </div>
        <div className={classes.text}>
          <span>Role:</span> {profile.role}
        </div>

        <div className={classes.profile_link}>
          <Link to={`/${profile.role.toLowerCase()}-dashboard/get-user/${id}`} className={classes.link}>
            <VisibilityOutlined /> <span>Profile</span>
          </Link>
        </div>

        <div className={classes.logout} onClick={logoutUser}>
          Logout
        </div>
      </Modal.Body>
      <Modal.Footer className={classes.modal_footer}>
        <Button variant='secondary' onClick={onHide} className={classes.footer_close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;