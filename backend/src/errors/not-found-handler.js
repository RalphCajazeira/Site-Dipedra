function notFoundHandler(_req, res, _next) {
  return res.status(404).json({
    message: "Rota não encontrada.",
  });
}

module.exports = { notFoundHandler };
