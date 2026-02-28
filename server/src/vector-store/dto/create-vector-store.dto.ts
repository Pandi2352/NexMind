import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VectorStoreType } from '../enums/vector-store-type.enum';

export class CreateVectorStoreDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: VectorStoreType })
    @IsEnum(VectorStoreType)
    type: VectorStoreType;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    baseUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    apiKey?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    indexName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    tenant?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    database?: string;
}
