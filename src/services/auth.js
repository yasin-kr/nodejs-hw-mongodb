import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/auth.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { createToken } from '../utils/createToken.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';

const createSession = async (userId) => {
  const accessToken = createToken();
  const refreshToken = createToken();

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return sanitizeUser(newUser);
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return createSession(user._id);
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await SessionsCollection.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  return createSession(session.userId);
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  if (!sessionId || !refreshToken) return;

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });
};

export const requestResetEmail = async ({ email }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    {
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetLink = `${env('APP_DOMAIN')}/reset-password?token=${token}`;

  try {
    await sendMail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;

  try {
    payload = jwt.verify(token, env('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    {
      _id: user._id,
    },
    {
      password: encryptedPassword,
    },
  );

  await SessionsCollection.deleteOne({ userId: user._id });
};
