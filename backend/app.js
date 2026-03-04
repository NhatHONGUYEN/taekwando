const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Le gestionnaire d'erreurs doit être après toutes les routes
app.use(errorHandler);

module.exports = app;
