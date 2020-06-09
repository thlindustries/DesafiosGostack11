import { getRepository } from 'typeorm';

import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepo = getRepository(Category);

    const category = categoryRepo.create({
      title,
    });

    const categoryAlreadyExist = await categoryRepo.findOne({
      where: { title },
    });

    if (categoryAlreadyExist) {
      throw new AppError('This category already exists!', 401);
    }

    await categoryRepo.save(category);

    return category;
  }
}

export default CreateCategoryService;
