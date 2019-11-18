const mongoose = require("mongoose");
const { Schema } = mongoose;

const buyItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "items" },
  buyVoucher: { type: Schema.Types.ObjectId, ref: "buyVouchers" },
  itemBuyPrice: Number,
  quantity: Number,
  itemBuyTotalPrice: Number,
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("buyItems", buyItemSchema);
