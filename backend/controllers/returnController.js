import mongoose from 'mongoose';
import ReturnRequest from '../models/ReturnRequest.js';
import { processReturnRequest, localReturnStore } from '../services/returnService.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * @desc    Submit a new return request for delivered order items
 * @route   POST /api/returns
 * @access  Private
 */
export const createReturn = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { orderId, items, reason, description, images = [], bankDetails, refundMethod } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and items list are required to initiate a return request.',
        code: 'INVALID_RETURN_PAYLOAD',
      });
    }

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a return reason and a detailed description.',
        code: 'MISSING_REASON_OR_DESCRIPTION',
      });
    }

    const { returnRequest } = await processReturnRequest({
      userId,
      orderId,
      items,
      reason,
      description,
      images,
      bankDetails,
      refundMethod,
    });

    return res.status(201).json({
      success: true,
      message: 'Return request submitted successfully. Our support team will review it within 24–48 hours.',
      data: returnRequest,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        code: error.code || 'RETURN_ERROR',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get customer's return requests
 * @route   GET /api/returns
 * @access  Private
 */
export const getMyReturns = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);

    let returns = [];
    if (isDbConnected()) {
      returns = await ReturnRequest.find({ user: userId }).sort({ createdAt: -1 }).lean();
    } else {
      for (const [, r] of localReturnStore.entries()) {
        if (String(r.user) === userIdStr && !returns.find((x) => x._id === r._id)) {
          returns.push(r);
        }
      }
      returns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single return request details
 * @route   GET /api/returns/:id
 * @access  Private
 */
export const getReturnById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;

    let returnReq = null;
    if (isDbConnected()) {
      let query = [];
      if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
      returnReq = await ReturnRequest.findOne({ user: userId, $or: query }).lean();
    } else {
      returnReq = localReturnStore.get(id);
      if (returnReq && String(returnReq.user) !== userIdStr) {
        returnReq = null;
      }
    }

    if (!returnReq) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found.',
        code: 'RETURN_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      data: returnReq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a return request
 * @route   POST /api/returns/:id/cancel
 * @access  Private
 */
export const cancelReturn = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const userIdStr = String(userId);
    const { id } = req.params;

    let returnReq = null;
    if (isDbConnected()) {
      let query = [];
      if (mongoose.Types.ObjectId.isValid(id)) query.push({ _id: id });
      returnReq = await ReturnRequest.findOne({ user: userId, $or: query });
    } else {
      returnReq = localReturnStore.get(id);
    }

    if (!returnReq || String(returnReq.user) !== userIdStr) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found.',
        code: 'RETURN_NOT_FOUND',
      });
    }

    if (['Received', 'Refund Processing', 'Refunded', 'Cancelled'].includes(returnReq.status)) {
      return res.status(400).json({
        success: false,
        message: `Return request cannot be cancelled because it is already ${returnReq.status}.`,
        code: 'RETURN_NOT_CANCELLABLE',
      });
    }

    returnReq.status = 'Cancelled';
    if (typeof returnReq.save === 'function') {
      await returnReq.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Return request has been cancelled.',
      data: returnReq,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createReturn,
  getMyReturns,
  getReturnById,
  cancelReturn,
};
