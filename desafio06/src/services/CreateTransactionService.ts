import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransctionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransctionsRepository);
    const categoryRepo = getRepository(Category);

    const { total } = await transactionRepo.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('You do not have enough balance');
    }

    let category = await categoryRepo.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = categoryRepo.create({
        title: categoryTitle,
      });

      await categoryRepo.save(category);
    }

    const transactionAlreadyExist = await transactionRepo.findOne({
      where: { title },
    });

    if (transactionAlreadyExist) {
      throw new AppError('This title is already in use!', 401);
    }

    const transaction = transactionRepo.create({
      title,
      type,
      value,
      category,
    });

    await transactionRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
