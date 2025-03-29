import { Operator } from '$core/backend/request.type';
import { z as validation } from 'zod';

export const getModelSchema = validation.object({
  field: validation.string().default('id'),
  operator: validation.nativeEnum(Operator).default(Operator.GREATER_THAN),
  value: validation.string().default(''),
  orderBy: validation.string().default('id'),
  orderDirection: validation.string().regex(/^(ASC|DESC)$/).default('ASC'),
  pageIndex: validation.string().regex(/^\d+$/).default('1'),
  pageSize: validation.string().regex(/^\d+$/).default('10'),
  limit: validation.string().regex(/^\d+$/).default('10'),
  offset: validation.string().regex(/^\d+$/).default('0'),
});

export const deleteModelSchema = validation.object({
  id: validation.coerce.number().int().positive(),
});
