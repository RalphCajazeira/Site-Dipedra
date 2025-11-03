require("../config/register-alias");
const { HttpError } = require("@/errors/http-error");

function authorize(allowedRoles = []) {
  return (req, _res, next) => {
    if (!req.user) {
      next(new HttpError(401, "Autenticação necessária."));
      return;
    }

    if (
      Array.isArray(allowedRoles) &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(req.user.role)
    ) {
      next(new HttpError(403, "Você não possui permissão para esta ação."));
      return;
    }

    next();
  };
}

module.exports = { authorize };
