const RentalProvider = require('./helpers/rentalPrediction');
const SpartanBot = require('spartanbot').SpartanBot
require("dotenv").config();
const { default: Axios } = require('axios');

const User = require('./models/user');
const ProfitEstimates = require('./models/profitEstimates');

const {NH_API_KEY, NH_API_SECRET, NH_ORG_ID} = process.env;


let workerAddress = 'RAXNZ1Rwp2wRf4miqnMALWkKMgFdf5QVRc'; 


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

//let rentalProvider = new RentalProvider();

let token = "RVN"
let tokenAlgo = "KAWPOW"
let minDuration = 60
let tokensPerBlock = 5000
let blocksPerHour = 60

function userinput(workerAddress) {
  let token = 'RVN';
  let tokenAlgo = 'KAWPOW';
  let nextWorker = workerAddress
  let minDuration = .5;  // this should be a user setting (not in the main interface)
  let minMargin = .10

  return { token, tokenAlgo, nextWorker, minDuration, minMargin};
}


async function profitsEstimated(userSettings) {
  let workerAddress = userSettings.address

  let rentalProvider = new RentalProvider({
    type: 'NiceHash',
    api_key: userSettings.niceHashKeys.api_key,
    api_secret: userSettings.niceHashKeys.api_secret,
    api_id: userSettings.niceHashKeys.api_id,
    name: 'NiceHash'
  });

  // Nicehash knows the worker address for a specific pool. Consider using that?
  let UserInput = userinput(workerAddress)
  await rentalProvider.setup(UserInput)
  
  let currentCondition = await rentalProvider.getcurrentconditions(token, tokenAlgo, minDuration, tokensPerBlock, blocksPerHour)
  console.table(currentCondition)
  let currentRental = await rentalProvider.getcurrentrental(currentCondition)
  let rewardsBeforeRentalStart = currentCondition.rewardsTotal
  //let rewardsBeforeRentalStart = 276298.70399977
  let profitEstimates = new ProfitEstimates({
    RewardsBeforeRentalStart: rewardsBeforeRentalStart
  });
  await profitEstimates.save()
  let RentalCompositeStatusCode = (currentRental === undefined) ? (9) : (currentRental.RentalCompositeStatusCode)
  let RewardsCompositeCode = (currentCondition === undefined) ? (9) : (currentCondition.RewardsCompositeCode)
  // let LiveEstimatesFromMining = rentalProvider.liveestimatesfrommining(currentRental, currentCondition, UserInput, tokensPerBlock, blocksPerHour, rewardsBeforeRentalStart)
  let LiveEstimatesFromMining = await rentalProvider.liveestimatesfrommining(currentRental, currentCondition, UserInput, tokensPerBlock, blocksPerHour, rewardsBeforeRentalStart)
  console.log("LiveEstimatesFromMining")
  console.table(LiveEstimatesFromMining)
  let MinerSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.MinerSubStatusCode)
  let RoundSharesSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.RoundSharesSubStatusCode)
  let CandidateBlocksSubStatusCode = (currentCondition === undefined) ? (9) : (currentCondition.CandidateBlocksSubStatusCode)
  let NetworkPercent;
  let BestArbitrageCurrentConditions = await rentalProvider.bestarbitragecurrentconditions(NetworkPercent, UserInput, tokensPerBlock, blocksPerHour, currentCondition)
  let minMargin = .10
  console.log("BestArbitrageCurrentConditions")
  console.table(BestArbitrageCurrentConditions)
  let botStatus = await rentalProvider.botstatus(RentalCompositeStatusCode, RewardsCompositeCode, currentCondition, currentRental, LiveEstimatesFromMining, MinerSubStatusCode, RoundSharesSubStatusCode, CandidateBlocksSubStatusCode, BestArbitrageCurrentConditions, minMargin)
  let botStatusCode = botStatus.botStatusCode
  let SpartanBotCompositeStatusCode = "" + RentalCompositeStatusCode + RewardsCompositeCode + botStatusCode
  // console.log(SpartanBotCompositeStatusCode)
  let profitEstimates = new ProfitEstimates({
    SpartanBotCompositeStatusCode: SpartanBotCompositeStatusCode
  });
  await profitEstimates.save()
  let sleeptime = 15*1000
  let output = await rentalProvider.output(currentCondition, currentRental, token, SpartanBotCompositeStatusCode, BestArbitrageCurrentConditions, LiveEstimatesFromMining, sleeptime, botStatusCode, workerAddress)
    
  //console.table(res);
  let result = await updateModelWithProfitEstimate(botStatus, LiveEstimatesFromMining, BestArbitrageCurrentConditions)

  //console.log("ayyy bro");

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



