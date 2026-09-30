import express from 'express';
import {
  getAdminDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  updateProductStock,
  getAdminInventory,
  batchUpdateInventory,
  getAdminUsers,
  updateAdminUser,
  createAdminUser,
  deleteAdminUser,
  blockAdminUser,
  unblockAdminUser,
  getAdminAuditLogs,
  getAdminOrders,
  updateOrderStatus,
  getAdminReturns,
  updateAdminReturnStatus,
} from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Require Admin authorization for all routes below
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getAdminDashboardStats);

// Products CRUD & Stock
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);
router.patch('/products/:id/stock', updateProductStock);

// Inventory Management
router.get('/inventory', getAdminInventory);
router.patch('/inventory/batch', batchUpdateInventory);

// User Management & Access Control
router.get('/users', getAdminUsers);
router.post('/users', createAdminUser);
router.put('/users/:id', updateAdminUser);
router.delete('/users/:id', deleteAdminUser);
router.post('/users/:id/block', blockAdminUser);
router.post('/users/:id/unblock', unblockAdminUser);

// Audit Logs
router.get('/audit-logs', getAdminAuditLogs);

// Orders Management
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Return & Refund Requests Management
router.get('/returns', getAdminReturns);
router.patch('/returns/:id', updateAdminReturnStatus);

export default router;
