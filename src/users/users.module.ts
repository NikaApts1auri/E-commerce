import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
