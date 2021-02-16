module.exports = {
  HOST: "192.168.11.252",
  USER: "nmd",
  PASSWORD: "eLeicohqu7",
  DB: "nmd",
  dialect: "mysql",
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};
