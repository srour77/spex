import joi from 'joi';
import { cities } from '../data';

export const addressSchema = joi
  .object({
    address: joi.object({
      governorate: joi.number().integer().min(1).max(27).required(),
      city: joi
        .number()
        .integer()
        .min(1)
        .max(396)
        .required()
        .custom((val, helpers) => {
          const city = cities.find(item => item['id'] == String(val));
          if (city?.governorate_id != String(helpers.state.ancestors[0].governorate)) return helpers.error('err');
        }),
      district: joi.string().min(3).max(50).required(),
      street: joi.string().max(50).required(),
      building: joi.string().max(20).required(),
      floor: joi.number().integer().min(0).max(40).required(),
      apartment: joi.number().integer().min(1).max(10)
    })
  })
  .messages({ err: 'city and governorate do not match' });
