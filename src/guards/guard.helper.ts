import { decode } from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';
export const getUserTokenByRequest = (request: any) => {
  try {
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(/\s/)[1];
    const user = instanceToPlain(decode(token));
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserByRequest = (data: any, request: any) => {
  const authHeader = request.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(/\s/)[1];
    try {
      const user = instanceToPlain(decode(token));
      return data ? user?.[data] : user;
    } catch (err) {
      throw new Error(err);
    }
  } else {
    throw new Error('Missing Authorization');
  }
};
