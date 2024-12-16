import { IsNumber, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class AppConfig {
  // @IsString()
  // readonly NODE_ENV: 'production' | 'stage' | 'development';

  @IsString()
  readonly DATABASE_USER: string;

  @IsString()
  readonly DATABASE_PASSWORD: string;

  @IsNumber()
  readonly DATABASE_PORT: number;

  @IsString()
  readonly DATABASE_NAME: string;

  @IsString()
  readonly DATABASE_HOST: string;

  @IsString()
  readonly DATABASE_TYPE: string;
}

export function validateAppConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(AppConfig, config, {
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
