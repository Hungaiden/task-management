const tasksRoute = require("./task.route");

const usersRoute = require("./user.route");

const userMiddleware = require("../../middlewares/auth.middlewares");

module.exports = (app) => {
  app.use("/tasks", userMiddleware.requireAuth, tasksRoute);

  app.use("/users", usersRoute);
}