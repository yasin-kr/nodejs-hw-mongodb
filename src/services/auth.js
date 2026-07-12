import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/auth.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { createToken } from '../utils/createToken.js';
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
