const spotProfitOrder = require('./truedevSpotProfitOrder')

async function postAnalyzeRental() {
  let activeRental = (await requestActiveRental()).alive;

  if (activeRental) {
    return
  } else {
    // return market analysis
  }
}