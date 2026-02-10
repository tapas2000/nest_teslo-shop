import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}
  async executeSeed() {
    await this.insertProducts();
    return 'Seed executed';
  }

  private async insertProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const inserPromises = products.map((product) => {
      return this.productService.create(product);
    });

    await Promise.all(inserPromises);

    return 'Products inserted';
  }
}
