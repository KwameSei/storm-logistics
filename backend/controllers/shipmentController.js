import mongoose from "mongoose";
import generateTrackingNumber from "../models/shipmentSchema.js";
import Shipment from "../models/shipmentSchema.js";
import User from "../models/userSchema.js";
import trackingMail from "../utils/trackingMail.js";

// Create a new shipment
export const createShipment = async (req, res) => {
  try {
    const {item, recipientName, recipientPhone, departureDate, origin, destination, userId, estimatedDelivery, location } = req.body;
    const userEmail = req.body.senderMail;

    console.log('User Email:', userEmail);
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!userEmail ||!item || !recipientName || !recipientPhone || !departureDate || !origin || !destination || !estimatedDelivery || !location) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All required fields must be provided" 
      });
    }

    // Ensure database connection is established
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database connection error" });
    }

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Create shipment
    const shipment = new Shipment({
      senderMail: userEmail,
      item,
      recipientName,
      recipientPhone,
      departureDate,
      trackingNumber,
      status: 'Pending', // Set default status here
      origin,
      destination,
      userId,
      estimatedDelivery,
      location
    });

    await shipment.save();

    // Send tracking mail with tracking number only
    await trackingMail(trackingNumber, userEmail);

    res.status(201).json({
      success: true,
      status: 201,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to create shipment" 
    });
  }
};

// Get all shipments
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get shipments" });
  }
};

// Get a shipment by trackingNumber
export const getShipmentByTrackingNum = async (req, res) => {
  const trackingId = req.params.trackingNumber;

  try {
    const shipment = await Shipment.find({ trackingId }).populate('status');

    if (!shipment) {
      res.status(404).json({
        success: false,
        status: 404,
        message: "Shipment not found"
      });
    }

    const shipmentDetails = {
      item: shipment.item,
      recipientName: shipment.recipientName,
      recipientPhone: shipment.recipientPhone,
      departureDate: shipment.departureDate,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      userId: shipment.userId,
      estimatedDelivery: shipment.estimatedDelivery,
      location: shipment.location
    };

    res.status(200).json({
      success: true,
      status: 200,
      data: shipmentDetails,
      message: 'Shipment found'
    });
  }
  catch (error) {
    res.status(500).json({ message: "Failed to get shipment" });
  }
}

// Update a shipment by ID
export const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (shipment) {
      shipment.trackingNumber = req.body.trackingNumber || shipment.trackingNumber;
      shipment.status = req.body.status || shipment.status;
      shipment.origin = req.body.origin || shipment.origin;
      shipment.destination = req.body.destination || shipment.destination;
      shipment.userId = req.body.userId || shipment.userId;
      shipment.estimatedDelivery = req.body.estimatedDelivery || shipment.estimatedDelivery;
      shipment.location = req.body.location || shipment.location;

      const updatedShipment = await shipment.save();
      res.status(200).json(updatedShipment);
    }
  }
  catch (error) {
    res.status(500).json({ message: "Failed to update shipment" });
  }
}