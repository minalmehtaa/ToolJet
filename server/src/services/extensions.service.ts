import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Extension } from 'src/entities/extension.entity';
import { Repository, QueryRunner } from 'typeorm';
import { CreateFileDto } from '../dto/create-file.dto';
import { CreateExtensionDto } from '../dto/create-extension.dto';
import { UpdateExtensionDto } from '../dto/update-extension.dto';
import { FilesService } from './files.service';
import { encode } from 'js-base64';

@Injectable()
export class ExtensionsService {
  constructor(
    private readonly filesService: FilesService,
    @InjectRepository(Extension)
    private extensionsRepository: Repository<Extension>
  ) {}
  async create(createExtensionDto: CreateExtensionDto, file: Express.Multer.File, queryRunner: QueryRunner) {
    const str = file.buffer.toString('utf8');
    const fileDto = new CreateFileDto();
    fileDto.data = encode(str);
    fileDto.filename = file.originalname;
    const uploadedFile = await this.filesService.create(fileDto, queryRunner);
    createExtensionDto.fileId = uploadedFile.id;
    return this.extensionsRepository.save(this.extensionsRepository.create(createExtensionDto));
  }

  async findAll() {
    return await this.extensionsRepository.find();
  }

  async findOne(id: string) {
    const extension = await this.extensionsRepository.findOne({ where: { id } });
    if (!extension) {
      throw new NotFoundException('Extension not found');
    }
    return extension;
  }

  update(id: string, updateExtensionDto: UpdateExtensionDto) {
    return `This action updates a #${id} extension`;
  }

  remove(id: string) {
    return `This action removes a #${id} extension`;
  }
}