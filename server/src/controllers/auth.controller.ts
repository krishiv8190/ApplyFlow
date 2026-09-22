import type { Request, Response } from 'express';

import { loginUser, registerUser } from '../services/auth.service.js';
export async function registerController(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);

    if (!user) {
      return res.status(409).json({
        error: 'An account with this email already exists',
      });
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error('Failed to register user:', error);

    return res.status(500).json({
      error: 'Failed to register user',
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    if (!result) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to login user:', error);

    return res.status(500).json({
      error: 'Failed to login',
    });
  }
}
