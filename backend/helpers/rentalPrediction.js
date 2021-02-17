const https = require('https')
const SpartanBot = require('spartanbot').SpartanBot

class RentalPrediction {

  constructor(settings) {
    this.settings = settings
  }

  async setup(UserInput) {
    this.UserInput = UserInput
    let spartanbot = new SpartanBot()
    let provider = await spartanbot.setupRentalProvider(this.settings)
  
    this.provider = provider
  }

  /*
  UserInput() {
    let token = 'RVN';
    let tokenAlgo = 'KAWPOW';
    let nextWorker = workerAddress
    let minDuration = .5;  // this should be a user setting (not in the main interface)
    let minMargin = .10

    return { token, tokenAlgo, nextWorker, minDuration, minMargin};
  }
  */

  output(CurrentConditions, Rental, token, SpartanBotCompositeStatusCode, BestArbitrageCurrentConditions, LiveEstimatesFromMining, sleeptime, botStatusCode, RewardsCompositeCode){
    let SpartanBotCompositeStatusCodeIndex = (SpartanBotCompositeStatusCode === '000') ? (0) : ((SpartanBotCompositeStatusCode === '001')?(1):((SpartanBotCompositeStatusCode === '002')?(2):((SpartanBotCompositeStatusCode === '003')?(3):(SpartanBotCompositeStatusCode))));
    let SpartanBotStatus = SpartanBotCompositeStatusCodes[SpartanBotCompositeStatusCodeIndex]
    let estTimeRemainingInSec = (RentalCompositeStatusCode >= 7) ? (0) : ((RentalCompositeStatusCode === 3) ? (0) : ((Rental.RentalCompositeStatusCode === 0) ? (0) : ((Rental.RentalOrders.estimateDurationInSeconds === undefined)?(Rental.rentalDuration * 60 * 60):("Unknown")))) 
    let nextUpdateInSecs = sleeptime / 1000

    let rentalPercentCompleteLoop = 0;
    let boundarieslineloop = 0;
    let ArbPrcnt = (SpartanBotCompositeStatusCode > 100) ? ((LiveEstimatesFromMining === undefined )?(1):(1 + LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)) : ((BestArbitrageCurrentConditions === undefined)?(1):(1 + BestArbitrageCurrentConditions.ProjectedProfitMargin))
    let profitbarloop = 0;

    let chunks = 120
    let rentalcomplete = (RentalCompositeStatusCode >= 7) ? (1) : ((Rental.RentalCompositeStatusCode > 0) ? ((Rental.RentalOrders.status.code === 'CANCELLED')?(1):(Rental.rentalPercentComplete)) : (1) )
    let rentalPercentCompleteDisplay = ``;
    let horizontalline = ``;
    while (boundarieslineloop < chunks) {
      horizontalline = horizontalline.concat(`-`)
      boundarieslineloop += 1
    }
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(horizontalline)
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`\n`)
    while (rentalPercentCompleteLoop < rentalcomplete - (1/chunks)) {
      rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`|`)
      rentalPercentCompleteLoop += (1/chunks)
    }
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`\n`)
    while (profitbarloop < ArbPrcnt){
    rentalPercentCompleteDisplay = (Rental.RentalCompositeStatusCode > 0) ? ((ArbPrcnt>1)?(rentalPercentCompleteDisplay.concat(`\x1b[32m]\x1b[0m`)):((ArbPrcnt>.9)?(rentalPercentCompleteDisplay.concat(`\x1b[33m]\x1b[0m`)):(rentalPercentCompleteDisplay.concat(`\x1b[31m]\x1b[0m`)))) : ((ArbPrcnt>1)?(rentalPercentCompleteDisplay.concat(`\x1b[2m\x1b[32m)\x1b[0m`)):((ArbPrcnt>.9)?(rentalPercentCompleteDisplay.concat(`\x1b[2m\x1b[33m)\x1b[0m`)):(rentalPercentCompleteDisplay.concat(`\x1b[2m\x1b[31m)\x1b[0m`))))
    profitbarloop += (1/chunks)  
    }
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`\n`)
    rentalPercentCompleteLoop = 0
    while (rentalPercentCompleteLoop < rentalcomplete - (1/chunks)) {
      rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`|`)
      rentalPercentCompleteLoop += (1/chunks)
    }
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(`\n`)
    boundarieslineloop = 0
    rentalPercentCompleteDisplay = rentalPercentCompleteDisplay.concat(horizontalline)
    

    var timestamp = new Date().getTime();
    var formatteddate = new Date(timestamp).toLocaleDateString("en-US")
    var formattedtime = new Date(timestamp).toLocaleTimeString("en-US")
    var rentalendtime = (RentalCompositeStatusCode >= 7)?(0):(Date.parse(Rental.RentalOrders.endTs))
    var formattedrentalendtime = new Date(rentalendtime).toLocaleTimeString("en-US")
    var timesincerentalended = 
    Math.floor(
      ((timestamp - rentalendtime)/(1000*60))
        *1)/1
    // console.log('SpartanBotCompositeStatusCode:', SpartanBotCompositeStatusCode)

    if(SpartanBotCompositeStatusCode === '001'){ //no orders; current arb op would be profitable and above requested min
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // ,`\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n
        ${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      } 
    } else if(SpartanBotCompositeStatusCode === '002'){ //no orders; current arb op would be profitable but less than requested min
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[32m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}
        ${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      }
    } else if(SpartanBotCompositeStatusCode === '003'){ //no orders; current arb op would be unprofitable
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}
        ${botStatusCodes[botStatusCode]}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`,
        // `\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}

        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m
        \x1b[31m\x1b[1m${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`,
        // `\n${horizontalline}`
        )
      }                   
    } else if(SpartanBotCompositeStatusCode === '102'){ //active order; rewards counted; looking profitable
      if (LiveEstimatesFromMining === undefined) { // too early, no estimates yet
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${horizontalline}\n\n\n\n${horizontalline}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$ ? (GPM: ? %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m ? \x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m ? \x1b[0m BTC (\x1b[4m$ ? \x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((Rental.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m\n${horizontalline}`)
      } else { //estimates are available
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${horizontalline}\n\n\n\n${horizontalline}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m

        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m\n${horizontalline}`)
      }
    } else if(SpartanBotCompositeStatusCode === '103'){ //active order; rewards counted; looking unprofitable so far
      if (LiveEstimatesFromMining === undefined) { // too early, no estimates yet
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${horizontalline}\n\n\n\n${horizontalline}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$ ? (GPM: ? %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m ? \x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m ? \x1b[0m BTC (\x1b[4m$ ? \x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((Rental.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m\n${horizontalline}`)
      } else { //estimates are available
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
      
        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m\n${horizontalline}`)
      } 
    } else if(SpartanBotCompositeStatusCode === '111'){ //active order; rewards pending; looking profitable
        console.log(
        `${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
        
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '112'){ //active order; rewards pending; looking profitable
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
      
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '113'){ //active order; rewards pending; looking unprofitable so far
      if (LiveEstimatesFromMining === undefined) { // too early, no estimates yet
        console.log(`${horizontalline}
        \x1b[33mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[CurrentConditions.MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[CurrentConditions.RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}

        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$ ? (GPM: ? %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m ? \x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m ? \x1b[0m BTC (\x1b[4m$ ? \x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((Rental.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
      } else { //estimates are available
        console.log(`${horizontalline}
        \x1b[33mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[CurrentConditions.MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[CurrentConditions.RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}

        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
      }
    } else if(SpartanBotCompositeStatusCode === '202'){ //active order ending soon, rewards counted, looking unprofitable
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
      
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '203'){
        console.log(`${horizontalline}
        \x1b[33mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[CurrentConditions.MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[CurrentConditions.RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}

        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m

        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '211'){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}
        ${CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
      
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m
        
        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '212'){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
      
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '213'){
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m
        
        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
        
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
      
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        Est Time Remaining In Rental: ${Rental.estTimeRemainingInRoundHours}:${Rental.estTimeRemainingInRoundMins}:${Rental.estTimeRemainingRSecs} \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '301'){
        console.log( //ended, bold green status, bold green profit
        `${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[32m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago`)
    } else if(SpartanBotCompositeStatusCode === '302'){
        console.log( //ended, green status, green profit
        `${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[32m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago`)     
    } else if(SpartanBotCompositeStatusCode === '303'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[CurrentConditions.MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[CurrentConditions.RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% ${Rental.RentalStatus}\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago`)    
    } else if(SpartanBotCompositeStatusCode === '306'){
      if (BotStatus.currentlyProfitable){
        console.log( //ended, bold green status, bold green profit
        `${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
      
        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[32m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.
        
        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago`)
      } else{
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago`)
        }
    } else if(SpartanBotCompositeStatusCode === '311'){
        console.log( //ended, bold green status, bold green profit
        `${horizontalline}  
        \x1b[32m\x1b[1mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[32m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '312'){
        console.log( //ended, green status, green profit
        `${horizontalline}  
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[32m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}
        
        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[32m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '313'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}  
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% ${Rental.RentalOrders.status.code}\n${rentalPercentCompleteDisplay}

        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '403'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}  
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}

        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '402'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}  
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}

        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '411'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}  
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}

        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '504'){
        console.log( //ended, bold red status, bold red profit
        `${horizontalline}  
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : Miner: ${this.UserInput.nextWorker} is ${MinerSubStatusCodes[CurrentConditions.MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[CurrentConditions.RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CurrentConditions.CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental ${RentalCompositeStatusCodes[CurrentRental.RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode}\x1b[0m : \x1b[31m\x1b[1m${SpartanBotStatus} ${botStatusCodes[botStatusCode]}\x1b[0m
      
        Rental ID: ${Rental.rentalOrderIdReadable} ${Math.round((Rental.rentalPercentComplete)*1e3)/1e1}% Complete\n${rentalPercentCompleteDisplay}

        Estimated Arbitrage Opportunity For Current Rental:
        Est profit of: \x1b[31m\x1b[1m$${LiveEstimatesFromMining.ProfitUsd} (GPM: ${Math.round((LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt)*1e4)/1e2} %)\x1b[0m, 
        Rented \x1b[4m${Rental.RentalOrders.limit}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m
        For \x1b[4m${Rental.rentalDuration}\x1b[0m hours at \x1b[4m${Rental.RentalOrders.price}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${LiveEstimatesFromMining.LiveEstimateQtyOfTokensToBeMined}\x1b[0m \x1b[4m${token}\x1b[0m (${LiveEstimatesFromMining.minedTokens} so far)
        Cost of Rental: \x1b[4m${Rental.RentalOrders.amount}\x1b[0m BTC (\x1b[4m$${Rental.CostOfRentalInUsd}\x1b[0m)
        Estimated Rev:  \x1b[4m${LiveEstimatesFromMining.ValueOfEstTokensAtMarketPrice}\x1b[0m BTC (\x1b[4m$${LiveEstimatesFromMining.ValueOfEstTokensAtMktPriceUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((LiveEstimatesFromMining.actualNetworkPercent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${CurrentConditions.poolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m Rental Ended ${timesincerentalended} minutes ago` 
        )
    } else if(SpartanBotCompositeStatusCode === '701'){ //no orders; current arb op would be profitable and above requested min
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // ,`\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n
        ${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      } 
    } else if(SpartanBotCompositeStatusCode === '702'){ //no orders; current arb op would be profitable but less than requested min
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[32m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[32mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${CurrentRental.RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[32m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}
        ${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[32m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`
        // `\n${horizontalline}`
        )
      }
    } else if(SpartanBotCompositeStatusCode === '703'){ //no orders; current arb op would be unprofitable
      if (CurrentConditions.UsersBalance < 0.005){
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}
      
        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}
        \x1b[5m\x1b[31mUser Balance in Provider Wallet too low for a rental \x1b[0m
        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}
        ${botStatusCodes[botStatusCode]}\x1b[0m\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`,
        // `\n${horizontalline}`
        )
      } else {
        console.log(`${horizontalline}
        \x1b[31mSpartanBot Status at ${formattedtime} on ${formatteddate} (${timestamp}):\x1b[0m

        ${CurrentConditions.MinerSubStatusCode} : ${MinerSubStatusCodes[MinerSubStatusCode]}
        ${CurrentConditions.RoundSharesSubStatusCode} : Round Shares ${RoundSharesSubStatusCodes[RoundSharesSubStatusCode]}
        ${CurrentConditions.CandidateBlocksSubStatusCode} : Candidate Blocks: ${CandidateBlocksSubStatusCodes[CandidateBlocksSubStatusCode]}

        ${RentalCompositeStatusCode} : Rental Provider has ${RentalCompositeStatusCodes[RentalCompositeStatusCode]}
        ${CurrentConditions.RewardsCompositeCode} : ${RewardsCompositeCodes[CurrentConditions.RewardsCompositeCode]}
        ${botStatusCode} : ${botStatusCodes[botStatusCode]}

        \x1b[31m\x1b[1m${SpartanBotCompositeStatusCode} : ${SpartanBotStatus}\x1b[0m
        \x1b[31m\x1b[1m${botStatusCodes[botStatusCode]}\x1b[0m\n\n${rentalPercentCompleteDisplay}

        Best Arbitrage Opportunity For Current Conditions:
        Est profit of: \x1b[31m\x1b[1m$${BestArbitrageCurrentConditions.ProjectedProfitInUsd} (GPM: ${Math.round((BestArbitrageCurrentConditions.ProjectedProfitMargin)*1e4)/1e2} %)\x1b[0m, 
        Rent \x1b[4m${BestArbitrageCurrentConditions.HashrateToRent}\x1b[0m \x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m from the \x1b[4m${CurrentConditions.marketpreferenceKawpow}\x1b[0m Market
        For \x1b[4m${BestArbitrageCurrentConditions.RentalDuration}\x1b[0m hours at \x1b[4m${BestArbitrageCurrentConditions.RentalHashPrice}\x1b[0m BTC/\x1b[4m${CurrentConditions.MarketFactorName}\x1b[0m/Day.

        Estimated Rewards: \x1b[4m${BestArbitrageCurrentConditions.ProjectedTokenRewards}\x1b[0m \x1b[4m${token}\x1b[0m
        Cost of Rental: \x1b[4m${BestArbitrageCurrentConditions.CostOfRentalInBtc}\x1b[0m BTC (\x1b[4m$${Math.round((BestArbitrageCurrentConditions.CostOfRentalInUsd)*1e2)/1e2}\x1b[0m)
        Estimated Rev:  \x1b[4m${BestArbitrageCurrentConditions.ProjectedRevenueInBtc}\x1b[0m BTC (\x1b[4m$${BestArbitrageCurrentConditions.ProjectedRevenueInUsd}\x1b[0m) 
        NetworkPercent: \x1b[4m${Math.round((BestArbitrageCurrentConditions.NetworkPercentToRent)*1e4)/1e2}\x1b[0m %
        Est PoolWeight: \x1b[4m${BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier}\x1b[0m
        Pool is Currently: \x1b[4m${CurrentConditions.currentlyLuckyWords} (${CurrentConditions.luck64rounded})\x1b[0m
        and Trending: \x1b[4m${CurrentConditions.luckTrend}\x1b[0m

        \x1b[5mNext Update In: ${nextUpdateInSecs} seconds \x1b[0m`,
        // `\n${horizontalline}`
        )
      }
    } else if(SpartanBotCompositeStatusCode === '899'){
      console.log(
        `
        SpartanBot Status at ${timestamp}:
        \x1b[36m\x1b[1m${SpartanBotStatus} (${Rental.SpartanBotCompositeStatusCode})\x1b[0m`)
    } else if(SpartanBotCompositeStatusCode === '908'){
      console.log(
        `
        SpartanBot Status at ${timestamp}:
        \x1b[36m\x1b[1m${SpartanBotStatus} (${SpartanBotCompositeStatusCode})\x1b[0m`)
    }
  }

  async getcurrentconditions(token, tokenAlgo, minDuration, tokensPerBlock, blocksPerHour) {
    let _this = this

    try{
      let UsersBalance = await this.provider.provider.getBalance();
      // let UsersBalance = 10;
      let summariesKawpowUSA = await this.provider.provider.getStandardPrice('KAWPOW','USA')
      // console.log('SummariesKawpowUSA:', summariesKawpowUSA)
      let summariesKawpowEU = await this.provider.provider.getStandardPrice('KAWPOW','EU')
      let summariesScryptUSA = await this.provider.provider.getStandardPrice('SCRYPT','USA')
      let summariesScryptEU = await this.provider.provider.getStandardPrice('SCRYPT','EU')
      let orderBookKawpow = await this.provider.provider.getOrderBook('KAWPOW')
      let totalSpeedKawpowUSA = orderBookKawpow.stats.USA.totalSpeed;
      let totalSpeedKawpowEU = orderBookKawpow.stats.EU.totalSpeed;
      let orderBookScrypt = await this.provider.provider.getOrderBook('SCRYPT')
      let totalSpeedScryptUSA = orderBookScrypt.stats.USA.totalSpeed;
      let totalSpeedScryptEU = orderBookScrypt.stats.EU.totalSpeed;

      let NicehashMins = await nicehashMins()
          
      let nicehashAlgoDownstep = NicehashMins.down_step

      let StayCompetitive = - (nicehashAlgoDownstep) * 2
      let PriceRentalStandardKawpowUSA = Math.round(( (10000 * summariesKawpowUSA.summaries['USA,KAWPOW'].payingPrice) + StayCompetitive )*1e4)/1e4
      let PriceRentalStandardKawpowEU = Math.round(( (10000 * summariesKawpowEU.summaries['EU,KAWPOW'].payingPrice) + StayCompetitive )*1e4)/1e4
      let PriceRentalStandardScryptUSA = Math.round(( 10000 * summariesScryptUSA.summaries['USA,SCRYPT'].payingPrice )*1e4)/1e4
      let PriceRentalStandardScryptEU = Math.round(( 10000 * summariesScryptEU.summaries['EU,SCRYPT'].payingPrice )*1e4)/1e4
      // console.log('PriceRentalStandardKawpowUSA:', PriceRentalStandardKawpowUSA)
      // console.log('PriceRentalStandardKawpowEU:', PriceRentalStandardKawpowEU)
      // console.log('PriceRentalStandardScryptUSA:', PriceRentalStandardScryptUSA)
      // console.log('PriceRentalStandardScryptEU:', PriceRentalStandardScryptEU)
      let marketpreferenceKawpow = (PriceRentalStandardKawpowUSA <= PriceRentalStandardKawpowEU) ? ((totalSpeedKawpowUSA >= (totalSpeedKawpowEU/2))?('USA'):('EU')) : ('EU')
      let marketpreferenceScrypt = (PriceRentalStandardScryptUSA <= PriceRentalStandardScryptEU) ? ((totalSpeedScryptUSA >= (totalSpeedScryptEU/2))?('USA'):('EU')) : ('EU')
      // console.log('marketpreferenceKawpow:', marketpreferenceKawpow)
      let PriceRentalStandardKawpow = (marketpreferenceKawpow = 'EU') ? (PriceRentalStandardKawpowEU) : ((marketpreferenceKawpow = 'USA')?(PriceRentalStandardKawpowUSA):('error'))
      let PriceRentalStandardScrypt = (marketpreferenceScrypt = 'EU') ? (PriceRentalStandardScryptEU) : ((marketpreferenceScrypt = 'USA')?(PriceRentalStandardScryptUSA):('error'))
      let PriceRentalStandard = (tokenAlgo === 'KAWPOW') ? (PriceRentalStandardKawpow) : (tokenAlgo === 'SCRYPT') ? (PriceRentalStandardScrypt) : (null);
      let marketFactorKawpow = orderBookKawpow.stats.USA.marketFactor
      let marketFactorNameKawpow = orderBookKawpow.stats.USA.displayMarketFactor
      let marketFactorScrypt = orderBookScrypt.stats.USA.marketFactor
      let marketFactorNameScrypt = orderBookScrypt.stats.USA.displayMarketFactor
      let marketFactor = (tokenAlgo === 'KAWPOW') ? (marketFactorKawpow) : (tokenAlgo === 'SCRYPT') ? (marketFactorScrypt) : (null);
      let MarketFactorName = (tokenAlgo === 'KAWPOW') ? (marketFactorNameKawpow) : (tokenAlgo === 'SCRYPT') ? (marketFactorNameScrypt) : (null);
      

      async function rvnexplorerstats() {
        let apiURL ="https://main.rvn.explorer.oip.io/api/statistics/pools";
        return await new Promise ((resolve, reject) => {
          https.get(apiURL, (response) => {
            let body = ''
            response.on('data', (chunk) => {
              body += chunk;
            });
            response.on('end', () => {
              try { 
                let data = JSON.parse(body);
                let dat1 = data.blocks_by_pool;
                if (dat1 === undefined) { 
                  let leadingMinerShare = 0;
                  let myPoolShare = 0;
                  let poolDominanceMultiplier = 1;
                  let secondPlaceMinerShare = 0;
                  resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
                } else { 
                  let blocksminedtoday = data.n_blocks_mined
                  let current = data.pagination.current;
                  let prev = data.pagination.prev;
                  if (blocksminedtoday > 60) { //if lots of blocks   
                    for (let i = 0; i < dat1.length; i++) {
                      if (dat1[i].poolName === "2Miners PPLNS") {
                        let totals = dat1.slice(0, i + 1);
                        let leadingMinerShare = parseFloat(dat1[0].percent_total);
                        let secondPlaceMinerShare = parseFloat(dat1[1].percent_total);
                        let myPoolShare = parseFloat(totals.slice(-1)[0].percent_total);
                        if (myPoolShare = leadingMinerShare){
                          let poolDominanceMultiplier = Math.round(((Math.pow((myPoolShare/secondPlaceMinerShare),1.01)+4)/5)*1e2)/1e2
                          resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare, blocksminedtoday, prev});
                        } else {
                          let poolDominanceMultiplier = Math.pow((myPoolShare / leadingMinerShare),.18)
                          resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare, blocksminedtoday, prev});
                        }
                      }
                    }
                  } else { // not enough blocks
                    let leadingMinerShare = null
                    let myPoolShare = null
                    let poolDominanceMultiplier = null
                    let secondPlaceMinerShare = null
                  resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare, blocksminedtoday, prev});
                  } // not enough blocks
                } // end of else (can read data)
              } catch(error){ //couldnt parse body into json
                console.log("RVN Explorer Error, Explorer Offline", error)
                let leadingMinerShare = 0.5;
                let myPoolShare = 0.5;
                let poolDominanceMultiplier = 1;
                let secondPlaceMinerShare = 0.5;
                resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
              } // end of catch
            }) // end of response on end
          }).on("error", (error) => {
            console.log("Error: " + error.message);
            reject("Error: " + error.message)
          })
        }) //if pool luck can work more effectively, this funtion can be removed entirely // this could be redundant if pool luck was used instead
      }

      async function rvnexplorerstatsprev(prev) {
        let apiURLbaseprev = "https://main.rvn.explorer.oip.io/api/statistics/pools?date="
        let apiURLprev = apiURLbaseprev.concat(prev)
        return await new Promise ((resolve, reject) => {
          https.get(apiURLprev, (response) => {
            let body = ''
            response.on('data', (chunk) => {
              body += chunk;
            });
            response.on('end', () => {
              try { // try to parse the body into json
                let data = JSON.parse(body);
                let dat1 = data.blocks_by_pool;
                if (dat1 === undefined) { //cant read anything
                  let leadingMinerShare = 0;
                  let myPoolShare = 0;
                  let poolDominanceMultiplier = 1;
                  let secondPlaceMinerShare = 0;
                  resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
                } else { //can read the data (does this matter?)
                  let blocksminedtoday = data.n_blocks_mined
                    for (let i = 0; i < dat1.length; i++) {
                      if (dat1[i].poolName === "2Miners PPLNS") {
                        
                        let totals = dat1.slice(0, i + 1);
                        let leadingMinerShare = parseFloat(dat1[0].percent_total);
                        let secondPlaceMinerShare = parseFloat(dat1[1].percent_total);
                        let myPoolShare = parseFloat(totals.slice(-1)[0].percent_total);
                        if (myPoolShare = leadingMinerShare){ 
                          let poolDominanceMultiplier = Math.round(((Math.pow((myPoolShare/secondPlaceMinerShare),1.01)+4)/5)*1e2)/1e2
                          resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
                        } else {
                          let poolDominanceMultiplier = Math.pow((myPoolShare / leadingMinerShare),.18)
                          resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
                        }
                      }
                    }
                } // end of else (can read data)
              } catch(error){ //couldnt parse body into json
                console.log("RVN Explorer Error, Explorer Offline", error)
                let leadingMinerShare = 0.5;
                let myPoolShare = 0.5;
                let poolDominanceMultiplier = 1;
                let secondPlaceMinerShare = 0.5;
                resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
              } // end of catch
            }) // end of response on end
          }).on("error", (error) => {
            console.log("Error: " + error.message);
            reject("Error: " + error.message)
          })
        }) //if pool luck can work more effectively, this funtion can be removed entirely // this could be redundant if pool luck was used instead
      }

      async function floexplorerstats() {
        let apiURL =
          "https://livenet.flocha.in/api/blocks?limit=90";
        return await new Promise ((resolve, reject) => {
          https.get(apiURL, (response) => {
            let body = ''
            response.on('data', (chunk) => {
              body += chunk;
            });
            response.on('end', () => {
              try{
                let data = JSON.parse(body);
                let leadingMinerShare = 0;
                let myPoolShare = 0;
                let poolDominanceMultiplier = 1;
                let secondPlaceMinerShare = 0;
                resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare});
              } catch(error){
                console.log("Flo Explorer Error", error)
                let leadingMinerShare = 0;
                let myPoolShare = 0;
                let poolDominanceMultiplier = 1;
                let secondPlaceMinerShare = 0;
                resolve ({leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare})
              }
            })
          }).on("error", (error) => {
            console.log("Flo Explorer Error: " + error.message);
            reject("Error: " + error.message)
          })
        }) //if pool luck can work more effectively, this funtion can be removed entirely // this could be redundant if pool luck was used instead
      }
      
      let StatsFromExplorer = await rvnexplorerstats();
      let leadingMinerShareCurrent = StatsFromExplorer.leadingMinerShare;
      let myPoolShareCurrent = StatsFromExplorer.myPoolShare;
      let poolDominanceMultiplierCurrent = StatsFromExplorer.poolDominanceMultiplier;
      let secondPlaceMinerShareCurrent = StatsFromExplorer.secondPlaceMinerShare;
      let blocksminedtoday = StatsFromExplorer.blocksminedtoday;
      let StatsFromExplorerPrev = await rvnexplorerstatsprev(StatsFromExplorer.prev);
      let leadingMinerSharePrev = StatsFromExplorerPrev.leadingMinerShare
      let myPoolSharePrev = StatsFromExplorerPrev.myPoolShare
      let poolDominanceMultiplierPrev = StatsFromExplorerPrev.poolDominanceMultiplier
      let secondPlaceMinerSharePrev = StatsFromExplorerPrev.secondPlaceMinerShare
      let immatureDay = (blocksminedtoday < 60)
      let leadingMinerShare = (immatureDay) ? (leadingMinerSharePrev) : (leadingMinerShareCurrent);
      let myPoolShare = (immatureDay) ? (myPoolSharePrev) : (myPoolShareCurrent);
      let poolDominanceMultiplier = (immatureDay) ? (poolDominanceMultiplierPrev) : (poolDominanceMultiplierCurrent)
      let secondPlaceMinerShare = (immatureDay) ? (secondPlaceMinerSharePrev) : (secondPlaceMinerShareCurrent)

      async function datafrompoolrvn2miners(nextWorker, marketFactor) {
        async function rvn2minersstats( props ) {
          return await new Promise((resolve, reject) => {
            let URL = "https://rvn.2miners.com/api/stats";
            https
              .get(URL, (response, reject) => {
                {
                  //work has been received
                  let body = "";
                  response.on("data", (chunk) => {
                    body += chunk;
                  });
                  response.on("end", () => {
                    let data = JSON.parse(body);
                    let networkhashps = data.nodes[0].networkhashps;
                    let Networkhashrate = Math.round((networkhashps / marketFactor)*1e3)/1e3;
                    let Poolhashrate = Math.round((data.hashrate / marketFactor)*1e3)/1e3;
                    let blockheight = data.nodes[0].height
                    let avgBlockTime = data.nodes[0].avgBlockTime
                    // let poolluck = data.luck
                    // console.log(data)
                      resolve({networkhashps, Networkhashrate, Poolhashrate, blockheight, avgBlockTime});
                  });
                }
              })
              .on("error", (error) => {
                console.log("Error rvn2minersstats: " + error.message);
                reject("Error: " + error.message);
              });
          });
        }

        async function rvn2minersblocks (){
          let apiURL =
            "https://rvn.2miners.com/api/blocks";
          return await new Promise ((resolve, reject) => {
            https.get(apiURL, (response) => {
              let body = ''
              response.on('data', (chunk) => {
                body += chunk;
              });
              response.on('end', () => {
                try {
                  let data = JSON.parse(body); // can we parse the body (is there anything)?
                  let candidates = data.candidatesTotal
                  let immature = data.imatureTotal
                  let luck1024 = data.luck['1024'].luck
                  let luck256 = data.luck['256'].luck
                  let luck128 = data.luck['128'].luck
                  let luck64 = data.luck['64'].luck 
                  let luckhistory = data.luck
                  let bestLuck = Math.min(luck64, luck128, luck256, luck1024)
                  let currentlyLucky = (luck64 < 1) ? (true) : (false)
                  let luckTrend = (bestLuck === luck64) ? ('up recently') : (bestLuck === luck1024) ? ('down overall') : (bestLuck === luck128) ? ('up in past two hours but down in recent hour') : (bestLuck === luck256) ? ('down in past four hours') : ('i dont know')
                  if (candidates > 0) {
                    let CandidateBlocksSubStatusCode = 1
                    let lastcandidate = candidates - 1
                    let candidateheight = data.candidates[lastcandidate].height
                    resolve({candidates, candidateheight, CandidateBlocksSubStatusCode, luck1024, luck256, luck128, luck64, bestLuck, currentlyLucky, luckTrend})  
                  } else if (candidates === 0){
                    let CandidateBlocksSubStatusCode = 0
                    let candidateheight = null
                    resolve({candidates, candidateheight, CandidateBlocksSubStatusCode, luck1024, luck256, luck128, luck64, bestLuck, currentlyLucky, luckTrend})
                  }
                }
                catch (error) {
                  console.log('rvn2minersblocks',error)
                }
              })
            }).on("error", (error) => {
              let CandidateBlocksSubStatusCode = 9
              console.log("Error: " + error.message);
              reject("Error: " + error.message, CandidateBlocksSubStatusCode)
            })
          })
        }

        async function rvn2minersaccounts( props ) { // sets miner status code
          // console.log('running rvn2minersaccounts')
          return await new Promise((resolve, reject) => {
            let endpointbase = "https://rvn.2miners.com/api/accounts/";
            let URL = endpointbase.concat(nextWorker);
            https
              .get(URL, (response, reject) => {
                {
                  let body = "";
                  response.on("data", (chunk) => {
                    body += chunk;
                  });
                  response.on("end", () => {     
                    try {
                      let data = JSON.parse(body) //can body be parsed into JSON?
                      // console.log('body can be parsed')
                      let roundShares = data.roundShares
                      try { //can hashrate be read?
                        let currentHashrate = data.currentHashrate;
                        let currentHashrateReadable = currentHashrate / marketFactor;
                        let workersOnline = (data.workersOnline === undefined) ? 0 : (data.workersOnline)
                        var rewardsImmature = (data.stats.immature === undefined) ? 0 : (data.stats.immature / 1e8)
                        var rewardsBalance = (data.stats.balance === undefined) ? 0 : (data.stats.balance / 1e8)
                        var rewardsPaid = (data.stats.paid === undefined) ? 0 : (data.stats.paid / 1e8)
                        let rewardsCheck = rewardsImmature + rewardsBalance + rewardsPaid                    
                        let rewardsTotal = (rewardsCheck > 0) ? (rewardsImmature + rewardsBalance + rewardsPaid) : (0)
                        let earnedRewardsCheck = Math.round((rewardsTotal - rewardsBeforeRental)*1e8)/1e8
                        let earnedRewards = (earnedRewardsCheck > 0) ? (earnedRewardsCheck) : (0)
                        let rewardsStillPending = (data.rewards == null) ? (0) : (data.rewards[0].immature)
                        let lastShare = data.stats.lastShare * 1000
                        let timestamp = new Date().getTime();
                        let timeSinceLastShare = timestamp - lastShare
                        let recentlyMinedThreshold = 15 * 60 * 1000 // 15 minutes
                        let currentlyMiningThreshold = 2 * 60 * 1000 // 2 minutes
                        let averageHashrate = data.hashrate;
                        let MinerSubStatusCode = (timeSinceLastShare > recentlyMinedThreshold) ? (0) : ((timeSinceLastShare < currentlyMiningThreshold)?(1):(2)) 

                        resolve({  workersOnline, currentHashrate, currentHashrateReadable, rewardsBeforeRental, rewardsTotal, earnedRewards, rewardsStillPending, roundShares, rewardsImmature, rewardsBalance, rewardsPaid, MinerSubStatusCode, timeSinceLastShare})
                      }catch (error) { // if no, hashrate cannot be read
                        console.log('hashrate cannot be read')
                        let MinerSubStatusCode = 3
                        console.log('error', error, MinerSubStatusCodes[MinerSubStatusCode], `(Miner Status Code: ${MinerSubStatusCode})`)
                        let currentHashrate = 0
                        let currentHashrateReadable = 0
                        let workersOnline = 0
                        resolve({ workersOnline, currentHashrate, currentHashrateReadable, marketFactorName, rewardsBeforeRental, rewardsTotal, earnedRewards, rewardsStillPending, roundShares, MinerSubStatusCode})
                      }
                    }catch (error) { //if no, body cannot be parsed, new worker
                      let MinerSubStatusCode = 4
                      let currentHashrate = 0
                      let currentHashrateReadable = 0
                      let rewardsCheck = rewardsImmature + rewardsBalance + rewardsPaid                    
                      let rewardsTotal = (rewardsCheck > 0) ? (rewardsImmature + rewardsBalance + rewardsPaid) : (0)
                      let earnedRewardsCheck = Math.round((rewardsTotal - rewardsBeforeRental)*1e8)/1e8
                      let earnedRewards = (earnedRewardsCheck > 0) ? (earnedRewardsCheck) : (0)
                      let rewardsStillPending = null
                      let roundShares = 0
                      let workersOnline = 0
                      resolve({  workersOnline, currentHashrate, currentHashrateReadable, rewardsBeforeRental, rewardsTotal, earnedRewards, rewardsStillPending, roundShares, MinerSubStatusCode}) 
                    }
                  });
                }
              }).on("error", (error) => {
                let MinerSubStatusCode = 9
                console.log("Error: " + error.message);
                reject("Error: " + error.message);
              });
          });
        }

        let Rvn2MinersStats = await rvn2minersstats(marketFactor);
        let networkhashps = Rvn2MinersStats.networkhashps;
        let Networkhashrate = Rvn2MinersStats.Networkhashrate;
        let blockheight = Rvn2MinersStats.blockheight;
        // let poolluck = Rvn2MinersStats.poolluck;
        let avgBlockTime = Rvn2MinersStats.avgBlockTime;

        let Rvn2minersBlocks = await rvn2minersblocks();
        let candidates = Rvn2minersBlocks.candidates
        let candidateheight = Rvn2minersBlocks.candidateheight
        let CandidateBlocksSubStatusCode = Rvn2minersBlocks.CandidateBlocksSubStatusCode
        let luck1024 = Rvn2minersBlocks.luck1024;
        let luck256 = Rvn2minersBlocks.luck256;
        let luck128 = Rvn2minersBlocks.luck128;
        let luck64 = Rvn2minersBlocks.luck64;
        let bestLuck = Rvn2minersBlocks.bestLuck;
        let currentlyLucky = Rvn2minersBlocks.currentlyLucky;
        let luckTrend = Rvn2minersBlocks.luckTrend;

        let Rvn2MinersAccounts = await rvn2minersaccounts(nextWorker, marketFactor, rewardsBeforeRental);
        let workersOnline = Rvn2MinersAccounts.workersOnline
        let currentHashrate = Rvn2MinersAccounts.currentHashrate
        let currentHashrateReadable = Rvn2MinersAccounts.currentHashrateReadable
        let rewardsTotal = Rvn2MinersAccounts.rewardsTotal
        let rewardsStillPending = Rvn2MinersAccounts.rewardsStillPending
        let earnedRewards = Rvn2MinersAccounts.earnedRewards
        let roundShares = Rvn2MinersAccounts.roundShares
        let rewardsImmature = Rvn2MinersAccounts.rewardsImmature
        let rewardsBalance = Rvn2MinersAccounts.rewardsBalance
        let rewardsPaid = Rvn2MinersAccounts.rewardsPaid
        let MinerSubStatusCode = Rvn2MinersAccounts.MinerSubStatusCode

        let RoundSharesSubStatusCode = (roundShares === 0) ? (0) : (1)
        // console.log('MinerSubStatusCode:', MinerSubStatusCode, MinerSubStatusCodes[MinerSubStatusCode])
        let RewardsCompositeCode = (MinerSubStatusCode === 1) ? (Math.max(RoundSharesSubStatusCode,CandidateBlocksSubStatusCode, workersOnline)) : ((MinerSubStatusCode === 2)?(1):((MinerSubStatusCode === 0)?(0):((MinerSubStatusCode === 4)?(0):('error1234'))))
        return {  workersOnline, currentHashrate, currentHashrateReadable, rewardsBeforeRental, rewardsTotal, earnedRewards, rewardsStillPending, roundShares, networkhashps, Networkhashrate, blockheight, MinerSubStatusCode, RoundSharesSubStatusCode, CandidateBlocksSubStatusCode, RewardsCompositeCode, candidateheight, avgBlockTime, luck1024, luck256, luck128, luck64, bestLuck, currentlyLucky, luckTrend};
      }

      let rewardsBeforeRental;
      let DataFromPool = await datafrompoolrvn2miners(_this.UserInput.nextWorker, marketFactor, rewardsBeforeRental); // try moving the funtion itself outside of Getcurrentconditions and see if it still works
      let workersOnline = DataFromPool.workersOnline;
      let currentHashrate = DataFromPool.currentHashrate;
      let currentHashrateReadable = DataFromPool.currentHashrateReadable;
      let rewardsTotal = DataFromPool.rewardsTotal;
      let earnedRewards = DataFromPool.earnedRewards;
      let rewardsStillPending = DataFromPool.rewardsStillPending;
      let roundShares = DataFromPool.roundShares;
      let networkhashps = DataFromPool.networkhashps;
      let Networkhashrate = DataFromPool.Networkhashrate;
      let blockheight = DataFromPool.blockheight;
      let MinerSubStatusCode = DataFromPool.MinerSubStatusCode;
      let RewardsCompositeCode = DataFromPool.RewardsCompositeCode;
      let RoundSharesSubStatusCode = DataFromPool.RoundSharesSubStatusCode;
      let CandidateBlocksSubStatusCode = DataFromPool.CandidateBlocksSubStatusCode;
      let candidateheight = DataFromPool.candidateheight;
      // let poolluck = DataFromPool.poolluck;
      let avgBlockTime = DataFromPool.avgBlockTime;
      let luck1024 = DataFromPool.luck1024;
      let luck256 = DataFromPool.luck256;
      let luck128 = DataFromPool.luck128;
      let luck64 = DataFromPool.luck64;
      let bestLuck = DataFromPool.bestLuck;
      let currentlyLucky = DataFromPool.currentlyLucky;
      let luckTrend = DataFromPool.luckTrend;
      let luck64rounded = Math.round((luck64)*1e2)/1e2
      let currentlyLuckyWords = (currentlyLucky) ? ('lucky') : ('not currently lucky')

      async function exchanges(token) {

        async function priceusdperbtconcoinbase() {
          return await new Promise((resolve, reject) => {
            https.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC', (response) => {
              let body = ''
              response.on('data', (chunk) => {
                body += chunk;
              });
              response.on('end', () => {
                let data = JSON.parse(body);
                if(!data) 
                  console.log('Something wrong with the api or syntax');
                let PriceUsdPerBtcOnCoinbase = 
                  Math.round((data.data.rates.USD)*1e2)/1e2;
                resolve(PriceUsdPerBtcOnCoinbase);
              });
            }).on("error", (error) => {
              console.log("Error: " + error.message);
              reject("Error: " + error.message)
            });
          });
        }

        async function priceperfloonbittrex() {
          return await new Promise((resolve, reject) => {
            https
              .get(
                'https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-FLO', 
                (response) => {
                  let body = "";
                  response.on("data", (chunk) => {
                body += chunk;
              });
              response.on('end', () => {
                let data = JSON.parse(body)
                if(!data) 
                  console.log('Something wrong with the api or syntax');
                let bittrexMultiplier = 1
                let PriceBtcPerTokenOnBittrex = 
                  Math.round((data.result.Last*bittrexMultiplier)*1e8)/1e8;
                resolve(PriceBtcPerTokenOnBittrex);
              });
            }
          )
          .on("error", (error) => {
            console.log("Error: " + error.message);
            reject("Error: " + error.message)
          });
          });
        }

        async function priceperrvnonbittrex() {
          return await new Promise((resolve, reject) => {
            https
              .get(
                'https://api.bittrex.com/v3/markets/RVN-BTC/ticker', 
                (response) => {
                  let body = ''
                  response.on('data', (chunk) => {
                    body += chunk;
                  });
                  response.on('end', () => {
                    let data = JSON.parse(body)
                    if(!data) 
                      console.log('Something wrong with the api or syntax')
                    let bittrexMultiplier = 1
                    let PriceBtcPerTokenOnBittrex = 
                      Math.round((data.bidRate*bittrexMultiplier)*1e8)/1e8;
                    resolve(PriceBtcPerTokenOnBittrex);
                  })
                }
              )
              .on("error", (error) => {
                console.log("Error: " + error.message);
                reject("Error: " + error.message)
              });
          });
        }

        async function priceusdperbtconbittrex() {
          return await new Promise((resolve, reject) => {
            https
              .get(
                'https://api.bittrex.com/v3/markets/BTC-USD/ticker',
                (response) => {
                  let body = ''
                  response.on('data', (chunk) => {
                    body += chunk;
                  });
                  response.on('end', () => {
                    let data = JSON.parse(body)
                    if(!data) 
                      console.log('Something wrong with the api or syntax');
                    let bittrexMultiplier = 1
                    let PriceUsdPerBtcOnBittrex = 
                      Math.round((data.bidRate*bittrexMultiplier)*1e2)/1e2;
                    resolve(PriceUsdPerBtcOnBittrex);
                  });
                }
              )
              .on("error", (error) => {
                console.log("Error: " + error.message);
                reject("Error: " + error.message)
              })
          })
        }
      
        if (/RVN/.test(token)) {
          let TokenPair = 'BTC-RVN';
          let PriceUsdPerBtcOnCoinbase = await priceusdperbtconcoinbase();
          let PriceUsdPerBtcOnBittrex = await priceusdperbtconbittrex();
          let MarketPricePerTokenInBtc = await priceperrvnonbittrex();
          return {
            PriceUsdPerBtcOnCoinbase, 
            PriceUsdPerBtcOnBittrex, 
            TokenPair,
            MarketPricePerTokenInBtc
          };
          } else {
            if (/FLO/.test(token)) {
              let TokenPair = 'BTC-FLO';
              let PriceUsdPerBtcOnCoinbase = await priceusdperbtconcoinbase();
              let PriceBtcPerTokenOnBittrex = await priceperfloonbittrex();
              let PriceUsdPerBtcOnBittrex = await priceusdperbtconbittrex();
              let MarketPricePerTokenInBtc = PriceBtcPerTokenOnBittrex
              return {
                PriceUsdPerBtcOnCoinbase, 
                PriceUsdPerBtcOnBittrex,
                TokenPair,
                MarketPricePerTokenInBtc
            };
          }
        }  
      } 

      let Exchanges = await exchanges(token);
      let PriceUsdPerBtcOnCoinbase = Exchanges.PriceUsdPerBtcOnCoinbase;
      let PriceUsdPerBtcOnBittrex = Exchanges.PriceUsdPerBtcOnBittrex;
      let MarketPriceUsdPerBtc = Math.round((PriceUsdPerBtcOnCoinbase + PriceUsdPerBtcOnBittrex)/2*1e2)/1e2
      let TokenPair = Exchanges.TokenPair;
      let MarketPricePerTokenInBtc = Exchanges.MarketPricePerTokenInBtc;
      let MaxPercentFromAvailRigs = (marketpreferenceKawpow === 'EU') ? (totalSpeedKawpowEU * 1 / Networkhashrate) : (totalSpeedKawpowUSA / Networkhashrate)
      let suggestedMinRentalDuration = Math.round((9 / (myPoolShare/100 * blocksPerHour / luck64))*1e3)/1e3
      let MaxPercentFromAvailBal = UsersBalance / (UsersBalance + (suggestedMinRentalDuration * PriceRentalStandard/24 * Networkhashrate))
      // console.log(MaxPercentFromAvailBal)
      let MaxPercent = Math.min(MaxPercentFromAvailBal,MaxPercentFromAvailRigs, .35)

      async function calculations(Networkhashrate, PriceRentalStandard, MarketPricePerTokenInBtc, tokensPerBlock, blocksPerHour) {
        let HourlyMiningCostInBtc = Math.round((Networkhashrate * PriceRentalStandard / 24)*1e6)/1e6;
        let HourlyMiningValueInBtc = Math.round(blocksPerHour * tokensPerBlock * MarketPricePerTokenInBtc * 1e6)/ 1e6;
        return { HourlyMiningValueInBtc, HourlyMiningCostInBtc};
      }

      let Calculations = await calculations(Networkhashrate, PriceRentalStandard, MarketPricePerTokenInBtc, tokensPerBlock, blocksPerHour);
      let HourlyMiningCostInBtc = Calculations.HourlyMiningCostInBtc;
      let HourlyMiningValueInBtc = Calculations.HourlyMiningValueInBtc;

      async function nicehashMins(tokenAlgo) {
        return await new Promise((resolve, reject) => {
            https
            .get(
                'https://api2.nicehash.com/main/api/v2/public/buy/info',
                (response) => {
                    let body = ''
                    response.on('data', (chunk) => {
                        body += chunk;
                    });
                    response.on('end', () => {
                    let data = JSON.parse(body)
                    if(!data) 
                      console.log('Something wrong with the api or syntax');
                
                    // let NicehashMins = data;
                    let algos = data.miningAlgorithms.length
                    let algo;
                    let loop = 0
                    while (algo != 52) {
                        algo = data.miningAlgorithms[loop].algo;
                        loop += 1;
                    }
                    let NicehashMinsForRvn = data.miningAlgorithms[loop-1]
                    loop = 0
                    while (algo != 0) {
                        algo = data.miningAlgorithms[loop].algo;
                        loop += 1;
                    }
                    let NicehashMinsForFlo = data.miningAlgorithms[loop-1]
                    let NicehashMins = (/RVN/.test(token)) ? (NicehashMinsForRvn) : (NicehashMinsForFlo)
                    // console.log('NicehashMinsForRvn:', NicehashMinsForRvn, 'NicehashMinsForFlo:', NicehashMinsForFlo)
                    resolve(NicehashMins);
                });
                })
            .on("error", (error) => {
                console.log("Error: " + error.message);
                reject("Error: " + error.message);
            })
        })
      }

      

      async function minimums(token, tokenAlgo, Networkhashrate, marketFactor, networkhashps, PriceRentalStandard, PriceUsdPerBtcOnCoinbase, HourlyMiningValueInBtc, HourlyMiningCostInBtc, minDuration) {
        let BittrexWithdrawalFee = 0.00005;
        let BittrexMinWithdrawal = 0.00015;
        let NicehashMins = await nicehashMins()
        
        // let nicehashMinRentalCost = 0.002;
        
        let nicehashMinRentalCost = NicehashMins.min_amount
        
        let MinPercentFromNHMinAmount = Math.round((nicehashMinRentalCost / (((Networkhashrate * PriceRentalStandard) / 24) * minDuration + nicehashMinRentalCost)) * 1e6 ) / 1e6;

        async function MinPercentFromNHMinLimitCalc(props) {
          async function MinPercentFromNHMinLimitKawpow(props) {
            let Networkhashrate = networkhashps / marketFactor
            let MinPercentFromNHMinLimitRvn = Math.round((0.0002 / (Networkhashrate + 0.0002)) * 1e8) / 1e8;
            return MinPercentFromNHMinLimitRvn;
          }

          async function MinPercentFromNHMinLimitScrypt(props) {
            let Networkhashrate = networkhashps / marketFactor
            let MinPercentFromNHMinLimitScrypt = Math.round((0.01 / (Networkhashrate + 0.01)) * 1e8) / 1e8;
              return MinPercentFromNHMinLimitScrypt
          }
          
          if (/RVN/.test(token)) {
            let MinPercentFromNHMinLimit =  await MinPercentFromNHMinLimitKawpow();
            return {MinPercentFromNHMinLimit};
          } else {
            if (/FLO/.test(token)) {
              let MinPercentFromNHMinLimit = await MinPercentFromNHMinLimitScrypt();
              return {MinPercentFromNHMinLimit};
            }
          }
          return {MinPercentFromNHMinLimit};
        }

        let MinPercentFromNHMinLimitLoad = await MinPercentFromNHMinLimitCalc();
        let MinPercentFromNHMinLimit = MinPercentFromNHMinLimitLoad.MinPercentFromNHMinLimit;
        let minMargin = 0
        let MinPercentFromBittrexMinWithdrawal = Math.round((BittrexMinWithdrawal / (BittrexMinWithdrawal + Networkhashrate * PriceRentalStandard * minDuration)) * 1e6) / 1e6;
        
        let MinimumMinimum = Math.min(
          MinPercentFromNHMinAmount,
          MinPercentFromNHMinLimit,
          MinPercentFromBittrexMinWithdrawal
        );
        let HighestMinimum = Math.max(
          MinPercentFromNHMinAmount,
          MinPercentFromNHMinLimit,
          MinPercentFromBittrexMinWithdrawal
          )
        return {
          MinPercentFromNHMinAmount,
          MinPercentFromNHMinLimit,
          MinPercentFromBittrexMinWithdrawal,
          HighestMinimum
        };
      }

      let Minimums = await minimums(token, tokenAlgo, Networkhashrate, marketFactor, networkhashps, PriceRentalStandard, PriceUsdPerBtcOnCoinbase, HourlyMiningValueInBtc, HourlyMiningCostInBtc, minDuration);
      let MinPercentFromNHMinAmount = Minimums.MinPercentFromNHMinAmount;
      let MinPercentFromNHMinLimit = Minimums.MinPercentFromNHMinLimit;
      let MinPercentFromBittrexMinWithdrawal = Minimums.MinPercentFromBittrexMinWithdrawal;
      let HighestMinimum = Minimums.HighestMinimum

      return {UsersBalance, PriceRentalStandard, marketFactor, MarketFactorName, workersOnline, currentHashrate, currentHashrateReadable, rewardsTotal,
        earnedRewards, rewardsStillPending, roundShares, networkhashps, Networkhashrate, blockheight, MinerSubStatusCode, RewardsCompositeCode, RoundSharesSubStatusCode, CandidateBlocksSubStatusCode,
        candidateheight, avgBlockTime, PriceUsdPerBtcOnCoinbase, PriceUsdPerBtcOnBittrex, MarketPriceUsdPerBtc, TokenPair, MarketPricePerTokenInBtc, MaxPercent, HourlyMiningCostInBtc, HourlyMiningValueInBtc, 
        MinPercentFromNHMinAmount, MinPercentFromNHMinLimit, MinPercentFromBittrexMinWithdrawal, HighestMinimum, leadingMinerShare, myPoolShare, poolDominanceMultiplier, secondPlaceMinerShare, 
        luck1024, luck256, luck128, luck64, bestLuck, currentlyLucky, luckTrend, luck64rounded, currentlyLuckyWords, marketpreferenceKawpow, suggestedMinRentalDuration}

    }catch(error){
      console.log('provider is down, error:', error)
      let RentalCompositeStatusCode = 9
      let PriceRentalStandard = null;
      let marketFactor = null
      let MarketFactorName = null
      return {RentalCompositeStatusCode, PriceRentalStandard, marketFactor, MarketFactorName, botStatusCode}
    }      
  }
  // RentalCompositeStatusCodeOverride
  async getcurrentrental(CurrentConditions) {
    let RewardsCompositeCode = CurrentConditions.RewardsCompositeCode;
    let MinerSubStatusCode = CurrentConditions.MinerSubStatusCode;
    // console.log('RewardsCompositeCode:', RewardsCompositeCode, 'MinerSubStatusCode:', MinerSubStatusCode)
    let marketpreferenceKawpow = CurrentConditions.marketpreferenceKawpow;
    if (MinerSubStatusCode === 9) {
        RentalCompositeStatusCode = 8
        RewardsCompositeCode = 9
        return {RentalCompositeStatusCode, RewardsCompositeCode}
      }
      else{
        let RentalOrders = await this.provider.provider.getOrders({
            algo: "KAWPOW",
            mk: `${marketpreferenceKawpow}`,
          });
        // console.log('RentalOrders:', RentalOrders)
        if (RentalOrders === undefined){
          if (MinerSubStatusCode === 4) {
            let RentalCompositeStatusCode = 7
            let rentalOrderId = null
            let rentalOrderIdReadable = null
            let rentalDuration = null
            let rentalPercentComplete = null
            let estTimeRemainingInSec = null
            let estTimeRemainingInHours = null
            let estTimeRemainingInRoundHours = null
            let estTimeRemainingRMins = null
            let estTimeRemainingInRoundMins = null
            let estTimeRemainingRSecs = null
            let estTimeRemainingInMs = null
            let actualNetworkPercent = null
            let PayedAmount = null
            let CostOfRentalInBtc = null
            let StopMonitoringForRewardsLimit = null
            let CostOfRentalInUsd = null
            let AvailableAmount = null
          return {RentalCompositeStatusCode, RewardsCompositeCode, RentalOrders, rentalOrderId, rentalOrderIdReadable, estTimeRemainingInSec, estTimeRemainingInMs, estTimeRemainingInHours, estTimeRemainingInRoundHours,estTimeRemainingRMins, estTimeRemainingInRoundMins,estTimeRemainingRSecs, PayedAmount, CostOfRentalInBtc, CostOfRentalInUsd, AvailableAmount, rentalPercentComplete, rentalDuration, actualNetworkPercent, StopMonitoringForRewardsLimit}  
          }
          else{
            let RentalCompositeStatusCode = 9
            RewardsCompositeCode = 8
            let rentalOrderId = null
            let rentalOrderIdReadable = null
            let rentalDuration = null
            let rentalPercentComplete = null
            let estTimeRemainingInSec = null
            let estTimeRemainingInHours = null
            let estTimeRemainingInRoundHours = null
            let estTimeRemainingRMins = null
            let estTimeRemainingInRoundMins = null
            let estTimeRemainingRSecs = null
            let estTimeRemainingInMs = null
            let actualNetworkPercent = null
            let PayedAmount = null
            let CostOfRentalInBtc = null
            let StopMonitoringForRewardsLimit = null
            let CostOfRentalInUsd = null
            let AvailableAmount = null
          return {RentalCompositeStatusCode, RewardsCompositeCode, RentalOrders, rentalOrderId, rentalOrderIdReadable, estTimeRemainingInSec, estTimeRemainingInMs, estTimeRemainingInHours, estTimeRemainingInRoundHours,estTimeRemainingRMins, estTimeRemainingInRoundMins,estTimeRemainingRSecs, PayedAmount, CostOfRentalInBtc, CostOfRentalInUsd, AvailableAmount, rentalPercentComplete, rentalDuration, actualNetworkPercent, StopMonitoringForRewardsLimit}  
          
          }
          
        }
          
        try{
          const rentalOrderId = RentalOrders.id
          let RentalStatus = RentalOrders.status.code

          let CostOfRentalInBtc = (RentalStatus === 'CANCELLED') ? (parseFloat (RentalOrders.payedAmount)) : (parseFloat(RentalOrders.amount))
          let PayedAmount = Math.min((parseFloat(RentalOrders.payedAmount) + (CostOfRentalInBtc * 0.03) + 0.0001), CostOfRentalInBtc)
          let EndingSoonAmount = 0.80 * CostOfRentalInBtc
          let NotStartedYetAmount = 0.05 * CostOfRentalInBtc
          
          let RentalEndTime = Date.parse(RentalOrders.endTs)
          let CurrentTime = new Date().getTime();
          let TimeSinceRentalEnded = CurrentTime - RentalEndTime
          let StopMonitoringForRewardsLimit = 25 * 60 * 1000 // 25 minutes
          let RentalCompositeStatusCode;
          // console.log('RentalStatus:', RentalStatus)
          if (RentalStatus === 'CANCELLED'){
            RentalCompositeStatusCode = (TimeSinceRentalEnded < StopMonitoringForRewardsLimit)?(3):(0)
          } else if (RentalStatus === 'COMPLETED'){
            RentalCompositeStatusCode = (TimeSinceRentalEnded < StopMonitoringForRewardsLimit)?(3):(0)
          } else if (RentalStatus === 'ACTIVE'){
            if (MinerSubStatusCode === 0){
              RentalCompositeStatusCode = 5
            } else if (MinerSubStatusCode === 1){
              RentalCompositeStatusCode = (PayedAmount < EndingSoonAmount) ? (1) : (2) 
            } else if (MinerSubStatusCode === 2){
              RentalCompositeStatusCode = 4
            } else if (MinerSubStatusCode === 3){
              RentalCompositeStatusCode = 5
            } else if (MinerSubStatusCode === 4){
              RentalCompositeStatusCode = 5
            } else {
              RentalCompositeStatusCode = 9
            }
          } else if (RentalStatus === 'DEAD'){
            RentalCompositeStatusCode = (TimeSinceRentalEnded < StopMonitoringForRewardsLimit)?(4):(0)
          } else {
            RentalCompositeStatusCode = 9
          }
          // console.log('RentalCompositeStatusCode:', RentalCompositeStatusCode)
          const rentalOrderIdReadable = rentalOrderId.substr(0,7)
          let rentalDuration = Math.round((RentalOrders.amount / (RentalOrders.price * RentalOrders.limit) * 24 )* 1e2)/1e2;
          let rentalPercentComplete = (PayedAmount / CostOfRentalInBtc)
          let estTimeRemainingInSec = RentalOrders.estimateDurationInSeconds
          let estTimeRemainingInHours = estTimeRemainingInSec / (60*60)
          let estTimeRemainingInRoundHours = Math.floor(estTimeRemainingInHours)
          let estTimeRemainingRMins = (estTimeRemainingInSec / 60)-(60*estTimeRemainingInRoundHours)
          let estTimeRemainingInRoundMins = (Math.floor(estTimeRemainingRMins)<10) ? (("0" + Math.floor(estTimeRemainingRMins)).slice(-2)) : (Math.floor(estTimeRemainingRMins))
          let estTimeRemainingRSecs = (Math.floor(estTimeRemainingInSec - (60*estTimeRemainingInRoundMins) - (60*60*estTimeRemainingInRoundHours))<10) ? (("0" + (Math.floor(estTimeRemainingInSec - (60*estTimeRemainingInRoundMins) - (60*60*estTimeRemainingInRoundHours)))).slice(-2)) : Math.floor(estTimeRemainingInSec - (60*estTimeRemainingInRoundMins) - (60*60*estTimeRemainingInRoundHours))  
          let estTimeRemainingInMs = estTimeRemainingInSec * 1000
          let actualNetworkPercent = RentalOrders.limit / CurrentConditions.Networkhashrate
          let CostOfRentalInUsd = Math.round(CostOfRentalInBtc * CurrentConditions.MarketPriceUsdPerBtc * 1e2) / 1e2;
          let AvailableAmount = CostOfRentalInBtc - PayedAmount
          return {RentalCompositeStatusCode, RewardsCompositeCode, RentalOrders, rentalOrderId, rentalOrderIdReadable, estTimeRemainingInSec, estTimeRemainingInMs, estTimeRemainingInHours, estTimeRemainingInRoundHours,estTimeRemainingRMins, estTimeRemainingInRoundMins,estTimeRemainingRSecs, PayedAmount, CostOfRentalInBtc, CostOfRentalInUsd, AvailableAmount, rentalPercentComplete, rentalDuration, actualNetworkPercent, StopMonitoringForRewardsLimit}  
        }catch(error){
          console.log('error 3321', error)
          let RentalCompositeStatusCode = 9
          let rentalOrderId = null
          let RewardsCompositeCode = 8
          let rentalOrderIdReadable = null
          let rentalDuration = null
          let rentalPercentComplete = null
          let estTimeRemainingInSec = null
          let estTimeRemainingInHours = null
          let estTimeRemainingInRoundHours = null
          let estTimeRemainingRMins = null
          let estTimeRemainingInRoundMins = null
          let estTimeRemainingRSecs = null
          let estTimeRemainingInMs = null
          let actualNetworkPercent = null
          let CostOfRentalInUsd = null
          let AvailableAmount = null
          return {RentalCompositeStatusCode, RewardsCompositeCode, RentalOrders, rentalOrderId, rentalOrderIdReadable, estTimeRemainingInSec, estTimeRemainingInMs, estTimeRemainingInHours, estTimeRemainingInRoundHours,estTimeRemainingRMins, estTimeRemainingInRoundMins,estTimeRemainingRSecs, PayedAmount, CostOfRentalInBtc, CostOfRentalInUsd, AvailableAmount, rentalPercentComplete, rentalDuration, actualNetworkPercent, StopMonitoringForRewardsLimit}  
        }
      }
  }   

  async bestarbitragecurrentconditions(item, UserInput, tokensPerBlock, blocksPerHour, CurrentConditions) {

    let _this = this

    var BestValues = new Array();
    var ArbOpSize = new Array();  //ArbOpSizeByMargin
    var ArbOpSizeByProfitUsd = new Array();  
    var TryTheseForNetworkPercent = new Array(); 
    var ListCostOfRentalInUsd = new Array(); 
    var Rent = new Array(); //ListHashrateToRent
    var Price = new Array(); //ListRentalPrices
    var ListCostOfRentalInBtc = new Array(); 
    var ListEstTokensMined = new Array();
    var ListEstProfitBtc = new Array();
    var ListEstValue = new Array();
    var ListEstValueUsd = new Array();
    var AboveMinsList = new Array();
    var ExpectedPoolDominanceMultiplierList = new Array();
    let MaxPercentAsInt = CurrentConditions.MaxPercent * 100
    var listOfNetworkPercentValuesToTry = [];
    for (var i = 1; i <= MaxPercentAsInt; i++) {
    listOfNetworkPercentValuesToTry.push(i/1000);
    }
    listOfNetworkPercentValuesToTry.forEach(tryListOfNetworkPercentValues);
    
    async function tryListOfNetworkPercentValues(item, index) {
      let AlwaysMineModeEstimates = await _this.alwaysminemodeestimates(
        CurrentConditions.MinPercentFromNHMinAmount, 
        CurrentConditions.MinPercentFromNHMinLimit, 
        CurrentConditions.MinPercentFromBittrexMinWithdrawal,
        CurrentConditions.HighestMinimum, 
        item, 
        _this.UserInput.minMargin, 
        blocksPerHour, 
        tokensPerBlock, 
        CurrentConditions.Networkhashrate, 
        CurrentConditions.poolDominanceMultiplier,
        CurrentConditions.myPoolShare, 
        CurrentConditions.secondPlaceMinerShare,
        CurrentConditions.suggestedMinRentalDuration,
        CurrentConditions.PriceUsdPerBtcOnBittrex, 
        CurrentConditions.MarketPricePerTokenInBtc, 
        CurrentConditions.MarketFactorName, 
        CurrentConditions.PriceRentalStandard,
        CurrentConditions.luck64,
        CurrentConditions)


      let ArbSize = AlwaysMineModeEstimates.SpartanMerchantArbitragePrcnt
      let Profit = AlwaysMineModeEstimates.ProfitUsd
      let NetworkPercent = AlwaysMineModeEstimates.NetworkPercent
      let CostOfRentalInUsdAtTheseVars = AlwaysMineModeEstimates.CostOfRentalInUsd
      let RentTheseVars = AlwaysMineModeEstimates.Rent
      let PriceTheseVars = AlwaysMineModeEstimates.price
      let EstimatedCostOfRentalInBtcTheseVars = AlwaysMineModeEstimates.EstCostOfRentalInBtc
      let ListEstTokensMinedTheseVars = AlwaysMineModeEstimates.EstimatedQtyOfTokensToBeMined
      let ProfitAtMarketPriceBtcTheseVars = AlwaysMineModeEstimates.ProfitAtMarketPriceBtc
      let ListEstValueTheseVars = AlwaysMineModeEstimates.ValueOfEstTokensAtMarketPrice
      let ListEstValueUsdTheseVars = AlwaysMineModeEstimates.ValueOfEstTokensAtMktPriceUsd
      let ExpectedPoolDominanceMultiplierTheseVars = AlwaysMineModeEstimates.ExpectedPoolDominanceMultiplier
      let lowestArb = -10
      let AboveMinimums = (CurrentConditions.HighestMinimum < item) 
      let AboveMinsTheseVars = AboveMinimums
      if (CurrentConditions.HighestMinimum < item) {
        if (lowestArb < ArbSize){
          ArbOpSize.push(ArbSize)
          ArbOpSizeByProfitUsd.push(Profit)
          TryTheseForNetworkPercent.push(NetworkPercent)
          ListCostOfRentalInUsd.push(CostOfRentalInUsdAtTheseVars)
          Rent.push(RentTheseVars)
          Price.push(PriceTheseVars)
          ListCostOfRentalInBtc.push(EstimatedCostOfRentalInBtcTheseVars)
          ListEstTokensMined.push(ListEstTokensMinedTheseVars)
          ListEstProfitBtc.push(ProfitAtMarketPriceBtcTheseVars)
          ListEstValue.push(ListEstValueTheseVars)
          ListEstValueUsd.push(ListEstValueUsdTheseVars)
          AboveMinsList.push(AboveMinsTheseVars)
          ExpectedPoolDominanceMultiplierList.push(ExpectedPoolDominanceMultiplierTheseVars)
          let bestArbOpportunityByProfit = Math.max(...ArbOpSizeByProfitUsd)
          
          function indexMatchProfit(element, index, array){
            return (element === bestArbOpportunityByProfit)
          }

          let indexMatchProfitValue = ArbOpSizeByProfitUsd.findIndex(indexMatchProfit)
          let bestArbOpportunityByProfitMargin = ArbOpSize[indexMatchProfitValue]
          let bestPercentByProfit = TryTheseForNetworkPercent[indexMatchProfitValue]
          let bestCostUsdByProfit = ListCostOfRentalInUsd[indexMatchProfitValue]
          let bestRentByProfit = Rent[indexMatchProfitValue]
          let bestPriceByProfit = Price[indexMatchProfitValue]
          let CostOfRentalInBtcValueByProfit = ListCostOfRentalInBtc[indexMatchProfitValue]
          let EstimatedQtyOfTokensToBeMinedByProfit = ListEstTokensMined[indexMatchProfitValue]
          let ProfitAtMarketPriceBtcByProfit = ListEstProfitBtc[indexMatchProfitValue]
          let EstimatedValueOfMiningByProfit = ListEstValue[indexMatchProfitValue]
          let EstimatedValueOfMiningInUsdByProfit = ListEstValueUsd[indexMatchProfitValue]
          let ExpectedPoolDominanceMultiplierByProfile = ExpectedPoolDominanceMultiplierList[indexMatchProfitValue]
      
          BestValues.push(
            'best profit(USD):', //-26
            bestArbOpportunityByProfit, //-25
            'margin(%):', //-24
            bestArbOpportunityByProfitMargin, //-23 
            'Network Percent:', //-22
            bestPercentByProfit, //-21
            'Est Value(BTC):',
            EstimatedValueOfMiningByProfit, //-19
            'Est Value(USD):',//-18
            EstimatedValueOfMiningInUsdByProfit, //-17
            'Cost(BTC):',//-16
            CostOfRentalInBtcValueByProfit, //-15
            'Profit(BTC):', //-14
            ProfitAtMarketPriceBtcByProfit, //-13
            'Cost(USD):', //-12
            bestCostUsdByProfit, //-11
            'Hashrate:', //-10
            bestRentByProfit, //-9
            'Hash-Price:', //-8
            bestPriceByProfit, //-7
            'Duration:', //-6
            CurrentConditions.suggestedMinRentalDuration, //-5
            'Est Qty:', //-4
            EstimatedQtyOfTokensToBeMinedByProfit, //-3
            'Est Dominance Mult', //-2
            ExpectedPoolDominanceMultiplierByProfile //-1
            )
        }
      }
      let bestProfit = BestValues.length - 25
      return BestValues
    }
    let Values = await tryListOfNetworkPercentValues()

    // console.table(Values);
    

    let ProjectedProfitInUsd = (Values[Values.length - 25])
    let ProjectedProfitMargin = (Values[Values.length - 23])
    let HashrateToRent = Values[Values.length - 9];
    let MarketFactorName = CurrentConditions.MarketFactorName;
    let RentalDuration = Values[Values.length - 5];
    let RentalHashPrice = Values[Values.length - 7];
    let ProjectedTokenRewards = Values[Values.length - 3];
    let CostOfRentalInBtc = Values[Values.length - 15];
    let CostOfRentalInUsd = Values[Values.length - 11];
    let ProjectedRevenueInBtc = Values[Values.length - 19];
    let ProjectedRevenueInUsd = Values[Values.length - 17];
    let NetworkPercentToRent = Values[Values.length - 21];
    let ExpectedPoolDominanceMultiplier = Values[Values.length - 1];

    //console.log('ProjectedRevenueInBtc',ProjectedRevenueInBtc, 'NetworkPercentToRent', NetworkPercentToRent);
    //console.log();
    
    

      return {ProjectedProfitInUsd, ProjectedProfitInUsd, ProjectedProfitMargin, HashrateToRent, MarketFactorName, RentalDuration, RentalHashPrice, ProjectedTokenRewards, CostOfRentalInBtc, CostOfRentalInUsd, ProjectedRevenueInBtc, ProjectedRevenueInUsd, NetworkPercentToRent, ExpectedPoolDominanceMultiplier}
    
    return Values
  };

  // this one estimates the value of mining while rentals are running 
  async liveestimatesfrommining(CurrentRental, CurrentConditions, UserInput, tokensPerBlock, blocksPerHour, rewardsBeforeRentalStart) {
    let BittrexWithdrawalFee = 0.00005;
    let BittrexMinWithdrawal = 0.00015;
    let nicehashMinRentalCost = 0.005;
    let actualNetworkPercent = CurrentRental.actualNetworkPercent
    // console.log('RentalCompositeStatusCode:', CurrentRental.RentalCompositeStatusCode)
    let RentalStatus = (CurrentRental.RentalCompositeStatusCode === 7) ? ('NEWACCOUNT') : ((CurrentRental.RentalCompositeStatusCode === 9)?('UNKNOWN'):(CurrentRental.RentalOrders.status.code))

    let CostOfRentalInBtc = (RentalStatus === 'UNKNOWN')?(0):((RentalStatus === 'NEWACCOUNT')?(0):((RentalStatus ==='CANCELLED') ? (parseFloat(CurrentRental.RentalOrders.PayedAmount)) : (parseFloat(CurrentRental.RentalOrders.amount))))
    let CostOfRentalInUsd = CurrentRental.CostOfRentalInUsd;
    let myExpectedPoolShare = CurrentConditions.myPoolShare + CurrentRental.actualNetworkPercent
    let rentalPercentComplete = Math.round((CurrentRental.rentalPercentComplete)*1e3)/1e3;
    let rentalDuration = CurrentRental.rentalDuration;
    let rewardsTotal = CurrentConditions.rewardsTotal;
    let minedTokens = Math.round((rewardsTotal - rewardsBeforeRentalStart)*1e3)/1e3; 
    
    let LiveEstimateQtyOfTokensToBeMined = (Math.round((minedTokens / rentalPercentComplete)*1e3)/1e3);
    
    let EstimatedQtyOfTokensToBeMined = Math.round(CurrentRental.actualNetworkPercent * tokensPerBlock * blocksPerHour * rentalDuration * CurrentConditions.poolDominanceMultiplier * 1e5) / 1e5;
    let ValueOfEstTokensAtMarketPrice = Math.round(((LiveEstimateQtyOfTokensToBeMined * CurrentConditions.MarketPricePerTokenInBtc * 0.998)) * 1e8) / 1e8;
    let ValueOfEstTokensAtMktPriceUsd = Math.round(ValueOfEstTokensAtMarketPrice * CurrentConditions.MarketPriceUsdPerBtc * 1e2) / 1e2;
    let minMargin = this.UserInput.minMargin
    let tokens = (LiveEstimateQtyOfTokensToBeMined > 0) ? (LiveEstimateQtyOfTokensToBeMined) : (EstimatedQtyOfTokensToBeMined)
    let TargetOfferPricePerMinedToken = Math.round(Math.max((((CostOfRentalInBtc + BittrexWithdrawalFee) * (1 + minMargin)) / tokens), CurrentConditions.MarketPricePerTokenInBtc) * 1e8) / 1e8;
    let MarketVsOfferSpread = Math.round(((CurrentConditions.MarketPricePerTokenInBtc - TargetOfferPricePerMinedToken) / Math.max(TargetOfferPricePerMinedToken, CurrentConditions.MarketPricePerTokenInBtc)) *1e2) / 1e2;
    let ValueOfEstTokensAtTargetOffer = (LiveEstimateQtyOfTokensToBeMined > 0) ? (Math.round(((TargetOfferPricePerMinedToken * LiveEstimateQtyOfTokensToBeMined) - BittrexWithdrawalFee) * 1e8) / 1e8) : (0);
    let ValueOfEstTokensAtTgtOfferUsd = Math.round(ValueOfEstTokensAtTargetOffer * CurrentConditions.MarketPriceUsdPerBtc * 1e2) /1e2;
    let ProfitUsd = Math.round((ValueOfEstTokensAtMktPriceUsd - (CurrentRental.CostOfRentalInUsd + (CurrentConditions.MarketPricePerTokenInBtc * BittrexWithdrawalFee))) * 1e2) / 1e2;
    let Margin = Math.round((ProfitUsd/ValueOfEstTokensAtMktPriceUsd)*1e4)/1e4
    let ProfitAtMarketPriceUsd = Math.round((ValueOfEstTokensAtTgtOfferUsd - (CurrentRental.CostOfRentalInUsd + (BittrexWithdrawalFee * CurrentConditions.MarketPriceUsdPerBtc))) * 1e2) / 1e2;
    let SpartanMerchantArbitragePrcnt = (ValueOfEstTokensAtMarketPrice >= CostOfRentalInBtc) ? (Math.round( ((ValueOfEstTokensAtMarketPrice - CostOfRentalInBtc - BittrexWithdrawalFee) / CostOfRentalInBtc + BittrexWithdrawalFee) * 1e3 ) / 1e3) : ((ValueOfEstTokensAtMarketPrice/CostOfRentalInBtc)-1)
    
    return {
      actualNetworkPercent, 
      rentalDuration, 
      CostOfRentalInBtc,
      rewardsTotal,
      minedTokens,
      LiveEstimateQtyOfTokensToBeMined,
      EstimatedQtyOfTokensToBeMined,
      rentalPercentComplete,
      TargetOfferPricePerMinedToken,
      MarketVsOfferSpread,
      ValueOfEstTokensAtMarketPrice,
      ValueOfEstTokensAtTargetOffer,
      CostOfRentalInUsd,
      ValueOfEstTokensAtTgtOfferUsd,
      ValueOfEstTokensAtMktPriceUsd,
      ProfitUsd,
      Margin,
      ProfitAtMarketPriceUsd,
      SpartanMerchantArbitragePrcnt
    };
  }

  //rename this - this estimates the value of mining while no rentals are active
  async alwaysminemodeestimates(MinPercentFromNHMinAmount, MinPercentFromNHMinLimit, MinPercentFromBittrexMinWithdrawal, HighestMinimum, item, UsersRequestedMargin, blocksPerHour, tokensPerBlock, Networkhashrate, poolDominanceMultiplier,myPoolShare, secondPlaceMinerShare, suggestedMinRentalDuration, PriceUsdPerBtcOnBittrex, MarketPricePerTokenInBtc, MarketFactorName, PriceRentalStandard, luck64, CurrentConditions) {

    let _this = this

    let NetworkPercent = (item === undefined) ? (CurrentConditions.MaxPercent) : item
    let BittrexWithdrawalFee = 0.00005;
    let BittrexMinWithdrawal = 0.00015;
    let nicehashMinRentalCost = 0.005;
    let profileMinDuration = suggestedMinRentalDuration;
    let duration = suggestedMinRentalDuration;
    let MarketPriceUsdPerBtc = PriceUsdPerBtcOnBittrex; //Coinbase.priceUsdPerBtc
    let Rent = Math.round( Networkhashrate * (-NetworkPercent / (-1 + NetworkPercent)) * 1e4 ) / 1e4;
    let EstCostOfRentalInBtc = Math.round( ((Rent * duration) / 24) * PriceRentalStandard * 1e8 ) / 1e8;
    let CostOfRentalInUsd = Math.round((EstCostOfRentalInBtc * PriceUsdPerBtcOnBittrex)*1e2)/1e2
    let myExpectedPoolShare = myPoolShare + NetworkPercent
    let ExpectedPoolDominanceMultiplier = Math.round(((Math.pow((myPoolShare/secondPlaceMinerShare),1.01)+4)/5)*1e2)/1e2
    let luck64rounded = (luck64 === undefined) ? (1) : Math.round((luck64)*1e2)/1e2
    let EstimatedQtyOfTokensToBeMinedIgnoringLuck = Math.round((NetworkPercent * tokensPerBlock * blocksPerHour * duration * ExpectedPoolDominanceMultiplier) * 1e5) / 1e5;
    let EstimatedQtyOfTokensToBeMined = Math.round((EstimatedQtyOfTokensToBeMinedIgnoringLuck / luck64rounded) * 1e0) / 1e0;
    let ValueOfEstTokensAtMarketPrice = Math.round( ((EstimatedQtyOfTokensToBeMined * MarketPricePerTokenInBtc) ) * 1e8 ) / 1e8;
    let ValueOfEstTokensAtMktPriceUsd = Math.round(ValueOfEstTokensAtMarketPrice * MarketPriceUsdPerBtc * 1e2) / 1e2;
    let TargetOfferPricePerMinedToken = Math.round( Math.max( ((EstCostOfRentalInBtc + BittrexWithdrawalFee) * (1 + UsersRequestedMargin)) / EstimatedQtyOfTokensToBeMined, MarketPricePerTokenInBtc ) * 1e8 ) / 1e8;
    let MarketVsOfferSpread = Math.round( ((MarketPricePerTokenInBtc - TargetOfferPricePerMinedToken) / Math.max(TargetOfferPricePerMinedToken, MarketPricePerTokenInBtc)) * 1e2 ) / 1e2;
    let ValueOfEstTokensAtTargetOffer = Math.round( ((TargetOfferPricePerMinedToken * EstimatedQtyOfTokensToBeMined) - BittrexWithdrawalFee) * 1e8 ) / 1e8;
    let ValueOfEstTokensAtTgtOfferUsd = Math.round(ValueOfEstTokensAtTargetOffer * MarketPriceUsdPerBtc * 1e2) / 1e2;
    let ProfitUsd = Math.round((ValueOfEstTokensAtMktPriceUsd - (CostOfRentalInUsd + (PriceUsdPerBtcOnBittrex * BittrexWithdrawalFee))) * 1e2) / 1e2;
    let SpartanMerchantArbitragePrcnt = (ValueOfEstTokensAtMarketPrice >= EstCostOfRentalInBtc) ? (Math.round( ((ValueOfEstTokensAtMarketPrice - EstCostOfRentalInBtc - BittrexWithdrawalFee) / EstCostOfRentalInBtc + BittrexWithdrawalFee) * 1e3 ) / 1e3) : ((ValueOfEstTokensAtMarketPrice/EstCostOfRentalInBtc)-1)
    let hashrate = Rent;
    let amount = EstCostOfRentalInBtc;
    let price = PriceRentalStandard;

    return {
      MinPercentFromNHMinAmount,
      MinPercentFromNHMinLimit,
      MinPercentFromBittrexMinWithdrawal,
      HighestMinimum,
      Rent,
      amount,
      price,
      duration,
      duration,
      NetworkPercent,
      Rent,
      MarketFactorName,
      poolDominanceMultiplier,
      EstimatedQtyOfTokensToBeMined,
      MarketPricePerTokenInBtc,
      TargetOfferPricePerMinedToken,
      MarketVsOfferSpread,
      EstCostOfRentalInBtc,
      ValueOfEstTokensAtMarketPrice,
      ValueOfEstTokensAtTargetOffer,
      CostOfRentalInUsd,
      ValueOfEstTokensAtTgtOfferUsd,
      ValueOfEstTokensAtMktPriceUsd,
      ProfitUsd,
      SpartanMerchantArbitragePrcnt,
      UsersRequestedMargin, 
      ExpectedPoolDominanceMultiplier
    };
  }

  async beforerentalsleep(ms, SpartanBotCompositeStatusCode, CurrentConditions) {
    // console.log('1  running function beforerentalsleep', SpartanBotCompositeStatusCode)
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  async duringrentalsleep(ms, SpartanBotCompositeStatusCode, CurrentConditions, CurrentRental) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  async afterrentalsleep(ms, SpartanBotCompositeStatusCode, CurrentConditions, CurrentRental) {
    return new Promise(resolve => setTimeout(resolve,ms, CurrentRental));
  }


  async botstatus(RentalCompositeStatusCode, RewardsCompositeCode, CurrentConditions, CurrentRental, LiveEstimatesFromMining, MinerSubStatusCode, RoundSharesSubStatusCode, CandidateBlocksSubStatusCode, BestArbitrageCurrentConditions, minMargin) {
    let _this = this

    let RentalEndTime = (CurrentRental.RentalCompositeStatusCode >= 7)?(0):(Date.parse(CurrentRental.RentalOrders.endTs))
    let CurrentTime = new Date().getTime();
    let TimeSinceRentalEnded = CurrentTime - RentalEndTime
    let StopMonitoringForRewardsLimit = CurrentRental.StopMonitoringForRewardsLimit
    // console.log(RentalCompositeStatusCode, RewardsCompositeCode, MinerSubStatusCode)

    try{
      let UsersRequestedMargin = _this.UserInput.minMargin 
      // console.table(LiveEstimatesFromMining)
      let currentlyProfitable = (LiveEstimatesFromMining === undefined) ? (false) : (LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt > 0)
      let currentlyAboveUsersMinMargin = (LiveEstimatesFromMining === undefined) ? (false) : (LiveEstimatesFromMining.SpartanMerchantArbitragePrcnt > _this.UserInput.minMargin)
      if (RentalCompositeStatusCode === 0) { // no rental
        let projectedProfitable = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > 0)
        let projectedAboveUsersMinMargin = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > minMargin)    
        let botStatusCode = (projectedProfitable) ? ( (projectedAboveUsersMinMargin) ? (1):(2)) : (3)
        console.log(RentalCompositeStatusCode, RewardsCompositeCode, botStatusCode)  
        // let RentalEndTime = Date.parse(CurrentRental.RentalOrders.endTs)
        // let CurrentTime = new Date().getTime();
        // let TimeSinceRentalEnded = CurrentTime - RentalEndTime
        // let StopMonitoringForRewardsLimit = CurrentRental.StopMonitoringForRewardsLimit
        // // let botStatusCode = (RewardsCompositeCode === 1) ? ((projectedProfitable)?((projectedAboveUsersMinMargin)?(1):(2)):(3)) : ((RewardsCompositeCode === 0)?((StopMonitoringForRewardsLimit < TimeSinceRentalEnded)?(6):((projectedProfitable)?((projectedAboveUsersMinMargin)?(1):(2)):(3))):('error'))

        return {botStatusCode, RentalCompositeStatusCode, RewardsCompositeCode, projectedProfitable, projectedAboveUsersMinMargin}
      }
      else if (RentalCompositeStatusCode > 0) { // something other than no rental
        if (RentalCompositeStatusCode > 3) { // RentalCompositeStatusCode is 4 or above, Dead or Down
          if (RentalCompositeStatusCode === 7) {
            let projectedProfitable = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > 0)
            let projectedAboveUsersMinMargin = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > minMargin)    
            let botStatusCode = (projectedProfitable) ? ( (projectedAboveUsersMinMargin) ? (1):(2)) : (3)
            console.log(RentalCompositeStatusCode, RewardsCompositeCode, botStatusCode)
            return {botStatusCode, projectedProfitable, projectedAboveUsersMinMargin}   
          }
          else if (RentalCompositeStatusCode > 7) { //RentalCompositeStatusCode is 8 or 9, something is down
            let botStatusCode = (RentalCompositeStatusCode === 8) ? (9) : (8)
            return {botStatusCode, RewardsCompositeCode , currentlyProfitable, currentlyAboveUsersMinMargin, RentalEndTime, StopMonitoringForRewardsLimit}
          }
          else if (RentalCompositeStatusCode === 4) { //RentalCompositeStatusCode is 4, Dead Order
            let botStatusCode = (currentlyProfitable) ? ((currentlyAboveUsersMinMargin) ? (1):(2)):(3)
            console.log(RentalCompositeStatusCode, RewardsCompositeCode, botStatusCode)
            return {botStatusCode, RewardsCompositeCode , currentlyProfitable, currentlyAboveUsersMinMargin, RentalEndTime, StopMonitoringForRewardsLimit}
          }
          else if (RentalCompositeStatusCode === 5) { //RentalCompositeStatusCode is 5, Order Not Yet Alive
            let botStatusCode = (RewardsCompositeCode === 0) ? (4) : ('error 3')
            return {botStatusCode, RewardsCompositeCode , currentlyProfitable, currentlyAboveUsersMinMargin, RentalEndTime, StopMonitoringForRewardsLimit}
          }
        }
        else if (RentalCompositeStatusCode < 3) { //RentalCompositeStatusCode is 1 or 2, its minining
          let RewardsCompositeCode = CurrentConditions.RewardsCompositeCode
          let botStatusCode = (currentlyProfitable === undefined)?(3):((currentlyProfitable)?((currentlyAboveUsersMinMargin)?(1):(2)):(3))
          console.log(RentalCompositeStatusCode, RewardsCompositeCode, botStatusCode)
          let RentalEndTime = Date.parse(CurrentRental.RentalOrders.endTs) 
          let StopMonitoringForRewardsLimit = CurrentRental.StopMonitoringForRewardsLimit
          return {botStatusCode, RewardsCompositeCode, currentlyProfitable, currentlyAboveUsersMinMargin, RentalEndTime, StopMonitoringForRewardsLimit}
        }
        else if (RentalCompositeStatusCode === 3) { // Rental recently finished
          let RewardsCompositeCode = CurrentConditions.RewardsCompositeCode
          let projectedProfitable = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > 0)
          let projectedAboveUsersMinMargin = (BestArbitrageCurrentConditions === undefined) ? (false) : (BestArbitrageCurrentConditions.ProjectedProfitMargin > minMargin)
          // let RentalEndTime = Date.parse(CurrentRental.RentalOrders.endTs)
          // let CurrentTime = new Date().getTime();
          // let TimeSinceRentalEnded = CurrentTime - RentalEndTime
          // let StopMonitoringForRewardsLimit = CurrentRental.StopMonitoringForRewardsLimit
          let botStatusCode = (RewardsCompositeCode === 1) ? ((currentlyProfitable)?((currentlyAboveUsersMinMargin)?(1):(2)):(3)) : ((RewardsCompositeCode === 0)?((StopMonitoringForRewardsLimit < TimeSinceRentalEnded)?(6):((currentlyProfitable)?((currentlyAboveUsersMinMargin)?(1):(2)):(3))):('error'))
            console.log(RentalCompositeStatusCode, RewardsCompositeCode, botStatusCode)
          return {botStatusCode, RewardsCompositeCode , currentlyProfitable, currentlyAboveUsersMinMargin, RentalEndTime, StopMonitoringForRewardsLimit}
        }
      }
    }catch(error){
      console.log('error 344', error)
      let botStatusCode = 9
      return {botStatusCode}
    }
  } //end of botstatus function
}


module.exports = RentalPrediction