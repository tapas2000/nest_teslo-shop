import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  //   description?: string | undefined;
  //   gender?: string | undefined;
  //   price?: number | undefined;
  //   sizes?: string[] | undefined;
  //   slug?: string | undefined;
  //   stock?: number | undefined;
  //   title?: string | undefined;
}
