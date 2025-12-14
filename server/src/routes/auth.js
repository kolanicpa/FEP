import express from 'express'
import authController from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { body } from 'express-validator'

const router = express.Router()

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').optional().trim(),
    body('lastName').optional().trim()
  ],
  authController.register
)

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
)

router.get('/verify', authenticate, authController.verifyToken)

router.get('/me', authenticate, authController.getMe)

export default router
