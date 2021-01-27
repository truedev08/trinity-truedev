const NiceHashApi = require('nicehash-api')

require('dotenv').config();
const { NH_API_KEY, NH_API_SECRET, NH_ORG_ID } = process.env;

const ProfitEstimate = require('../models/profitEstimates');
//const SpotProfitOrder = require('../controllers/truedevSpotProfitOrder')

const NiceHashOrder = new NiceHashApi.default({api_key: NH_API_KEY, api_secret: NH_API_SECRET, api_id: NH_ORG_ID});

let orderId;

const createOrder = async(req, res) => {
  try {
    let statusCode = (await requestStatusCode()).botStatusCode;

    const body = {
      //STANDARD | FIXED
      type: "STANDARD",
      limit: 0.001,
      id: "d2aaa943-2fce-4f9c-8b72-2fa389b901c1",
      price: 0.1,
      marketFactor: 1000000000000,
      displayMarketFactor: "TH",
      amount: 0.001,
      //market: 'EU',
      algorithm: "KAWPOW"
    }

    let activeRental = (await requestActiveRental()).alive;

    if (!activeRental && statusCode==1 || statusCode==2) {
      console.log("Creating Order");
      orderId = (await NiceHashOrder.createOrder(body)).id
    } else if (!activeRental && statusCode==3) {
      console.log("not renting. Status Code 3");
    } else if (activeRental && statusCode==1 || statusCode==2) {
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
    
  }
}

const requestActiveRental = async () => {
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
    return orderDetails.id
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = { createOrder, cancelOrder }