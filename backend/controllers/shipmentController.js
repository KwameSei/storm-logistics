import mongoose from "mongoose";
import Shipment from "../models/shipmentSchema.js";
import generateUniquetrackingNumber from "../models/shipmentSchema.js";
import CourierLocation from "../models/courierLocationSchema.js";
import User from "../models/userSchema.js";
import trackingMail from "../utils/trackingMail.js";

// Create a new shipment
export const createShipment = async (req, res) => {
  try {
    const {
      item,
      senderName,
      senderPhone,
      type,
      weight,
      recipientName,
      recipientPhone,
      recipientEmail,
      departureDate,
      origin,
      trackingNumber,
      status,
      destination,
      estimatedDelivery,
      currentLocation,
    } = req.body;
    const userEmail = req.body.senderMail;

    console.log('User Email:', userEmail);
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!userEmail ||!item || !recipientName || !recipientPhone || !departureDate || !origin || !destination || !estimatedDelivery || !currentLocation) {
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
    // const trackingNumber = generateUniquetrackingNumber();

    // Create shipment
    const shipment = new Shipment({
      senderMail: userEmail,
      senderName,
      senderPhone,
      type,
      weight,
      item,
      recipientName,
      recipientPhone,
      recipientEmail,
      departureDate,
      trackingNumber,
      status: 'Pending', // Set default status here
      origin,
      destination,
      estimatedDelivery,
      currentLocation,

    });

    await shipment.save();

    // Send tracking mail with tracking number only
    await trackingMail(shipment.trackingNumber, userEmail);

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

// Get shipment by id
export const getShipmentById = async (req, res) => {
  try {
    const Id = req.params.id;
    const shipment = await Shipment.findById(Id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Shipment not found"
      })
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Shipment successfully retrieved",
      data: shipment
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error"
    })
  }
}

// Get a shipment by trackingNumber
export const getShipmentByTrackingNum = async (req, res) => {
  const trackingId = req.params.trackingId;

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
    // Find the latest location of the courier based on the provided ID
    const shipment = await Shipment.findById(req.params.id);

    if (shipment) {
      shipment.trackingNumber = req.body.trackingNumber || shipment.trackingNumber;
      shipment.status = req.body.status || shipment.status;
      shipment.origin = req.body.origin || shipment.origin;
      shipment.destination = req.body.destination || shipment.destination;
      shipment.departureDate = req.body.departureDate || shipment.departureDate;
      shipment.type = req.body.type || shipment.type;
      shipment.weight = req.body.weight || shipment.weight;
      shipment.senderMail = req.body.senderMail || shipment.senderMail;
      shipment.senderName = req.body.senderName || shipment.senderName;
      shipment.senderPhone = req.body.senderPhone || shipment.senderPhone;
      shipment.recipientEmail = req.body.recipientEmail || shipment.recipientEmail;
      shipment.recipientPhone = req.body.recipientPhone || shipment.recipientPhone;
      shipment.recipientName = req.body.recipientName || shipment.recipientName;
      shipment.estimatedDelivery = req.body.estimatedDelivery || shipment.estimatedDelivery;
      shipment.currentLocation = req.body.currentLocation || shipment.currentLocation;

      const updatedShipment = await shipment.save();
      res.status(200).json(updatedShipment);
    }
  }
  catch (error) {
    res.status(500).json({ message: "Failed to update shipment" });
  }
}

// Track shipment by its tracking number
export const trackShipment = async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    console.log('Tracking Number:', trackingNumber);

    // Find the shipment by tracking number
    const shipment = await Shipment.findOne({ trackingNumber: trackingNumber });
    console.log('Shipment:', shipment);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: `Shipment with tracking number ${trackingNumber} not found!`
      });
    }

    // Extract currentLocation from the shipment
    // const currentLocation = shipment.currentLocation;

    // const shipmentDetails = {
    //   trackingNumber: trackingNumber,
    //   item: shipment.item,
    //   type: shipment.type,
    //   weight: shipment.weight,
    //   recipientName: shipment.recipientName,
    //   recipientPhone: shipment.recipientPhone,
    //   recipientMail: shipment.recipientEmail,
    //   senderMail: shipment.senderMail,
    //   senderName: shipment.senderName,
    //   senderPhone: shipment.senderPhone,
    //   departureDate: shipment.departureDate,
    //   trackingNumber: shipment.trackingNumber,
    //   status: shipment.status,
    //   origin: shipment.origin,
    //   destination: shipment.destination,
    //   estimatedDelivery: shipment.estimatedDelivery,
    //   currentLocation: currentLocation
    // };
    // console.log('Ship details: ', shipmentDetails);

    return res.status(200).json({
      success: true,
      status: 200,
      data: shipment,
      message: "Shipment tracking successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update shipment"
    });
  }
}

// Update the current location of the shipment
export const updateCurrentLocation = async (req, res) => {
  try {
    // Extract the tracking number from the request parameters
    const trackingNumber = req.params.trackingNumber;
    const newLocation = req.body.newLocation;

    console.log('New location', newLocation);

    // Find the shipment by tracking number
    const shipment = await Shipment.findOne({ trackingNumber: trackingNumber });
    console.log('shipment', shipment);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: `Shipment with tracking number ${trackingNumber} not found!`
      });
    }

    // Update the currentLocation field
    shipment.currentLocation = newLocation;

    // Save the updated shipment
    await shipment.save();

    // Return a success response
    return res.status(200).json({
      success: true,
      status: 200,
      message: `Current location for tracking number ${trackingNumber} updated successfully!`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Error updating the current location'
    })
  }
}

// Delete shipment by Id
export const deleteShipmentById = async (req, res) => {
  try {
    const deletedCourier = await Courier.findByIdAndDelete(req.params.id);
    if (!deletedCourier) {
      return res.status(404).json({ message: 'Courier not found.' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting courier by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};