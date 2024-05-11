import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { ArrowDropDownRounded, ArrowDropUpOutlined } from "@mui/icons-material";
import { getShipments, getShipmentFailure } from "../../../state-management/shipmentState/shipmentSlice";
import { WaybillTable } from "../../../components";
import classes from "./displayshipments.module.scss";

const GetAllShipments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const shipments = useSelector((state) => state.shipment.shipments);
  console.log("Get all shipments data: ", shipments);
  const shipmentError = useSelector((state) => state.shipment.error);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentUser.data.role);
  console.log("currentRole: ", currentRole);

  const URL = import.meta.env.VITE_SERVER_URL;

  const fetchAllShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URL}/api/shipment/get-all-shipments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const shipmentData = response.data.data;

      if (shipmentData) {
        dispatch(getShipments(shipmentData));
      } else {
        toast.error("No shipments found");
      }
    } catch (error) {
      console.error("Error fetching all shipments: ", error);
      toast.error("Error fetching shipments");
      dispatch(getShipmentFailure("Error fetching shipments"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch shipments if token is available
    if (token) {
      fetchAllShipments();
    }
  }, [token]);

  const shipmentColumns = [
    {
      id: "trackingNumber",
      label: "Tracking Number",
      minWidth: 170,
      align: "left",
    },
    {
      id: "senderName",
      label: "Sender Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "recipientName",
      label: "Recipient Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
      align: "left",
    },
    {
      id: "currentLocation",
      label: "Current Location",
      minWidth: 170,
      align: "left",
      format: (value) => `${value.country}, ${value.city}`,
    },
    {
      id: "estimatedDelivery",
      label: "Estimated Delivery",
      minWidth: 170,
      align: "left",
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const shipmentData = shipments.data || shipments;
  console.log("Shipment data 2: ", shipmentData);

  const shipmentRows = shipmentData.map((shipment) => ({
    id: shipment._id,
    trackingNumber: shipment.trackingNumber,
    senderName: shipment.senderName,
    recipientName: shipment.recipientName,
    status: shipment.status,
    currentLocation: `${shipment.currentLocation.country}, ${shipment.currentLocation.city}`,
    estimatedDelivery: shipment.estimatedDelivery,
  }));

  const handleAction = (action, id) => {
    if (action === "waybill") {
      navigate(
        `/${currentRole.toLowerCase()}-dashboard/waybill/${id}`
      );
    } else if (action === "delete") {
      // Implement delete logic here
    }
  };

  const options = ["All Shipments", "View", "Delete"];

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  return (
    <>
      {loading && <h2>Loading...</h2>}
      {shipmentError && <h2>{shipmentError}</h2>}
      {shipments && shipments.length > 0 && (
        <>
          <h2>All Shipments</h2>
          <div className={classes.display_shipments}>
            <ButtonGroup
              variant="contained"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button onClick={() => handleMenuItemClick(null, 0)}>
                {options[selectedIndex]}
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={() => setOpen((prevOpen) => !prevOpen)}
              >
                {open ? <ArrowDropUpOutlined /> : <ArrowDropDownRounded />}
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                      <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          <WaybillTable
            columns={shipmentColumns}
            rows={shipmentRows}
            handleAction={handleAction}
          />
        </>
      )}
    </>
  );
};

export default GetAllShipments;
