const Inventory = require("../Model/inventory");
const Sale = require("../Model/sales");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllCategory = async (req, res) => {
  const categories = await Category.find();

  if (!categories)
    return res.status(401).json({ success: false, msg: `No record Found` });
  res.status(200).json({ success: true, categories });
};

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllInventory = async (req, res) => {
  let inventory;

  let { startdate, endDate } = req.query;

  if (req.query.startdate === undefined) {
    inventory = await Inventory.find();
  } else {
    inventory = await Inventory.find({
      createdAt: {
        $gte: new Date(new Date(startdate).setHours(00, 00, 00, 00)),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59, 59)),
      },
    }).sort({ createdAt: "asc" });
  }

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });
  inventory.reverse();

  res.status(200).json({ success: true, inventory });
};

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getSingleInventory = async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });
  res.status(200).json({ success: true, inventory });
};
//@desc    Get all sale
//@route   GET /api/v1/auth/inventory/get-sales
//@access  Private/user
exports.getAllSales = async (req, res) => {
  let sale;
  let { startdate, endDate } = req.query;

  if (req.query.startdate === undefined) {
    sale = await Sale.find();
  } else {
    sale = await Sale.find({
      createdAt: {
        $gte: new Date(new Date(startdate).setHours(00, 00, 00, 00)),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59, 59)),
      },
    }).sort({ createdAt: "asc" });
  }

  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });
  sale.reverse();

  sale = sale.map((sal) => {
    obj = {};

    obj["qty"] = sal.qty;
    obj["category"] = sal.category;
    obj["type"] = sal.type;
    obj["prize"] = sal.prize;
    obj["payment"] = sal.payment;
    obj["detail"] = sal.detail;
    obj["amount"] = "NGN" + parseInt(sal.prize) * parseInt(sal.qty);
    obj["date"] = moment(sal.createdAt).format("DD/MM/YYYY");
    obj["id"] = sal._id;
    obj["userId"] = sal.userId;

    return obj;
  });
  res.status(200).json({ success: true, sale });
};

//@desc    Get all sale
//@route   GET /api/v1/auth/inventory/get-sales
//@access  Private/user
exports.getRestock = async (req, res) => {
  let restock = await Restocking.find();

  if (!restock)
    return res.status(401).json({ success: false, msg: `No record Found` });

  restock.reverse();
  console.log(restock);
  res.status(200).json({ success: true, restock });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-user-sale/:id
//@access  Private/user
exports.getSingleSale = async (req, res) => {
  let sale = await Sale.find({ userId: req.params.value });

  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });
  sale = sale.map((sal) => {
    obj = {};

    obj["qty"] = sal.qty;
    obj["category"] = sal.category;
    obj["type"] = sal.type.charAt(0).toUpperCase() + sal.type.slice(1);
    obj["price"] = sal.prize;
    obj["amount"] = "NGN" + sal.prize * sal.qty;
    obj["date"] = moment(sal.createdAt).format("DD/MM/YYYY");
    obj["id"] = sal._id;

    return obj;
  });
  res.status(200).json({ success: true, sale });
};

//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-user-sale/:id
//@access  Private/user
exports.getSaleId = async (req, res) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });

  res.status(200).json({ success: true, sale });
};

//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-restock/:id
//@access  Private/user
exports.getSingleRestock = async (req, res) => {
  let restock = await Restocking.findById(req.params.id);

  if (!restock)
    return res.status(401).json({ success: false, msg: `No record Found` });

  res.status(200).json({ success: true, restock });
};

//@desc   Submit inventory
//@route   POST /api/auth/inventory/create-inventory
//@access  Private/admin
exports.createInventory = async (req, res) => {
  // var { resource } = await cloudinary.search
  //   .expression()
  //   .sort_by("public_id", "desc")
  //   .max_results.execute();

  // const publicId = resource.map((file) => file.public_id);
  // console.log(publicId);

  dotenv.config({ path: "./config/config.env" });

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

  cloudinary.uploader.upload(
    req.body.file,
    // { upload_preset: "amos" },
    async (error, result) => {
      if (error) {
      } else {
        req.body["filePublicId"] = result.public_id;
        console.log(req.body);
        var inventory = await Inventory.create(req.body);
        console.log(inventory);
        if (!inventory)
          return res.status(401).json({ success: false, msg: `No record` });
        res.status(200).json({ success: true, inventory });
      }
    }
  );
  // var uploadedFile = await cloudinary.uploader.upload(req.body.file);

  // console.log(uploadedFile);

  // }
};

//@desc   Submit sales
//@route   POST /api/auth/inventory/chekout:id
//@access  Private/user
exports.checkout = async (req, res) => {
  req.body.user = req.user.fullName;
  req.body.userId = req.user._id;
  req.body.shop = req.user.shop;
  req.body.convertedqty = Number(req.body.qty) === 0.5 ? 1 : req.body.qty;

  const inventory = await Inventory.find({
    shop: req.body.shop,
    type: req.body.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].qty == 0) {
        return res.status(401).json({
          success: false,
          msg: `You have run of stock :).`,
        });
      }

      let inv = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        { qty: inventory[i].qty - req.body.qty },
        { new: true, runValidators: true }
      );

      // console.log(inv);

      let sale = await Sale.create(req.body);

      res.status(200).json({ success: true, sale });
    }
  } else {
    return res.status(401).json({
      success: false,
      msg: `You can not sale this Item because it has not been created for your shop`,
    });
  }
};

//@desc    Get update user
//@route   GET /api/auth/updateReturn/:id
//@access  Private/admin
exports.updateRestock = async (req, res) => {
  let restock = await Restocking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(restock);

  if (!restock)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update this sales` });
  res.status(200).json({ success: true, restock });
};

//@desc    Get update user
//@route   GET /api/auth/updateUserInvest/:id
//@access  Private/admin
exports.updateInventory = async (req, res) => {
  // req.body.createdAt = new Date(req.body.createdAt);
  // console.log(req.body);
  // return;
  let inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!inventory)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update account` });
  inventory = await Inventory.find();
  res.status(200).json({ success: true, inventory });
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteInventory = async (req, res, next) => {
  let invent = await Inventory.findById(req.params.id);

  if (!invent)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  invent = await invent.remove();

  return res.status(200).json({ success: true, msg: {} });
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteSale = async (req, res, next) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  sale = await sale.remove();

  return res.status(200).json({ success: true, msg: {} });
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteRestock = async (req, res, next) => {
  let restock = await Restocking.findById(req.params.id);

  if (!restock)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  restock = await restock.remove();

  let inventory = await Inventory.find({
    shop: restock.shop,
    type: restock.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: parseInt(inventory[i].qty) - parseInt(restock.qty),
        },

        { new: true, runValidators: true }
      );
    }
  }
  let recovery = {
    createdDate: restock.createdAt,
    shop: restock.shop,
    category: restock.category,
    type: restock.type,
    qty: restock.qty,
  };
  await RecoveryRS.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};
