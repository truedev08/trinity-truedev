const NiceHashApi = require('nicehash-api')

const User = require('../models/user')

require('dotenv').config();
//const { NH_API_KEY, NH_API_SECRET, NH_ORG_ID } = process.env;

const ProfitEstimate = require('../models/profitEstimates');
const { keys } = require('lodash');
//const SpotProfitOrder = require('../controllers/truedevSpotProfitOrder')



const createOrder = async(req, res) => {
  try {
    let orderId;

    let providerUser = await User.findById({ _id: req.body.userId})
    let providerData = providerUser.providerData;
    let niceHashKeys;

    for (let keys of providerData) {
      if (keys.rental_provider == "NiceHash") {
        niceHashKeys = keys;
      }
    }

    console.log("Connecting to nicehash");
    const NiceHashOrder = new NiceHashApi.default({api_key: niceHashKeys.api_key, api_secret: niceHashKeys.api_secret, api_id: niceHashKeys.api_id});


    console.log("Status Fetching");
    let statusCode = (await requestStatusCode()).botStatusCode;

    console.log("Setting Body");

    
    const currentStatus = await ProfitEstimate.collection.findOne({}, {sort:{$natural:-1}})

    console.log(currentStatus)

    // Fix this to listen to user input instead of marketFactor being hardcoded
    const body = {
      //STANDARD | FIXED
      type: req.body.type,
      limit: currentStatus.HashrateToRent,
      id: '',
      price: currentStatus.RentalHashPrice,
      marketFactor: 1000000000000,
      displayMarketFactor: currentStatus.MarketFactorName,
      amount: currentStatus.CostOfRentalInBtc,
      //amount: req.body.amount,
      market: 'USA',
      algorithm: "KAWPOW"
    }
    

    // const body = {
    //   //STANDARD | FIXED
    //   type: req.body.type,
    //   limit: req.body.limit,
    //   id: req.body.userId,
    //   price: req.body.price,
    //   marketFactor: "TH",
    //   displayMarketFactor: req.body.displayMarketFactor,
    //   amount: req.body.amount,
    //   market: "EU",
    //   algorithm: "KAWPOW"
    // }
    

    // Replace this with a way for a user to pick the specific pool they want to use.
    console.log("Fetching pools");
    let pools = (await NiceHashOrder.getPools()).list;
    for (pool of pools) {
      if (pool.algorithm == body.algorithm && pool.inMoratorium == false) {
        body.id = pool.id;
        break
      }
    }

    // console.log(body);

    console.log("Fetching active orders");
    let activeRental = (await requestActiveRental(orderId, NiceHashOrder)).alive;

    statusCode = 1; // Force a rental
    if (!activeRental && (statusCode==1 || statusCode==2)) {
      console.log("Creating Order");
      console.table(body)
      orderId = (await NiceHashOrder.createOrder(body)).id
      console.log("Successfully created order");
    } else if (!activeRental && statusCode==3) {
      console.log("not renting. Status Code 3");
    } else if (activeRental && (statusCode==1 || statusCode==2)) {
      console.log("not renting. Status Code 1 or 2");
    } else if (activeRental && statusCode==3) {
      console.log("not renting. Status Code 3");
    } else {
      console.log("nothing works")
    }


    
  } catch (error) {
      console.log(error)
  }
}

const cancelOrder = async(req, res) => {
  try {
    NiceHashOrder.cancelOrder(req.body)
  } catch (error) {
      console.log(error)
  }
}

const requestStatusCode = async () => {
  try {
    const currentBotStatus = await ProfitEstimate.collection.findOne({}, {sort:{$natural:-1}})
    console.log("Current Bot Status", currentBotStatus.botStatusCode)
    return currentBotStatus
  } catch (error) {
    console.log(error);
    return {botStatusCode: 0}
  }
}

const requestConditions = async () => {
  try {
    const currentCondition = await ProfitEstimate.collection.findOne({}, {sort:{$natural:-1}})
    console.log("Current Composite Bot Status", currentBotStatus.SpartanBotCompositeStatusCode)
    return currentCondition.SpartanBotCompositeStatusCode
  } catch (error) {
    console.log(error);
    return {SpartanBotCompositeStatusCode: 0}
  }
}

const requestActiveRental = async (orderId, NiceHashOrder) => {
  console.log("Order ID", orderId);
  /*
  if (orderId == undefined) {
    console.log("No Order ID found");
    return false
  }
  */
  try {
    //const time = await NiceHashOrder.getTime()
    let orderDetails = await NiceHashOrder.getOrders("KAWPOW", "USA")

    console.log("Order Details", orderDetails.id)
    console.log("Full: ", orderDetails)
    return orderDetails.id
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = { createOrder, cancelOrder, requestConditions }