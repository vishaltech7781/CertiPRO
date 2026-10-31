import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { EmailService } from '../services/emailService.js';
import { ActivityEvent } from '../models/ActivityEvent.js';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        passwordHash,
        role: 'learner',
        learningInterests: [],
      });

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('cp_token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: {
          token,
          user: user.toJSON(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      if (user.accountStatus === 'suspended') {
        res.status(403).json({
          success: false,
          message: 'This account has been suspended. Please contact support.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('cp_token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: 'Logged in successfully.',
        data: {
          token,
          user: user.toJSON(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('cp_token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  public static async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    res.json({
      success: true,
      data: req.user.toJSON(),
    });
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      // Always return success to prevent email enumeration
      if (!user) {
        res.json({
          success: true,
          message: 'If an account with that email exists, password reset instructions have been sent.',
        });
        return;
      }

      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      await PasswordResetToken.create({
        user: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      await EmailService.sendPasswordResetEmail(user.email, rawToken);

      res.json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const resetRecord = await PasswordResetToken.findOne({
        tokenHash,
        used: false,
        expiresAt: { $gt: new Date() },
      });

      if (!resetRecord) {
        res.status(400).json({
          success: false,
          message: 'Password reset link is invalid or has expired. Please request a new one.',
        });
        return;
      }

      const user = await User.findById(resetRecord.user);
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'User no longer exists.',
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();

      resetRecord.used = true;
      await resetRecord.save();

      res.json({
        success: true,
        message: 'Your password has been reset successfully. You can now log in.',
      });
    } catch (error) {
      next(error);
    }
  }
}

