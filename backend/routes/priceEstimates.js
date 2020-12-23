const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const PriceEstimatesController = require('../controllers/priceEstimates')

router.post('/profitEstimate', PriceEstimatesController.updateProfitEstimates)

// ****************************************************************************************************
/*
// make requests POST request to this endpoint in intervals
router.post('/profitEstimates', async ( req, res ) => {
  console.log("Hit Profit Estimate API");
  // how to run callback in intervals via server route controller ???
  try {
    profitsEstimated()
  } catch (err) {
    console.error("Profits estimated function crashed", err)
  }

  res.send("OK")
})

let id
function logHere () {
  let count = 0
  id = setInterval(() => {
    count++
  console.log(count)
  }, 3000)
}

let lock = false

// listen on route ({host:port/profile/test) POST request
router.post('/test', (req, res) => {
  if (lock){
    res.sendStatus(400)
    return
  }
  lock = true
  clearInterval(id)
  // CLIENT will POST a req body, there sending us data
  console.log('test interval')
  // PERFORM CALCULATIONS ON THAT DATA
  logHere()
  // RESPOND WITH THE UPDATED DATA
})
*/
// ****************************************************************************************************


module.exports = router