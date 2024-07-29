import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  validateSync,
} from 'class-validator';

export class Env {
  @IsInt()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
}


export function validateEnvs(config: Record<string, unknown>): Env {
  const validatedConfig = plainToInstance(Env, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
