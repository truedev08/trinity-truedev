const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { number } = require('@hapi/joi');
const Schema = mongoose.Schema;

const profitEstimateSchema = new Schema({
  time: {
    type: String,
    default: undefined
  },
  userId: {
    type: String,
    default: undefined
  },
  botStatusCode: {
      type: Number,
      default: undefined
  },
  projectedProfitable: {
      type: Boolean,
      default: undefined
  },
  projectedAboveUsersMinMargin: {
      type: Boolean,
      default: undefined
  },
  actualNetworkPercent: {
    type: Number,
    default: undefined
  },
  rentalDuration: {
    type: Number,
    default: undefined
  },
  CostOfRentalInBtc: {
    type: Number,
    default: undefined
  },
  rewardsTotal: {
    type: Number,
    default: undefined
  },
  ProjectedProfitInUsd: {
    type: Number,
    default: undefined
  },
  ProjectedProfitMargin: {
    type: Number,
    default: undefined
  },
  HashrateToRent: {
    type: Number,
    default: undefined
  },
  MarketFactorName: {
    type: String,
    default: undefined
  },
  RentalDuration: {
    type: Number,
    default: undefined
  },
  RentalHashPrice: {
    type: Number,
    default: undefined
  },
  ProjectedTokenRewards: {
    type: Number,
    default: undefined
  },
  CostOfRentalInBtc: {
    type: Number,
    default: undefined
  },
  CostOfRentalInUsd: {
    type: Number,
    default: undefined
  },
  ProjectedRevenueInBtc: {
    type: Number,
    default: undefined
  },
  ProjectedRevenueInUsd: {
    type: Number,
    default: undefined
  },
  NetworkPercentToRent: {
    type: Number,
    default: undefined
  },
  ExpectedPoolDominanceMultiplier: {
    type: Number,
    default: undefined
  },
  RewardsBeforeRentalStart: {
    type: Number,
    default: undefined
  }
})

const ProfitEstimates = mongoose.model('profitEstimates', profitEstimateSchema);

module.exports = ProfitEstimates;