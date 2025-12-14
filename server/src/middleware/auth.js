import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        error: { message: 'Authentication required', code: 'NO_TOKEN' }
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid token', code: 'INVALID_TOKEN' }
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: { message: 'Invalid token', code: 'INVALID_TOKEN' }
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { message: 'Token expired', code: 'TOKEN_EXPIRED' }
      })
    }
    next(error)
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { message: 'Authentication required', code: 'NO_USER' }
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: { message: 'Insufficient permissions', code: 'FORBIDDEN' }
      })
    }

    next()
  }
}
