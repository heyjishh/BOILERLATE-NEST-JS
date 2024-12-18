import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  masterUrl: process.env.MASTER_DB_URL,
  slaveUrl: process.env.SLAVE_DB_URL,
  useMasterSlave: process.env.MASTER_SLAVE_DB_URL === "true",
}));
