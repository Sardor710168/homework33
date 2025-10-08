const { error } = require('console')
const { validationResult } = require('express-validator')

function validate(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            succes: false,
            error: errors.array().map(e => e.msg).join(', ')
        })
    }
    next()
}

module.exports =validate