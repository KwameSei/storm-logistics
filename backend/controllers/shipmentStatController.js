import ShipmentStat from "../models/shipmentStatSchema.js";

// Create and Save a new ShipmentStat
export const createShipmentStat = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a ShipmentStat
  const shipmentStat = new ShipmentStat({
    shipmentId: req.body.shipmentId,
    yearly_sales_total: req.body.yearly_sales_total,
    yearly_total_sold_units: req.body.yearly_total_sold_units,
    year: req.body.year,
    monthly_data: req.body.monthly_data,
    daily_data: req.body.daily_data,
    hourly_data: req.body.hourly_data
  });

  // Save ShipmentStat in the database
  shipmentStat
    .save(shipmentStat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the ShipmentStat."
      });
    });
};

// Retrieve all ShipmentStats from the database.
export const findAllShipmentStats = (req, res) => {
  const shipmentId = req.query.shipmentId;
  var condition = shipmentId ? { shipmentId: { $regex: new RegExp(shipmentId), $options: "i" } } : {};

  ShipmentStat.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving shipmentStats."
      });
    });
};

// Find a single ShipmentStat with an id
export const findOneShipmentStat = (req, res) => {
  const id = req.params.id;

  ShipmentStat.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with id=" + id });
    });
};

// Update a ShipmentStat by the id in the request
export const updateShipmentStat = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  ShipmentStat.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update ShipmentStat with id=${id}. Maybe ShipmentStat was not found!`
        });
      } else res.send({ message: "ShipmentStat was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ShipmentStat with id=" + id
      });
    });
};

// Delete a ShipmentStat with the specified id in the request
export const removeShipmentStat = (req, res) => {
  const id = req.params.id;

  ShipmentStat.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete ShipmentStat with id=${id}. Maybe ShipmentStat was not found!`
        });
      } else {
        res.send({
          message: "ShipmentStat was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ShipmentStat with id=" + id
      });
    });
}

// Delete all ShipmentStats from the database.
export const removeAllShipmentStats = (req, res) => {
  ShipmentStat.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} ShipmentStats were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all shipmentStats."
      });
    });
};

// Find all ShipmentStats with a specific shipmentId
export const findAllByShipmentId = (req, res) => {
  const shipmentId = req.params.shipmentId;

  ShipmentStat.find({ shipmentId: shipmentId })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with shipmentId " + shipmentId });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with shipmentId=" + shipmentId });
    });
}

// Find all ShipmentStats with a specific year
export const findAllByYear = (req, res) => {
  const year = req.params.year;

  ShipmentStat.find({ year: year })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with year " + year });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with year=" + year });
    });
}

// Find all ShipmentStats with a specific month
export const findAllByMonth = (req, res) => {
  const month = req.params.month;

  ShipmentStat.find({ "monthly_data.month": month })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with month " + month });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with month=" + month });
    });
}

// Find all ShipmentStats with a specific date
export const findAllByDate = (req, res) => {
  const date = req.params.date;

  ShipmentStat.find({ "daily_data.date": date })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with date " + date });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with date=" + date });
    });
}

// Find all ShipmentStats with a specific hour
export const findAllByHour = (req, res) => {
  const hour = req.params.hour;

  ShipmentStat.find({ "hourly_data.hour": hour })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found ShipmentStat with hour " + hour });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving ShipmentStat with hour=" + hour });
    });
}