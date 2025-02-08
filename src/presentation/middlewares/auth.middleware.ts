import { NextFunction, Request, Response } from 'express';
import { JwtAdapter, Payload } from '../../config/jwt';
import { UserModel } from '../../data/mongodb/models/user.model';

export class AuthMiddleware {
  static validateJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.header('Authorization');

    if (!authorization)
      return res.status(401).json({ error: 'No token provided' });

    if (!authorization.startsWith('Bearer '))
      return res.status(401).json({ error: 'Invalid token' });

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await JwtAdapter.validateToken<Payload>(token);

      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await UserModel.findById(payload.id);

      if (!user)
        return res.status(500).json({ error: 'Invalid token: User not found' });

      // Si usuario no está activo devolver error

      req.body.user = user;
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
    next();
  };
}
