const Joi = require('@hapi/joi');

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}

            req.value.body = validatorResult.value
            next()
        }
    }
}

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validatorResult = schema.validate({ param: req.params[name] })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}

            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const schemas = {
    authSignUpSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
    deckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required(),
        owner:  Joi.string().regex(/^[0-9a-zA-Z]{24}$/).required()
    }),
    newDeckSchema: Joi.object().keys({
        name: Joi.string().min(6).required(),
        description: Joi.string().min(10).required(),
        owner:  Joi.string().regex(/^[0-9a-zA-Z]{24}$/).required()
    }),
    deckOptionalSchema: Joi.object().keys({
        name: Joi.string().min(6),
        description: Joi.string().min(10),
        owner:  Joi.string().regex(/^[0-9a-zA-Z]{24}$/)
    }),

    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-zA-Z]{24}$/).required()
    }),
    userSchema: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required()
    }),
    userOptionalSchema: Joi.object().keys({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email()
    }),
}

module.exports = {
    validateParam,
    validateBody,
    schemas
}