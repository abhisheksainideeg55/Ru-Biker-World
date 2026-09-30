import mongoose from 'mongoose';

/**
 * Validate that specified URL parameter(s) are valid MongoDB ObjectIds
 * or allowable slug identifiers
 */
export const validateObjectId = (paramNames = ['id']) => {
  const params = Array.isArray(paramNames) ? paramNames : [paramNames];

  return (req, res, next) => {
    for (const param of params) {
      const val = req.params[param];
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        // If the parameter is also allowed as an alphanumeric slug (e.g. orderNumber ORD-..., prod-..., slug)
        // verify that it doesn't contain dangerous query injection characters
        if (typeof val === 'string' && /^[a-zA-Z0-9_-]+$/.test(val)) {
          continue;
        }

        return res.status(400).json({
          success: false,
          message: `Invalid identifier provided for parameter '${param}'.`,
          code: 'INVALID_OBJECT_ID',
        });
      }
    }
    next();
  };
};

/**
 * Sanitize query parameters to prevent raw MongoDB operator injection ($where, $gt, etc.)
 */
export const sanitizeQuery = (req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$')) {
        delete req.query[key];
      } else if (typeof req.query[key] === 'object' && req.query[key] !== null) {
        // Clean nested objects with operators
        for (const subKey of Object.keys(req.query[key])) {
          if (subKey.startsWith('$')) {
            delete req.query[key][subKey];
          }
        }
      }
    }
  }
  next();
};

export default {
  validateObjectId,
  sanitizeQuery,
};
