const SpotProfitOrder = require('../controllers/truedevSpotProfitOrder')

function runRental() {
  let activeRental;
  let statusCode = SpotProfitOrder.requestStatusCode;
  let activeRental = SpotProfitOrder.requestActiveRental;

  console.log("testin 123", statusCode);
  

  if (!activeRental && statusCode==1 || statusCode==2) {
    //start active rental
    console.log("1");
    
  } else if (!activeRental && statusCode==3) { 
    console.log("2");
    return
  } else if (activeRental && statusCode==1 || statusCode==2) {
    console.log("3");
    //wait until current rental is finished before creating another
  } else if (activeRental && statusCode==3) {
    //end rental
  } else (
    console.log("Error on Spot profit order in spotMiner.js")
  )
}