import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<Record<string, any>> {
    const transactionRepo = getRepository(Transaction);

    const transaction = await transactionRepo.findOne(id);

    if (!transaction) {
      throw new AppError('Could not find transaction!', 404);
    }

    await transactionRepo.delete(id);

    return { message: 'Transaction deleted!' };
  }
}

export default DeleteTransactionService;
