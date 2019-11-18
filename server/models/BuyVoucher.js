const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");

const buyVoucherSchema = new Schema({
  buyItems: [{ type: Schema.Types.ObjectId, ref: "buyItems" }],
  totalPrice: Number,
  cratedMonth: { type: String, default: moment(Date.now()).format("MMM") },
  createYear: { type: String, default: moment(Date.now()).format("YY") },
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("buyVouchers", buyVoucherSchema);
