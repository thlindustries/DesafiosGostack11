import { getRepository } from 'typeorm';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteCategoryService {
  public async execute({ id }: Request): Promise<Category | undefined> {
    const categoryRepo = getRepository(Category);

    const category = await categoryRepo.findOne(id);

    if (!category) {
      throw new AppError('This category does not exist!', 404);
    }

    await categoryRepo.delete(id);

    return category;
  }
}

export default DeleteCategoryService;
