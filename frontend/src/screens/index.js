export { default as Homepage } from './home/Homepage';
export { default as AllServicesDisplay } from './services/AllServicesDisplay';

// USER
export { default as RegisterUser } from './user/auth/RegisterUser';
export { default as RegisterSuperAdmin } from './superAdmin/auth/RegisterSuperAdmin';

// SHIPMENT
export { default as ShipmentService } from './services/ShipmentService';
export { default as TrackShipment } from './shipment/tracking/TrackShipment';
export { default as ShipmentDetails }  from './shipment/tracking/ShipmentDetails';
export { default as UpdateShipmentLocation } from './shipment/tracking/UpdateShipmentLocation';
export { default as CreateShipment } from './shipment/create/CreateShipment';
export { default as ShipmentCreationSuccess } from './shipment/shipmentSuccess/ShipmentCreationSuccess';
export { default as ApprovePendingShipments } from './shipment/shipmentSuccess/ApprovePendingShipments';

// ADMIN / SUPER ADMIN
export { default as SuperAdminDashboard } from './superAdmin/dashboard/SuperAdminDashboard';