const stocks = require("./stocks.js");

const query = process.argv.slice(2);

stocks.get(query);
