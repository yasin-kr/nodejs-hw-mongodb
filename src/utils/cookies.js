import { THIRTY_DAYS } from '../constants/auth.js';

const getCookieOptions = () => ({
  httpOnly: true,
  expires: new Date(Date.now() + THIRTY_DAYS),
  sameSite: 'none',
  secure: true,
});

export const setupSessionCookies = (res, session) => {
  const options = getCookieOptions();

  res.cookie('refreshToken', session.refreshToken, options);
  res.cookie('sessionId', session._id, options);
};

export const clearSessionCookies = (res) => {
  const options = getCookieOptions();

  res.clearCookie('refreshToken', options);
  res.clearCookie('sessionId', options);
};
