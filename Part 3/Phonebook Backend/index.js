const app = require("./app"); // the actual Express application
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

//-------------------------------------------------------------------
const morgan = require("morgan");

morgan.token("requestData", (req) => {
  const { name, number } = req.body;
  return JSON.stringify({ Name: name, Number: number });
});
app.use(morgan(":method :url :status - :response-time ms - :requestData"));