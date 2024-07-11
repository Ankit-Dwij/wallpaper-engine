import Joi from 'joi';

export const queryWallpapers = {
  query: Joi.object().keys({
    category: Joi.string(),
    title: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
