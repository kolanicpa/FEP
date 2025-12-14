import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email)
      if (existingUser) {
        return res.status(409).json({
          error: { message: 'User already exists', code: 'USER_EXISTS' }
        })
      }

      // Create new user
      const user = await userModel.create({
        email,
        password,
        firstName,
        lastName
      })

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await userModel.findByEmail(email)
      if (!user) {
        return res.status(401).json({
          error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
        })
      }

      // Verify password
      const isValid = await userModel.verifyPassword(user, password)
      if (!isValid) {
        return res.status(401).json({
          error: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }
        })
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      })
    } catch (error) {
      next(error)
    }
  }

  async verifyToken(req, res, next) {
    try {
      // req.user is already set by authenticate middleware
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.first_name,
          lastName: req.user.last_name,
          role: req.user.role
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async getMe(req, res, next) {
    try {
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.first_name,
          lastName: req.user.last_name,
          role: req.user.role
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
