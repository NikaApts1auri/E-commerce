import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class IsValidMongoDBId {
  @ApiProperty({
    example: '64f1b2b3c4d5e6f7a8b9c0d1',
    description: 'MongoDB-ს ვალიდური ObjectID',
  })
  @IsMongoId()
  id: string;
}
