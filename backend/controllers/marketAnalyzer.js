const spotProfitOrder = require('./truedevSpotProfitOrder')
const User = require('../models/user');

async function postAnalyzeRental(req) {
  let activeRental = (await requestActiveRental()).alive;

  // time of the mining contract
  let timeout = setTimeout(function(){ alert(); }, (req.body.estimateDurationInSeconds * 1000));

  if (activeRental) {
    return
  } else if (isSpotMode) {
    // if spotMode = true, continue
    // create post order market analysis
    // call create order route with updated analysis 
  }
}

async function isSpotMode() {
  const userStatus = await User.collection.findOne({}, {sort:{$natural:-1}})
  spotMode = User.profiles[0].autoRent.mode.spot
  console.log(spotMode);
  return spotMode
}

// if spot profit mode is selected from the front end, the above function should be called and periodically automate rentals
// after an order has ended, there needs to be a post order analysis to prepare the next profitable rental
// if analysis shows profitable rental, call create order with new analysis parameters
// analysis rental every 1/2 duration estimate. If 5 or less minutes, check again in time remaing. 
// once all this is complete, pass in newly updated parameters and create new order

