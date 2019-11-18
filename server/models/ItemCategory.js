const mongoose = require("mongoose");
const { Schema } = mongoose;
// item: { type: Schema.Types.ObjectId, ref: "items" },
//   createdAt: { type: Date, default: Date.now() }

const itemCategorySchema = new Schema({
  name: String,
  items: [{ type: Schema.Types.ObjectId, ref: "items" }],
  createdAt: { type: Date, default: Date.now() }
});

mongoose.model("itemCategories", itemCategorySchema);
