const mongoose = require("mongoose");
const { Schema } = mongoose;

const sellItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "items" },
  sellVoucher: { type: Schema.Types.ObjectId, ref: "sellVouchers" },
  itemSellPrice: Number,
  quantity: Number,
  itemSellTotalPrice: Number,
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("sellItems", sellItemSchema);
