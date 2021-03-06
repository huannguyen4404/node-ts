import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../utils/secrets'
import authService from '../services/auth.service'
import usersService from '../services/users.service'

/**
 * Consider to move all functions related with Auth to new module
 */
export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      await authService.register(req.body)
      res.status(201).send({ created: true })
    } catch (error) {
      res.status(500).send(error.message)
    }
  }

  async login(req: Request, res: Response): Promise<unknown> {
    try {
      const userInfo = await usersService.getUserByUsername(req.body.username)
      if (!userInfo) {
        return res.status(401).send({
          message: 'User is not exist',
        })
      }

      const isValid = await authService.authenticate(
        userInfo,
        req.body.password,
      )

      if (!isValid) {
        return res.status(401).send({
          message: 'Authenticate failed.',
        })
      }

      const payLoad = { id: userInfo._id }
      const token = jwt.sign(payLoad, JWT_SECRET || '', { expiresIn: '1h' })

      res.status(200).send({ token: token })
    } catch (error) {
      res.status(500).send(error.message)
    }
  }

  resetPassword(): void {
    //
  }
  verifyEmail(): void {
    //
  }
}
