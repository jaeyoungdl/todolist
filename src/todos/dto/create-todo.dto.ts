import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsEnum, IsArray } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString({ message: '설명은 문자열이어야 합니다.' })
  @IsOptional()
  description?: string;

  @IsEnum(TodoStatus, { message: '올바른 상태값을 입력해주세요.' })
  @IsOptional()
  status?: TodoStatus;

  @IsDateString({}, { message: '올바른 날짜 형식을 입력해주세요.' })
  @IsOptional()
  startDate?: string;

  @IsDateString({}, { message: '올바른 날짜 형식을 입력해주세요.' })
  @IsOptional()
  endDate?: string;

  @IsUUID(4, { message: '올바른 사용자 ID를 입력해주세요.' })
  @IsOptional()
  assignedToId?: string;

  @IsArray({ message: '담당자 목록은 배열이어야 합니다.' })
  @IsUUID(4, { each: true, message: '올바른 사용자 ID를 입력해주세요.' })
  @IsOptional()
  assigneeIds?: string[];
} 