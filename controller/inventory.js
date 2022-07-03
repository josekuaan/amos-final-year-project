const Inventory = require("../Model/inventory");
const Sale = require("../Model/sales");
const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const { register } = require("./auth");

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

  res.status(200).json({ success: true, sale });
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

//@desc   Submit inventory
//@route   POST /api/auth/inventory/create-inventory
//@access  Private/admin
exports.createInventory = async (req, res) => {
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

        const getRandomId = (min = 0, max = 500000) => {
          min = Math.ceil(min);
          max = Math.floor(max);
          const num = Math.floor(Math.random() * (max - min + 1)) + min;
          return "REF" + num.toString().padStart(6, "0");
        };
        req.body.refId = getRandomId;
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

  console.log(req.body);
  let sale = await Sale.create(req.body);

  res.status(200).json({ success: true, sale });
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
