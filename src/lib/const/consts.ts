export const jwtConstants = {
  secret: process.env.TOKEN || 'TOKEN_DEV',
  expireIn: process.env.JWT_EXPIRE,
};
