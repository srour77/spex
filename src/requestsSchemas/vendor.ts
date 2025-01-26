import { Vendor } from '@prisma/client';
import joi from 'joi';
import { addressSchema } from './common';

export const createVendorSchema = joi.object<Omit<Vendor, 'id' | 'emailVerified'>>({
  name: joi.string().min(2).max(200).required(),
  email: joi.string().email().required(),
  password: joi.string().min(7).max(50).required(),
  address: addressSchema.required(),
  phone: joi
    .string()
    .regex(/01[0125][0-9]{8}$/)
    .required()
});

export const loginVendorSchema = joi.object<Pick<Vendor, 'email' | 'password'>>({
  email: joi.string().email().required(),
  password: joi.string().min(7).max(50).required()
});

export const updateVendorSchema = joi.object<Pick<Vendor, 'name' | 'address' | 'phone'>>({
  name: joi.string().min(2).max(200),
  address: joi.string().min(4).max(300),
  phone: joi.string().regex(/01[0125][0-9]{8}$/)
});

export const resetVendorPasswordSchema = joi.object<Omit<Vendor, 'id' | 'emailVerified'>>({
  password: joi.string().min(7).max(50).required()
});
