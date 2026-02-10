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
import { ProductImage } from './entities';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDTo) {
    const { skip = 0, take = 10 } = paginationDto;
    const [products] = await this.productRepository.findAndCount({
      skip,
      take,
      relations: {
        images: true,
      },
    });
    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images?.map((img) => img.url) ?? [],
    }));
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
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images && product) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) =>
          queryRunner.manager.create(ProductImage, { url: image }),
        );
      } else {
        product.images = await queryRunner.manager.find(ProductImage, {
          where: { product: { id } },
        });
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    }
    await queryRunner.manager.save(product);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return this.findOnePlain(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    const deletedProduct = await this.productRepository.remove(product);

    return deletedProduct;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images?.map((img) => img.url) ?? [],
    };
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
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
