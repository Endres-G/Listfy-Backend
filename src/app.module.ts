import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ListModule } from './modules/lists/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get<string>('TYPEORM_USERNAME');
        const password = configService.get<string>('TYPEORM_PASSWORD');
        const database = configService.get<string>('TYPEORM_DATABASE');
        const host = configService.get<string>('TYPEORM_HOST');
        const port = configService.get<number>('TYPEORM_PORT');

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
          migrations: ['dist/database/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/database/migrations',
          },
        };
      },
    }),
    UserModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
