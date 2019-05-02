import dotenv from 'dotenv';
import { environment as dev } from './environment';
import { environment as prod } from './environment-prod';
import { Environ } from './environ';

dotenv.config();

type Env = {
    PORT: number;
    MONGODB_HOST: string;
    MONGODB_PORT: number;
    MONGODB_NAME: string;
} 

export const environment: Environ & Env = {
    ...(process.env.NODE_ENV === 'development' ? dev : prod),
    ...(process.env as any as Env),
};
