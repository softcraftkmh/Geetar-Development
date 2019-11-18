const mongoose = require("mongoose");
const { Schema } = mongoose;
// item: { type: Schema.Types.ObjectId, ref: "items" },

const sellVoucherSchema = new Schema({
  sellItems: [{ type: Schema.Types.ObjectId, ref: "sellItems" }],
  totalPrice: Number,
  cratedMonth: String,
  createYear: Number,
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("sellVouchers", sellVoucherSchema);
