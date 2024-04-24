import Icums from "../models/icumsSchema.js";
import Shipment from "../models/shipmentSchema.js";

// Function to create a new HS code
export const createIcums = async (req, res) => {
  try {
    const { hs_code, description, hs_head_code, qty_unit_code, import_duty_rate, import_duty_vat, import_duty_excise, export_duty_rate, nhil_rate } = req.body;

    // Check if the HS code already exists
    const existingIcums = await Icums.findOne({ hs_code });

    if (existingIcums) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'HS code already exists'
      });
    }

    // Create a new HS code
    const newIcums = new Icums({
      hs_code,
      description,
      hs_head_code,
      qty_unit_code,
      import_duty_rate,
      import_duty_vat,
      import_duty_excise,
      export_duty_rate,
      nhil_rate
    });

    // Save the new HS code
    await newIcums.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'HS code created successfully',
      data: newIcums
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to get all HS codes
export const getAllIcums = async (req, res) => {
  try {
    const icums = await Icums.find();  

    if (!icums) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'No HS codes found'
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'All HS codes fetched successfully',
      data: icums
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to get a single HS code
export const getSingleIcums = async (req, res) => {
  try {
    const { hsCode } = req.params;

    const icums = await Icums.findOne({ hs_code: hsCode });

    if (!icums) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'HS code not found'
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'HS code fetched successfully',
      data: icums
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to update an HS code
export const updateIcums = async (req, res) => {
  try {
    const { hsCode } = req.params;

    const icums = await Icums.findOne({ hs_code: hsCode });

    if (!icums) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'HS code not found'
      });
    }

    await Icums.findByIdAndUpdate(hsCode, req.body, { new: true });

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'HS code updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to delete an HS code
export const deleteIcums = async (req, res) => {
  try {
    const { hsCode } = req.params;

    const icums = await Icums.findOne({ hs_code: hsCode });

    if (!icums) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'HS code not found'
      });
    }

    await Icums.findByIdAndDelete(hsCode);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'HS code deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Function to calculate the total duty payable
// export const calculateImportDuty = async (cifValue, hs_code) => {
//   // console.log('cifValue', cifValue);
//   // console.log('HS Code', hs_code);
//   try {
//     // Retrieve HS code data from ICUMS database
//     const hsData = await Icums.findOne({ hs_code });
//     console.log('HS Data', hsData);

//     if (!hsData) {
//       return {
//         success: false,
//         status: 404,
//         message: 'HS code not found'
//       };
//     }

//   // Calculate import duty based on the CIF value and import duty rate
//   const importDuty = (cifValue * hsData.import_duty_rate) / 100;  // Import duty
//   console.log('Import duty', importDuty)

//   // Calculate VAT based on the sum of CIF value and import duty
//   const vat = ((cifValue + importDuty) * hsData.import_duty_vat) / 100;

//   // Calculate NHIL rate (assuming it is a percentage)
//   const nhil = (cifValue * hsData.nhil_rate) / 100;

//   // Calculate other duties and charges (assuming 12% of CIF value)
//   const otherDutiesAndCharges = cifValue * 0.12;

//   // Calculate total cost
//   const totalDutyCost = cifValue + importDuty + vat + nhil + otherDutiesAndCharges;

//   return {
//     success: true,
//     status: 200,
//     message: 'Duty calculated successfully',
//     data: {
//       importDuty,
//       vat,
//       nhil,
//       otherDutiesAndCharges,
//       totalDutyCost
//     }};
//   } catch (error) {
//     return {
//       success: false,
//       status: 500,
//       message: error.message
//     };
//   }
// }

// Function to calculate the total duty payable
// export const calculateExportDuty = async (fobValue, hs_code) => {
//   try {
//     // Retrieve HS code data from ICUMS database
//     const hsData = await Icums.findOne({ hs_code });

//     if (!hsData) {
//       return {
//         success: false,
//         status: 404,
//         message: 'HS code not found'
//       };
//     }

//   // Calculate export duty based on the FOB value and export duty rate
//   const exportDuty = (fobValue * hsData.export_duty_rate) / 100;  // Export duty

//   return {
//     success: true,
//     status: 200,
//     message: 'Duty calculated successfully',
//     data: {
//       exportDuty
//     }};
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// // Function to calculate the total duty payable
// export const calculateNHIL = async (cifValue, hs_code) => {
//   try {
//     // Retrieve HS code data from ICUMS database
//     const hsData = await Icums.findOne({ hs_code });

//     if (!hsData) {
//       return {
//         success: false,
//         status: 404,
//         message: 'HS code not found'
//       };
//     }

//   // Calculate NHIL based on the CIF value and NHIL rate
//   const nhil = (cifValue * hsData.nhil_rate) / 100;  // NHIL

//   return {
//     success: true,
//     status: 200,
//     message: 'NHIL calculated successfully',
//     data: {
//       nhil
//     }};
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }