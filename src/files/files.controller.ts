import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    return res.sendFile(path);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }), // Use default memory storage
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(`Uploading file: ${file?.originalname}`);

    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file type');
    }
    console.log(file);

    const secureUrl = `${this.configService.get('HOST_API')}/${this.configService.get('URL_API_PREFIX')}/files/${file.filename}`;

    return secureUrl;
  }
}
