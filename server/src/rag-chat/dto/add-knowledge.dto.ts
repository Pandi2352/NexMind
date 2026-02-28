import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddKnowledgeDto {
    @ApiProperty({ description: 'Text documents to store in the vector database as knowledge' })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    texts: string[];
}
