import CourierLocation from "../models/courierLocationSchema.js";

// Create a new shipment / courier location
export const createShipmentLocation = async () => {
  try {
    const newCourierLocation = await CourierLocation.create(req.body);

    res.status(201).json({
      success: true,
      status: 201,
      data: newCourierLocation
  });
  } catch (error) {
    console.error('Error creating courier location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Get all shipment locations
export const getAllShipmentLocations = async () => {
  try {
    const courierLocations = await CourierLocation.find();
    res.status(200).json({
      success: true,
      status: 201,
      message: 'Shipment locations successfully fetched'
    });
  } catch (error) {
    console.error('Error fetching courier locations:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Get shipment location by id
export const getShipmentLocationById = async () => {
  try {
    const Id = req.params.id
    const shipmentLocation = await CourierLocation.findById(Id);

    if (!shipmentLocation) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Courier location not found.'
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      shipmentLocation
    });
  } catch (error) {
    console.error('Error fetching courier location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Update shipment location by id
export const updateShipmentLocationById = async () => {
  try {
    const Id = req.params.id;
    const reqBody = req.body;

    const updatedCourierLocation = await CourierLocation.findByIdAndUpdate(Id, reqBody, { new: true });

    if (!updatedCourierLocation) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Courier location not found.'
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Shipment location successfully updated',
      data: updatedCourierLocation
    });
  } catch (error) {
    console.error('Error updating courier location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Delete shipment location by id
export const deleteShipmentLocationById = async () => {
  try {
    const Id = req.params.id;

    const deletedCourierLocation = await CourierLocation.findByIdAndDelete(Id);

    if (!deletedCourierLocation) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Courier location not found.'
      });
    }

    res.status(204).json({
      success: false,
      status: 204,
      message: 'Shipment location successfully updated'
    });
  } catch (error) {
    console.error('Error deleting courier location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}