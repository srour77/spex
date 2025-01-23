import { Customer } from '@prisma/client';
import joi from 'joi';

export const createCustomerSchema = joi.object<Omit<Customer, 'id' | 'emailVerified'>>({
  name: joi.string().min(2).max(200).required(),
  email: joi.string().email().required(),
  password: joi.string().min(7).max(50).required(),
  address: joi.string().min(4).max(300).required(),
  phone: joi
    .string()
    .regex(/01[0125][0-9]{8}$/)
    .required()
});

export const loginCustomerSchema = joi.object<Pick<Customer, 'email' | 'password'>>({
  email: joi.string().email().required(),
  password: joi.string().min(7).max(50).required()
});

export const updateCustomerSchema = joi.object<Pick<Customer, 'name' | 'address' | 'phone'>>({
  name: joi.string().min(2).max(200),
  address: joi.string().min(4).max(300),
  phone: joi.string().regex(/01[0125][0-9]{8}$/)
});

export const resetCustomerPasswordSchema = joi.object<Omit<Customer, 'id' | 'emailVerified'>>({
  password: joi.string().min(7).max(50).required()
});

export const requestPasswordResetSchema = joi.object<{ email: string }>({
  email: joi.string().email().required()
});

export const resetPasswordSchema = joi.object<{ password: string; token: string }>({
  password: joi.string().min(7).max(50).required(),
  token: joi.string().max(400).required()
});
