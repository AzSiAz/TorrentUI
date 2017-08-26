const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next)

const ignoreErrors = fn => (req, res, next) => fn(req, res, next).catch(() => next())

module.exports = {
    catchErrors,
    ignoreErrors
}
