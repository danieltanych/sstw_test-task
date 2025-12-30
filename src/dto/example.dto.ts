import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
    required: false,
  })
  name?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID користувача',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Дата створення',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
