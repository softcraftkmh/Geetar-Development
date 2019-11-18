const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  itemCategory: { type: Schema.Types.ObjectId, ref: "itemCategories" },
  itemSellPrice: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("items", itemSchema);
