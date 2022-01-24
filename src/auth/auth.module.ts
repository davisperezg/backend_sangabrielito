import { ModuleOptionsService } from './../module-options/services/module-options.service';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/services/user.service';
import { UserSchema } from 'src/user/schemas/user.schema';
import { jwtConstants } from 'src/lib/const/consts';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/lib/strategies/jwt.strategies';
import { RoleSchema } from 'src/role/schemas/role.schema';
import { RoleService } from 'src/role/services/role.service';
import { ModuleSchema } from 'src/module/schemas/module.schema';
import { ModuleService } from 'src/module/services/module.service';
import { MenuSchema } from 'src/menu/schemas/menu.schema';
import { MenuService } from 'src/menu/services/menu.service';
import { ModuleOptionsSchema } from 'src/module-options/schemas/module-options.schema';
import { OptionSchema } from 'src/option/schemas/option.schema';
import { OptionService } from 'src/option/services/option.service';
import { ConfigService } from '@nestjs/config';
import { AreaSchema } from 'src/area/schemas/area.schema';
import { AreaService } from 'src/area/services/area.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'Menu', schema: MenuSchema },
      { name: 'ModuleOptions', schema: ModuleOptionsSchema },
      { name: 'Option', schema: OptionSchema },
      { name: 'Area', schema: AreaSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RoleService,
    ModuleService,
    MenuService,
    ModuleOptionsService,
    OptionService,
    AreaService,
  ],
})
export class AuthModule {}
