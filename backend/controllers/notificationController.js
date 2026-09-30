import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory fallback notifications for demo/offline
const localNotificationsStore = new Map();

/**
 * @desc    Get all notifications for authenticated customer
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
      const unreadCount = notifications.filter((n) => !n.isRead).length;

      return res.status(200).json({
        success: true,
        notifications,
        unreadCount,
      });
    } else {
      let list = localNotificationsStore.get(userId.toString());
      if (!list) {
        list = [
          {
            _id: 'notif_1',
            id: 'notif_1',
            type: 'account',
            title: 'Welcome to RU Biker World!',
            message: 'Your rider account is ready. Explore 100% genuine motorcycle spares and save your bike to garage.',
            isRead: false,
            link: '/account/profile',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: 'notif_2',
            id: 'notif_2',
            type: 'offer',
            title: 'Season Kickoff: Up to 35% Off Braking & Chain Kits',
            message: 'Exclusive seasonal discount on Brembo, Rolon, and Motul performance products.',
            isRead: false,
            link: '/offers',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        localNotificationsStore.set(userId.toString(), list);
      }

      const unreadCount = list.filter((n) => !n.isRead).length;

      return res.status(200).json({
        success: true,
        notifications: list,
        unreadCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { id } = req.params;

    if (isDbConnected()) {
      const notif = await Notification.findOne({ _id: id, user: userId });
      if (!notif) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found.',
        });
      }
      notif.isRead = true;
      await notif.save();

      const all = await Notification.find({ user: userId });
      const unreadCount = all.filter((n) => !n.isRead).length;

      return res.status(200).json({
        success: true,
        message: 'Marked as read.',
        unreadCount,
      });
    } else {
      const list = localNotificationsStore.get(userId.toString()) || [];
      const item = list.find((n) => n._id === id || n.id === id);
      if (item) item.isRead = true;

      const unreadCount = list.filter((n) => !n.isRead).length;
      return res.status(200).json({
        success: true,
        message: 'Marked as read.',
        unreadCount,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all customer notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
        unreadCount: 0,
      });
    } else {
      const list = localNotificationsStore.get(userId.toString()) || [];
      list.forEach((n) => {
        n.isRead = true;
      });
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
        unreadCount: 0,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
      return res.status(200).json({ success: true, data: { unreadCount } });
    } else {
      const list = localNotificationsStore.get(userId.toString()) || [];
      const unreadCount = list.filter((n) => !n.isRead).length;
      return res.status(200).json({ success: true, data: { unreadCount } });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a single notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Notification.findOneAndDelete({ _id: id, user: userId });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Notification not found.' });
      }
      return res.status(200).json({ success: true, message: 'Notification removed.' });
    } else {
      let list = localNotificationsStore.get(userId.toString()) || [];
      list = list.filter((n) => n._id !== id && n.id !== id);
      localNotificationsStore.set(userId.toString(), list);
      return res.status(200).json({ success: true, message: 'Notification removed.' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all notifications for user
 * @route   DELETE /api/notifications
 * @access  Private
 */
export const clearNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;

    if (isDbConnected()) {
      await Notification.deleteMany({ user: userId });
      return res.status(200).json({ success: true, message: 'All notifications cleared.' });
    } else {
      localNotificationsStore.set(userId.toString(), []);
      return res.status(200).json({ success: true, message: 'All notifications cleared.' });
    }
  } catch (error) {
    next(error);
  }
};
