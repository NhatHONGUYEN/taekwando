const express = require("express");
const cors = require("cors");
const todosRouter = require("./routes/todos");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/todos", todosRouter);

// Le gestionnaire d'erreurs doit être après toutes les routes
app.use(errorHandler);

module.exports = app;
