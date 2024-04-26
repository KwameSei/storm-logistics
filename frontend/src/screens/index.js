export { default as Homepage } from './home/Homepage';
export { default as AllServicesDisplay } from './services/AllServicesDisplay';

// USER
export { default as RegisterUser } from './user/auth/RegisterUser';
export { default as UserDashboard } from './user/dashboard/UserDashboard';
export { default as DashboardUser } from './user/dashboard/DashboardUser';
export { default as GetAllUsers } from './user/display/GetAllUsers';
export { default as GetSingleUser } from './user/display/GetSingleUser';

// SHIPMENT
export { default as ShipmentService } from './services/ShipmentService';
export { default as TrackShipment } from './shipment/tracking/TrackShipment';
export { default as ShipmentDetails }  from './shipment/tracking/ShipmentDetails';
export { default as UpdateShipmentLocation } from './shipment/tracking/UpdateShipmentLocation';
export { default as CreateShipment } from './shipment/create/CreateShipment';
export { default as ShipmentCreationSuccess } from './shipment/shipmentSuccess/ShipmentCreationSuccess';
export { default as ApprovePendingShipments } from './shipment/shipmentSuccess/ApprovePendingShipments';
export { default as GetAllShipments } from './shipment/display/GetAllShipments';

// PAYMENT
export { default as CheckOut } from './payment/CheckOut';
export { default as PaymentCallback } from './payment/PaymentCallback';
export { default as PaymentSuccess } from './payment/PaymentSuccess';
export { default as GetAllPayments } from './payment/GetAllPayments';
export { default as GetSinglePayment } from './payment/GetSinglePayment';

// ADMIN / SUPER ADMIN
export { default as RegisterSuperAdmin } from './superAdmin/auth/RegisterSuperAdmin';
export { default as SuperAdminDashboard } from './superAdmin/dashboard/SuperAdminDashboard';
export { default as Dashboard } from './superAdmin/dashboard/Dashboard';

// ICUMS
export { default as CreateIcums } from './icums/create/CreateIcums';

// QUOTE
export { default as GetAQuote } from './quote/GetAQuote';

// DOCUMENTS
export { default as Waybill } from './shipment/documents/Waybill';

// 404
export { default as Four04 } from './404';