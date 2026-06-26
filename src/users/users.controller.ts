import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParams } from './dto/query-params.dto';
import { IsValidMongoDBId } from './dto/is-valid-objectID.dto';
import { IsAuthGuard } from 'src/guards/is-auth.guard';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { UserId } from 'src/decorators/user.decorator';

@ApiTags('users')
@UseGuards(IsAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'ყველა მომხმარებლის მიღება (მხოლოდ ადმინისტრატორისთვის)',
  })
  @ApiSecurity('token')
  @UseGuards(IsAdminGuard)
  @Get()
  findAll(@Query() { page, take }: QueryParams) {
    return this.usersService.findAll({ page, take });
  }

  @ApiOperation({ summary: 'მომხმარებლის მიღება ID-ით' })
  @ApiParam({ name: 'id', description: 'მომხმარებლის MongoDB ID' })
  @Get(':id')
  findOne(@Param() { id }: IsValidMongoDBId) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'მომხმარებლის მონაცემების განახლება' })
  @ApiParam({ name: 'id', description: 'მომხმარებლის MongoDB ID' })
  @Patch(':id')
  update(
    @UserId() requesterId: string, // ეს ავტომატურად იკითხება ტოკენიდან
    @Param() { id }: IsValidMongoDBId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(requesterId, id, updateUserDto);
  }

  @ApiOperation({ summary: 'მომხმარებლის წაშლა' })
  @ApiParam({ name: 'id', description: 'მომხმარებლის MongoDB ID' })
  @Delete(':id')
  remove(@UserId() requesterId: string, @Param() { id }: IsValidMongoDBId) {
    return this.usersService.deleteUser(requesterId, id);
  }
}
