import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(3, { message: 'Name must be at least 3 characters.' })
  name: string;
  users: string[];
  players: string[];
}
