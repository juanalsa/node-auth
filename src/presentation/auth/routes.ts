import { Router } from 'express';
import { AuthController } from './controller';
import { MongoAuthDatasource, MongoAuthRepository } from '../../infrastructure';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new MongoAuthDatasource();
    const authRepository = new MongoAuthRepository(datasource);
    const controller = new AuthController(authRepository);

    // Definir las rutas principales
    router.post('/login', controller.loginUser);

    router.post('/register', controller.registerUser);

    return router;
  }
}
