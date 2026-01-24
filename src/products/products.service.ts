import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { PaginationDTo } from '../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDTo) {
    const { skip = 0, take = 10 } = paginationDto;
    const products = await this.productRepository.findAndCount({
      skip,
      take,
    });
    return products;
  }

  async findOne(term: string) {
    const product = await this.productRepository.findOne({
      where: this.getWhereOptions(term),
    });

    if (!product)
      throw new NotFoundException(`Product with term "${term}" not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    const deletedProduct = await this.productRepository.remove(product);

    return deletedProduct;
  }

  private getWhereOptions(term: string) {
    if (isUUID(term)) {
      return { id: term };
    }
    const normalizedTerm = term.toLowerCase();
    return [{ slug: normalizedTerm }, { title: normalizedTerm }];
  }

  private handleDBExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error?.code === '23505') throw new BadRequestException(error?.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
