const mongoose = require("mongoose");
const Item = mongoose.model("items");
const SellVoucher = mongoose.model("sellVouchers");
const SellItem = mongoose.model("sellItems");
const uri = "/api/sell_vouchers";

const SELL_VOUCHER_FOUND_STATUS = {
  status: "success",
  message: "Sell vouchers found."
};
const ITEM_NOT_FOUND_STATUS = {
  status: "fail",
  message: "Item not found."
};
const FAIL_TO_CREATE_NEW_ITEM_STATUS = {
  status: "fail",
  message: "Failed to create new item"
};
const NEW_VOUCHER_CREATED_STATUS = {
  status: "success",
  message: "New sell voucher created."
};
const EMPTY_STATUS = {
  status: "fail",
  message: "Empty request"
};

module.exports = app => {
  app.get(uri, async (req, res) => {
    const sellVouchers = await SellVoucher.find({}).populate({
      path: "sellItems",
      populate: {
        path: "item"
      }
    });
    res.json({
      ...SELL_VOUCHER_FOUND_STATUS,
      sellVouchers
    });
  });

  app.post(uri, async (req, res) => {
    const newSellVoucher = new SellVoucher({});
    const newSellItems = [];
    const foundItems = [];
    let voucherTotalPrice = 0;

    const { sellItems, discount } = req.body;
    if (!sellItems && sellItems.length !== 0) {
      return res.json({ ...EMPTY_STATUS });
    }

    for (const sellItem of sellItems) {
      const { _id, quantity } = sellItem;

      const foundItem = await Item.findById(_id);

      if (!foundItem) {
        return res.json({
          ...ITEM_NOT_FOUND_STATUS
        });
      }

      foundItem.stockQuantity -= quantity;

      const newSellItem = new SellItem({
        item: foundItem,
        newSellVoucher,
        itemSellPrice: foundItem.itemSellPrice,
        quantity,
        itemSellTotalPrice: quantity * foundItem.itemSellPrice
      });

      voucherTotalPrice += quantity * foundItem.itemSellPrice;
      newSellItems.push(newSellItem);
      foundItems.push(foundItem);
    }
    newSellVoucher.totalPrice =
      parseInt(voucherTotalPrice) - parseInt(discount);
    newSellVoucher.discount = parseInt(discount);
    newSellVoucher.sellItems = newSellItems;

    try {
      for (const sellItem of newSellItems) {
        await sellItem.save();
      }
      for (const foundItem of foundItems) {
        await foundItem.save();
      }
      await newSellVoucher.save();
    } catch (error) {
      return res.json({
        ...FAIL_TO_CREATE_NEW_ITEM_STATUS,
        error
      });
    }

    const sellVouchers = await SellVoucher.find({}).populate("sellItems");

    return res.json({
      expectedData: {
        ...NEW_VOUCHER_CREATED_STATUS,
        sellVouchers
      }
    });
  });
};
