import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(`'Image not found '${imageName}'`);
    }
    return path;
  }
}
