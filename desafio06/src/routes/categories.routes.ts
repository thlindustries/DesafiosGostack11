import { Router } from 'express';
import { getRepository } from 'typeorm';

import Category from '../models/Category';
import CreateCategoryService from '../services/CreateCategoryService';
import DeleteCategoryService from '../services/DeleteCategoryService';

const categoryRouter = Router();

categoryRouter.get('/', async (request, response) => {
  const categoryRepo = getRepository(Category);

  const categories = await categoryRepo.find();

  return response.status(200).json(categories);
});

categoryRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const createCategory = new CreateCategoryService();

  const category = await createCategory.execute({ title });

  return response.status(200).json(category);
});

categoryRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteCategory = new DeleteCategoryService();

  const category = await deleteCategory.execute({ id });

  return response.json(category);
});

export default categoryRouter;
