import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getProducts(
        @Query('name') name?: string,
        @Query('category') category?: string,
    ): Promise<Product[]> {
        if (category) {
            return this.productService.findByCategory(category);
        }
        if (name) {
            return this.productService.findByName(name);
        }
        return this.productService.findAll();
    }

    // Category routes
    @Get('category/:category')
    async getProductsByCategory(@Param('category') category: string): Promise<Product[]> {
        return this.productService.findByCategory(category);
    }

    @Get('mouse')
    async getMouseProducts(): Promise<Product[]> {
        return this.productService.findByCategory('mice');
    }

    @Get('keyboard')
    async getKeyboardProducts(): Promise<Product[]> {
        return this.productService.findByCategory('keyboards');
    }

    @Get('headsets')
    async getHeadsetProducts(): Promise<Product[]> {
        return this.productService.findByCategory('headsets');
    }

    @Get(':id')
    async getProductById(@Param('id') id: string): Promise<Product | null> {
        return this.productService.findById(id);
    }

    @Post()
    async createProduct(@Body() product: Partial<Product>): Promise<Product> {
        return this.productService.create(product);
    }

    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() product: Partial<Product>,
    ): Promise<Product | null> {
        return this.productService.update(id, product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string): Promise<Product | null> {
        return this.productService.delete(id);
    }
}
