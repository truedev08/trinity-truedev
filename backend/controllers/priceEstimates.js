require('dotenv').config();
const ProfitEstimate = require('../models/profitEstimates')
const _ = require('lodash')
const profitsEstimated = require('../profitEstimator')

const User = require('../models/user');

module.exports = {
  updateProfitEstimates: async( req, res ) => {
    try {
      let userData = await User.findById({ _id: req.body.user.id})
      // ToDo Truedev change line below to address from profile from Profile.js
      let userKeys = {address: process.env.RAVEN_ADDRESS }

      for (let keys of userData.providerData) {
        if (keys.rental_provider == "NiceHash") {
          userKeys.niceHashKeys = keys;
        }
      }

      let estimates = await profitsEstimated(userKeys)

      const profitEstimate = new ProfitEstimate({
        userId: req.body.user.id,
        time: Date.now().toString(),
        botStatusCode: estimates.botStatus.botStatusCode,
        projectedProfitable: estimates.botStatus.projectedProfitable,
        projectedAboveUsersMinMargin: estimates.botStatus.projectedAboveUsersMinMargin,
        actualNetworkPercent: estimates.LiveEstimatesFromMining.actualNetworkPercent,
        rentalDuration: estimates.LiveEstimatesFromMining.rentalDuration,
        CostOfRentalInBtc: estimates.LiveEstimatesFromMining.CostOfRentalInBtc,
        rewardsTotal: estimates.LiveEstimatesFromMining.rewardsTotal,
        ProjectedProfitInUsd: estimates.BestArbitrageCurrentConditions.ProjectedProfitInUsd,
        ProjectedProfitMargin: estimates.BestArbitrageCurrentConditions.ProjectedProfitMargin,
        HashrateToRent: estimates.BestArbitrageCurrentConditions.HashrateToRent,
        MarketFactorName: estimates.BestArbitrageCurrentConditions.MarketFactorName,
        RentalDuration: estimates.BestArbitrageCurrentConditions.RentalDuration,
        RentalHashPrice: estimates.BestArbitrageCurrentConditions.RentalHashPrice,
        ProjectedTokenRewards: estimates.BestArbitrageCurrentConditions.ProjectedTokenRewards,
        CostOfRentalInBtc: estimates.BestArbitrageCurrentConditions.CostOfRentalInBtc,
        CostOfRentalInUsd: estimates.BestArbitrageCurrentConditions.CostOfRentalInUsd,
        ProjectedRevenueInBtc: estimates.BestArbitrageCurrentConditions.ProjectedRevenueInBtc,
        ProjectedRevenueInUsd: estimates.BestArbitrageCurrentConditions.ProjectedRevenueInUsd,
        NetworkPercentToRent: estimates.BestArbitrageCurrentConditions.NetworkPercentToRent,
        ExpectedPoolDominanceMultiplier: estimates.BestArbitrageCurrentConditions.ExpectedPoolDominanceMultiplier
      })
      await profitEstimate.save();
      
      res.status(200).json({
          success: 'Profit Estimates Updated!',
      });

      return estimates
      
    } catch (error) {
      console.log(error);
    }
  }
  /*
updateProfitEstimates: async( req, res ) => {
    try {
        console.log("Hit Profit Estimate API");
        // how to run callback in intervals via server route controller ???
        try {
          profitsEstimated()
        } catch (err) {
          console.error("Profits estimated function crashed", err)
        }
      
        res.send("OK")
    } catch (error) {
        console.log(error)
    }
  }
  */
}