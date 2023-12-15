import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In, Like } from 'typeorm';
import { CATEGORY } from '../entities/category.entity';
import { PRODUCT_GENERAL } from '../entities/productGeneral';
import { PRODUCT_VARIATIONS } from '../entities/productVariation.entity';
import { PRODUCT_DESCRIPTION } from '../entities/productDescription.entity';
import { createProductDTO } from 'src/dto/admin/createProductDTO.dto';
import { updateProductDTO } from 'src/dto/admin/updateProductDTO.dto';

@Injectable()
export class ProductService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async getAllCategory(): Promise<CATEGORY[]> {
    return this.dataSource.getRepository(CATEGORY).find({
      where: {
        IS_DELETED: 0,
      },
    });
  }
  async getProductListByCategoryId(
    category_id: number | null,
  ): Promise<PRODUCT_GENERAL[]> {
    return this.dataSource.getRepository(PRODUCT_GENERAL).find({
      where: {
        categories: { CATEGORY_ID: category_id },
        IS_DELETED: 0,
      },
      relations: {
        categories: true,
      },
    });
  }
  async getProductDetail(productId: number) {
    let data: PRODUCT_GENERAL = await this.dataSource
      .getRepository(PRODUCT_GENERAL)
      .findOne({
        where: {
          PRODUCT_ID: productId,
          categories: {
            IS_DELETED: 0,
          },
        },
        relations: {
          product_variation: true,
          product_description: true,
          categories: true,
        },
      });
    if (data == undefined) return {};
    const {
      PRODUCT_ID,
      PRODUCT_NAME,
      PRODUCT_LOGO_IMAGE,
      product_variation,
      product_description: { PRODUCT_DESCRIPTION },
      categories: [{ CATEGORY_ID, CATEGORY_NAME }],
    } = data;
    const filteredObject = {
      PRODUCT_ID,
      PRODUCT_NAME,
      PRODUCT_LOGO_IMAGE,
      product_variation: product_variation.map(
        ({ VARIATION_ID, PRICE, UNIT, AMOUNT }) => ({
          VARIATION_ID,
          PRICE,
          UNIT,
          AMOUNT,
        }),
      ),
      PRODUCT_DESCRIPTION,
      categories: data.categories,
    };

    return filteredObject;
  }
  async createProduct(productInfo: createProductDTO) {
    let categoriesLst = productInfo.categories.slice(1, -1).split(',');
    let productVariationArr: {
      VARIATION_ID: string;
      AMOUNT: number;
      PRICE: number;
      UNIT: string;
    }[] = Object.values(JSON.parse(productInfo.product_variation));
    let product_variation = productVariationArr.map((item, index) => {
      return this.dataSource.getRepository(PRODUCT_VARIATIONS).create({
        AMOUNT: item.AMOUNT,
        UNIT: item.UNIT,
        PRICE: item.PRICE,
      });
    });
    const categories: CATEGORY[] = await this.dataSource
      .getRepository(CATEGORY)
      .find({
        where: {
          CATEGORY_ID: In(categoriesLst),
        },
      });

    const newProduct = this.dataSource.getRepository(PRODUCT_GENERAL).create({
      PRODUCT_LOGO_IMAGE: productInfo.PRODUCT_LOGO_IMAGE,
      PRODUCT_NAME: productInfo.PRODUCT_NAME,
      categories: categories,
      product_description: {
        PRODUCT_DESCRIPTION: productInfo.PRODUCT_DESCRIPTION,
      },
      product_variation: product_variation,
    });
    try {
      return await this.dataSource
        .getRepository(PRODUCT_GENERAL)
        .save(newProduct);
    } catch (e) {
      throw { success: false };
    }
  }
  async updateProduct(productInfo: updateProductDTO) {
    let productc = await this.dataSource
      .getRepository(PRODUCT_GENERAL)
      .findOne({
        where: {
          PRODUCT_ID: Number(productInfo.PRODUCT_ID),
        },
      });
    if (productc == null)
      throw new BadRequestException({
        success: false,
        message: 'PRODUCT_ID not found',
      });
    let categoriesLst = productInfo.categories.slice(1, -1).split(',');
    let productVariationArr: {
      VARIATION_ID: string | '';
      AMOUNT: number;
      PRICE: number;
      UNIT: string;
    }[] = Object.values(JSON.parse(productInfo.product_variation));
    const productId = Number(productInfo.PRODUCT_ID);
    return await this.dataSource.transaction(async (dataSrc) => {
      let variations: PRODUCT_VARIATIONS[] = [];
      for (let item of productVariationArr) {
        if (item.VARIATION_ID != '') {
          let result = await this.dataSource
            .getRepository(PRODUCT_VARIATIONS)
            .preload({
              VARIATION_ID: Number(item.VARIATION_ID),
              AMOUNT: item.AMOUNT,
              UNIT: item.UNIT,
              PRICE: item.PRICE,
            });
          variations.push(result);
        } else {
          variations.push(
            this.dataSource.getRepository(PRODUCT_VARIATIONS).create({
              PRODUCT_ID: Number(productInfo.PRODUCT_ID),
              AMOUNT: item.AMOUNT,
              UNIT: item.UNIT,
              PRICE: item.PRICE,
            }),
          );
        }
      }
      const productRepo = dataSrc.getRepository(PRODUCT_GENERAL);

      let product = await productRepo.preload({
        PRODUCT_ID: Number(productInfo.PRODUCT_ID),
      });
      for (const variation of variations)
        await dataSrc.getRepository(PRODUCT_VARIATIONS).save(variation);
      const categories: CATEGORY[] = await this.dataSource
        .getRepository(CATEGORY)
        .find({
          where: {
            CATEGORY_ID: In(categoriesLst),
          },
        });
      product.categories = categories;
      let description = await dataSrc
        .getRepository(PRODUCT_DESCRIPTION)
        .preload({
          PRODUCT_ID: productId,
          PRODUCT_DESCRIPTION: productInfo.PRODUCT_DESCRIPTION,
        });
      await dataSrc
        .getRepository(PRODUCT_DESCRIPTION)
        .update(productId, description);
      product.PRODUCT_NAME = productInfo.PRODUCT_NAME;
      product.PRODUCT_LOGO_IMAGE =
        productInfo.PRODUCT_LOGO_IMAGE != '/'
          ? productInfo.PRODUCT_LOGO_IMAGE
          : product.PRODUCT_LOGO_IMAGE;
      return productRepo.save(product);
    });
  }
  async deleteProduct(productId: number) {
    if (productId <= 0) throw new BadRequestException('Invalid productId');
    try {
      let product = await this.dataSource
        .getRepository(PRODUCT_GENERAL)
        .preload({
          PRODUCT_ID: productId,
          IS_DELETED: 1,
        });
      let { PRODUCT_ID } = await this.dataSource
        .getRepository(PRODUCT_GENERAL)
        .save(product);
      return { productId: PRODUCT_ID };
    } catch {
      throw new HttpException('Error', 500);
    }
  }
  async findProduct(searchKey: string) {
    return this.dataSource.getRepository(PRODUCT_GENERAL).find({
      where: {
        PRODUCT_NAME: ILike(`%${searchKey}%`),
      },
    });
  }
}
