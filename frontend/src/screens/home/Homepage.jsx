// import react from 'react';
import { ArrowRightAlt } from "@mui/icons-material";
import { CarouselImages } from "../../components";
// import { AllServicesDisplay } from "../index";
import classes from './Homepage.module.scss';
// import { Button } from "@mui/material";
import { BlueButton } from "../../components/ButtonStyled";
import CargoShip2 from "../../assets/images/cargo-ship2.jpg";
import CargoPlane from "../../assets/images/cargo-plane.jpg";
import CargoTruck from "../../assets/images/cargo-truck.jpg";
import { Link } from "react-router-dom";
import CredibilityPage from "./credibility/CredibilityPage";

const Homepage = () => {
  return (
    <div className={classes.homepage}>
      <CarouselImages />
      <div className={classes.homepage_content}>
        <div className={classes.services_main}>
          <div className={classes.services_text}>
            <h1 className={classes.heading}>
              <span>shipping</span> to & from anywhere
            </h1>
            <p className={classes.sub_heading}>
              From booking to communications, to payment: Storm Logistics helps you transport freight faster, cheaper, safer, <br /> and easier, so you can stay focused on your business 
            </p>
          </div>
          <div className={classes.service_content}>
            <div className={classes.service}>
              <img src={CargoShip2} alt="cargo ship" className={classes.service_background} />
              <div className={classes.service_overlay}>
                <span>By Sea</span>
                <p className={classes.service_text}>Sea container delivery was the first shipping...</p>
                <p className={classes.more}>read more <ArrowRightAlt /></p>
              </div>
              <div className={classes.service_icon}></div>
            </div>
            <div className={classes.service}>
              <img src={CargoPlane} alt="cargo ship" className={classes.service_background} />
              <div className={classes.service_overlay}>
                <span>By Air</span>
                <p className={classes.service_text}>Sea container delivery was the first shipping...</p>
                <p className={classes.more}>read more <ArrowRightAlt /></p>
              </div>
              <div className={classes.service_icon}></div>
            </div>
            <div className={classes.service}>
              <img src={CargoTruck} alt="cargo ship" className={classes.service_background} />
              <div className={classes.service_overlay}>
                <span>By Land</span>
                <p className={classes.service_text}>Sea container delivery was the first shipping...</p>
                <p className={classes.more}>read more <ArrowRightAlt /></p>
              </div>
              <div className={classes.service_icon}></div>
            </div>
          </div>
          <div className={classes.service_button}>
            <Link to='/all-services-display'>
              <BlueButton>view all services</BlueButton>
            </Link>
          </div>
        </div>
      </div>

      <CredibilityPage />
    </div>
  );
};

export default Homepage;