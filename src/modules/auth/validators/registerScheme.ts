import { Joi } from 'express-validation';

const registerSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required(),
    password: Joi.string()
      .required()
      .min(6),
    username: Joi.string()
      .required()
      .min(2)
      .max(30),
  }),
};

export { registerSchema };