export const sanitizeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};
