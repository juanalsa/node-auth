import { JwtAdapter, Payload } from '../../../config';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface LoginUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<LoginUserResponse>;
}

type SignToken = (
  payload: Payload,
  duration?: string
) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginUserResponse> {
    const user = await this.authRepository.login(loginUserDto);
    const payload: Payload = { id: user.id };
    const token = await this.signToken(payload);

    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
