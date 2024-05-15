export { default as Homepage } from './home/Homepage';
export { default as AllServicesDisplay } from './services/AllServicesDisplay';

// USER
export { default as RegisterUser } from './user/auth/RegisterUser';
export { default as UserDashboard } from './user/dashboard/UserDashboard';
export { default as DashboardUser } from './user/dashboard/DashboardUser';
export { default as GetAllUsers } from './user/display/GetAllUsers';
export { default as GetSingleUser } from './user/display/GetSingleUser';
export { default as UserGeography } from './user/geography/UserGeography';

// AGENT
export { default as RegisterAgent } from './agent/auth/RegisterAgent';
export { default as AgentDashboard } from './agent/dashboard/AgentDashboard';
export { default as AgentCreationSuccess } from './agent/agent-creation-success/AgentCreationSuccess';
export { default as AgentApproval } from './agent/agent-approval/AgentApproval';

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
export { default as RegisterAdmin } from './admin/auth/RegisterAdmin';
export { default as LoginAdmin } from './admin/auth/LoginAdmin';
export { default as DashboardAdmin } from './admin/dashboard/Dashboard';
export { default as AdminDashboard } from './admin/dashboard/AdminDashboard';
export { default as Dashboard } from './superAdmin/dashboard/Dashboard';
export { default as UserProfile } from './superAdmin/display/UserProfile';
export { default as ProfileModal } from './superAdmin/display/ProfileModal';

// ICUMS
export { default as CreateIcums } from './icums/create/CreateIcums';

// QUOTE
export { default as GetAQuote } from './quote/GetAQuote';

// DOCUMENTS
export { default as Waybill } from './shipment/documents/Waybill';

// Analysis
export { default as DailyShipment } from './analysis/DailyShipment';
export { default as PieChartShipment } from './analysis/PieChartShipment';

// NON ADMINS
export { default as LoginNonAdmins } from './non-admins/LoginNonAdmins';

// 404
export { default as Four04 } from './404';