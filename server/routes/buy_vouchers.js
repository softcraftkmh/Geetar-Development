const mongoose = require("mongoose");
const Item = mongoose.model("items");
const BuyItem = mongoose.model("buyItems");
const BuyVoucher = mongoose.model("buyVouchers");
const uri = "/api/buy_vouchers";

const BUY_VOUCHER_FOUND_STATUS = {
  status: "success",
  message: "Buy vouchers found."
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
  message: "New buy voucher created."
};
const EMPTY_STATUS = {
  status: "fail",
  message: "Empty request"
};

module.exports = app => {
  app.get(uri, async (req, res) => {
    const buyVouchers = await BuyVoucher.find({}).populate({
      path: "buyItems",
      populate: {
        path: "item"
      }
    });
    res.json({
      ...BUY_VOUCHER_FOUND_STATUS,
      buyVouchers
    });
  });

  app.post(uri, async (req, res) => {
    const newBuyVoucher = new BuyVoucher({});
    const newBuyItems = [];
    const foundItems = [];
    let voucherTotalPrice = 0;

    const { buyItems } = req.body;
    if (!buyItems && buyItems.length !== 0) {
      return res.json({ ...EMPTY_STATUS });
    }

    for (const buyItem of buyItems) {
      const { _id, quantity, itemBuyPrice } = buyItem;

      const foundItem = await Item.findById(_id);

      if (!foundItem) {
        return res.json({
          ...ITEM_NOT_FOUND_STATUS
        });
      }

      foundItem.stockQuantity += quantity;

      const newBuyItem = new BuyItem({
        item: foundItem,
        newBuyVoucher,
        itemBuyPrice,
        quantity,
        itemBuyTotalPrice: quantity * itemBuyPrice
      });

      voucherTotalPrice += quantity * itemBuyPrice;
      newBuyItems.push(newBuyItem);
      foundItems.push(foundItem);
    }

    newBuyVoucher.totalPrice = voucherTotalPrice;
    newBuyVoucher.buyItems = newBuyItems;

    try {
      for (const buyItem of newBuyItems) {
        await buyItem.save();
      }
      for (const foundItem of foundItems) {
        await foundItem.save();
      }
      newBuyVoucher.save();
    } catch (error) {
      res.json({
        ...FAIL_TO_CREATE_NEW_ITEM_STATUS,
        error
      });
    }

    const buyVouchers = await BuyVoucher.find({}).populate("buyItems");

    return res.json({
      expectedData: {
        ...NEW_VOUCHER_CREATED_STATUS,
        buyVouchers
      }
    });
  });
};
