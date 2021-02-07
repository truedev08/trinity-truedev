const RentalProvider = require('./helpers/rentalPrediction');
const SpartanBot = require('spartanbot').SpartanBot
require("dotenv").config();
const { default: Axios } = require('axios');

const User = require('./models/user');

const {NH_API_KEY, NH_API_SECRET, NH_ORG_ID} = process.env;

let workerAddress = 'RRj8fK1WRUr6mHWxwMF3Cb7X35HcmF9Pet'; //TrueDevs RVN worker

let settingsNiceHash = { //martin
  type: 'NiceHash',
  api_key: NH_API_KEY,
  api_secret: NH_API_SECRET,
  api_id: NH_ORG_ID,
  name: 'NiceHash'
};

let settingsMRR = {
  type: 'MiningRigRentals',
  api_key: '',
  api_secret: 
    '',
  name: 'MiningRigRentals'
};

let userInput = {
  token: 'RVN',
  tokenAlgo: 'KAWPOW',
  nextWorker: workerAddress,
  minDuration: .5,  // this should be a user setting (not in the main interface)
  minMargin: .10
}

//let rentalProvider = new RentalProvider();

let token = "RVN"
let tokenAlgo = "KAWPOW"
let minDuration = 60
let tokensPerBlock = 5000
let blocksPerHour = 60

let rentalProvider = new RentalProvider(settingsNiceHash);

function userinput() {
  let token = 'RVN';
  let tokenAlgo = 'KAWPOW';
  let nextWorker = workerAddress
  let minDuration = .5;  // this should be a user setting (not in the main interface)
  let minMargin = .10

  return { token, tokenAlgo, nextWorker, minDuration, minMargin};
}

let UserInput = userinput();

async function profitsEstimated() {
    await rentalProvider.setup(UserInput)

    let currentCondition = await rentalProvider.getcurrentconditions(token, tokenAlgo, minDuration, tokensPerBlock, blocksPerHour)
      
    let currentRental = await rentalProvider.getcurrentrental(currentCondition)
    //let rewardsBeforeRentalStart = currentCondition.rewardsTotal
    let rewardsBeforeRentalStart = 276298.70399977
    let RentalCompositeStatusCode = (currentRental === undefined) ? (9) : (currentRental.RentalCompositeStatusCode)
    let RewardsCompositeCode = (currentCondition === undefined) ? (9) : (currentCondition.RewardsCompositeCode)
    // let LiveEstimatesFromMining = rentalProvider.liveestimatesfrommining(currentRental, currentCondition, UserInput, tokensPerBlock, blocksPerHour, rewardsBeforeRentalStart)
    let LiveEstimatesFromMining = await rentalProvider.liveestimatesfrommining(currentRental, currentCondition, UserInput, tokensPerBlock, blocksPerHour, rewardsBeforeRentalStart)
    console.table(LiveEstimatesFromMining)
    let MinerSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.MinerSubStatusCode)
    let RoundSharesSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.RoundSharesSubStatusCode)
    let CandidateBlocksSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.CandidateBlocksSubStatusCode)
    let NetworkPercent;
    let BestArbitrageCurrentConditions = await rentalProvider.bestarbitragecurrentconditions(NetworkPercent, UserInput, tokensPerBlock, blocksPerHour, currentCondition)
    let minMargin = .10
    console.table(BestArbitrageCurrentConditions)
    let botStatus = await rentalProvider.botstatus(RentalCompositeStatusCode, RewardsCompositeCode, currentCondition, currentRental, LiveEstimatesFromMining, MinerSubStatusCode, RoundSharesSubStatusCode, CandidateBlocksSubStatusCode, BestArbitrageCurrentConditions, minMargin)
    //console.log("Include some jibberish: ", botStatus);
    
    //console.table(res);
    let result = await updateModelWithProfitEstimate(botStatus, LiveEstimatesFromMining, BestArbitrageCurrentConditions)

    return result
}

/*
let myPromise = new Promise((resolve, reject) => {
  // make an api call
  try {
    const res = Axios.get({ url: "google.com" })
    resolve(res)
  } catch (err) {
    reject(err)
  }
})
myPromise().then(res => { console.log(res)}).catch(err => { console.log(error)})
*/

async function updateModelWithProfitEstimate(botStatus, LiveEstimatesFromMining, BestArbitrageCurrentConditions) {
  //const { BotStatusCode, projectedProfitable, projectedAboveUsersMinMargin } = await profitEstimation
  
  return { botStatus, LiveEstimatesFromMining, BestArbitrageCurrentConditions}
}


//setInterval(profitsEstimated, 15000)

module.exports = profitsEstimated



