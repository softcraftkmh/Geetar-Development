const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://admin:passw0rd@ds117830.mlab.com:17830/geetar_development",
  { useNewUrlParser: true }
);

require("./models/BuyItem");
require("./models/BuyVoucher");
require("./models/Item");
require("./models/ItemCategory");
require("./models/SellItem");
require("./models/SellVoucher");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

require("./routes/items")(app);
require("./routes/item_categories")(app);
require("./routes/sell_vouchers")(app);
require("./routes/buy_vouchers")(app);

app.get("/health_check", (req, res) => {
  res.json({ status: "success", message: "im fine" });
});

app.get("*", (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.listen(PORT);
