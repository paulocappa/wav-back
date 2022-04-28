import { container } from 'tsyringe';

import ITokenProvider from './models/ITokenProvider';
import JWTTokenProvider from './implementations/JWTTokenProvider';

const providers = {
  jwt: JWTTokenProvider,
};

container.registerSingleton<ITokenProvider>('TokenProvider', providers.jwt);
