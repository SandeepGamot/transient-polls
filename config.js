require("dotenv").config();

module.exports = {
  mongodb_url: process.env.DB,
  port: process.env.PORT || 5000,
  node_env: process.env.NODE_ENV || "dev",
};
