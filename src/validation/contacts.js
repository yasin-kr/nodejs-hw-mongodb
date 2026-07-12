import Joi from 'joi';

const contactTypes = ['work', 'home', 'personal'];

const contactString = Joi.string().min(3).max(20);

export const createContactSchema = Joi.object({
  name: contactString.required(),
  phoneNumber: contactString.required(),
  email: contactString.email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactString.valid(...contactTypes).required(),
});

export const updateContactSchema = Joi.object({
  name: contactString.optional(),
  phoneNumber: contactString.optional(),
  email: contactString.email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactString.valid(...contactTypes).optional(),
}).min(1);
