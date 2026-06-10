const mongoose = require("mongoose");
const Holding = require("./models/holdingModel.cjs");
require("dotenv").config();

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const allHoldings = await Holding.find({});
  console.log("ALL HOLDINGS IN DB:", JSON.stringify(allHoldings, null, 2));
  process.exit(0);
}

debug().catch(err => {
  console.error(err);
  process.exit(1);
});
