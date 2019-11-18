const mongoose = require("mongoose");
const ItemCategory = mongoose.model("itemCategories");

const uri = "/api/item_categories";
const CATEGORY_ALREADY_EXISTED_STATUS = {
  status: "fail",
  message: "Category name already existed."
};

module.exports = app => {
  app.post(uri, async (req, res) => {
    const { name } = req.body.category;
    const foundCategory = await ItemCategory.find({ name });
    if (foundCategory.length !== 0) {
      return res.json(CATEGORY_ALREADY_EXISTED_STATUS);
    }
    await new ItemCategory({ name }).save();
    const allCategories = await ItemCategory.find({});
    res.json({
      status: "success",
      message: "New category created.",
      expectedData: {
        categories: [...allCategories]
      }
    });
  });

  app.get(uri, async (req, res) => {
    const categories = await ItemCategory.find({});
    res.json({
      status: "success",
      message: "Categories found.",
      expectedData: {
        categories
      }
    });
  });
};
