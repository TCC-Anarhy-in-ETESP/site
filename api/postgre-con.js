const pgp = require("pg-promise")();

const db = pgp("postgres://postgres:ag250507@localhost:5432/Jogo");

console.log("conectado ao banco");

module.exports = db;