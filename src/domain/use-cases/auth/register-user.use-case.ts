import { JwtAdapter, Payload } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

interface RegisterUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<RegisterUserResponse>;
}

type SignToken = (
  payload: Payload,
  duration?: string
) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(
    registerUserDto: RegisterUserDto
  ): Promise<RegisterUserResponse> {
    const user = await this.authRepository.register(registerUserDto);
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
