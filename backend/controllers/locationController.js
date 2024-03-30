import Location from "../models/locationSchema.js";

// Create a new location
export const createLocation = async () => {
  try {
    const reqBody = req.body;
    const newLocation = await Location.create(reqBody);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Location successfully created',
      data: newLocation
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Get all locations
export const getAllLocations = async () => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Get location by ID
export const getLocationById = async () => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Update location by ID
export const updateLocationById = async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error('Error updating location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete location by ID
export const deleteLocationById = async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting location by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};