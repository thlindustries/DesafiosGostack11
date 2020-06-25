import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const findCustomer = await this.customersRepository.findById(customer_id);

    if (!findCustomer) {
      throw new AppError('This Customer does not exist!');
    }

    const productsId = products.map(product => ({
      id: product.id,
    }));

    const listOfProducts = await this.productsRepository.findAllById(
      productsId,
    );

    if (listOfProducts.length !== products.length) {
      throw new AppError('Some products doest not exists in the storage');
    }

    const filteredProducts = listOfProducts.map((item, index) => {
      return {
        product_id: products[index].id,
        quantity: products[index].quantity,
        price: item.price,
      };
    });

    const productsUpdated = listOfProducts.map((item, index) => {
      if (filteredProducts[index].quantity > item.quantity) {
        throw new AppError('We dont have stock of this item');
      }
      return Object.assign(item, {
        quantity: item.quantity - filteredProducts[index].quantity,
      });
    });

    await this.productsRepository.updateQuantity(productsUpdated);

    const order = await this.ordersRepository.create({
      customer: findCustomer,
      products: filteredProducts,
    });

    return order;
  }
}

export default CreateOrderService;
