import { Router } from 'express';
import { AuthRoutes } from './auth/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas principales
    router.use('/api/auth', AuthRoutes.routes);
    // router.use('/api/user');

    return router;
  }
}
