import { Sequelize } from "sequelize";

const dbConnect = new Sequelize("workout", "root", "oyindamola97$", {
  dialect: "mysql",
  host: "localhost",
});

export { dbConnect };
