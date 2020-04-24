require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../spartanBot');
const request = require('request');
const events = require('events');
const User = require('../models/user');
const emitter = new events()
const wss = require('./socket').wss;
const bip32 = require('bip32');
const { Account, Networks, Wallet } = require('@oipwg/hdmw');
// const Wallet = HDMW.Wallet;




const Rent = async (token, percent) => {
    console.log('percent', percent)
    if (token === "FLO") {
        return await new Promise((resolve, reject) => {
            request({url: 'https://livenet.flocha.in/api/status?q=getInfos'}, (err, res, body)=> {
                if (err) {
                    reject( err )
                }
                let data = JSON.parse(body)
                let difficulty = data.info.difficulty
                let hashrate = difficulty * Math.pow(2, 32) / 40
                let NetworkhashrateFlo = hashrate / 1000000000000;  // TH/s
                let Rent = NetworkhashrateFlo * (-percent / (-1 + percent)) // * 1000000 for MRR to MH/s
                let MinPercentFromMinHashrate = 1000000000000 * .01 / ( ( difficulty * Math.pow(2, 32) / 40 ) + (1000000000000 * .01) )
                resolve( {Rent, MinPercentFromMinHashrate, difficulty } )
            })
        })
    }
   
    if (token === "RVN") {
        return await new Promise((resolve, reject) => {
            request({ url: 'https://rvn.2miners.com/api/stats' }, (err, res, body) => {
                if (err) {
                    reject( err ) 
                }
                let data = JSON.parse(body);
                let difficulty = data.nodes[0].difficulty;
                let hashrate = difficulty * Math.pow(2, 32) / 60;
                let NetworkhashrateRvn = hashrate / 1000000000000; // TH/s
                let Rent = NetworkhashrateRvn * (-percent / (-1 + percent))   // * 1000000 for MRR to MH/s
                let MinPercentFromMinHashrate = 1000000000000 * .01 / ( ( difficulty * Math.pow(2, 32) / 40 ) + (1000000000000 * .01) )
                resolve( {Rent, MinPercentFromMinHashrate, difficulty } );
            })
        })
    }
}

async function processUserInput(req, res) {
    let options = req.body
    let {profitReinvestment, updateUnsold, dailyBudget, autoRent, spot, alwaysMineXPercent,
        autoTrade, morphie, supportedExchange, Xpercent, userId, token} = options;
    // let token = options.token
    console.log('OOPTIONS', options)
    console.log('options: rent.js 41')

    let accountMaster = bip32.fromBase58("Fprv4xQSjQhWzrCVzvgkjam897LUV1AfxMuG8FBz5ouGAcbyiVcDYmqh7R2Fi22wjA56GQdmoU1AzfxsEmVnc5RfjGrWmAiqvfzmj4cCL3fJiiC", Networks.flo.network)
    let account = new Account(accountMaster, Networks.flo, false);
    let extPublicKey = account.getExtendedPublicKey()
    console.log('extPublicKey:', extPublicKey)

    try {
        const rent = await Rent(token, Xpercent/100)
        console.log('rent:', rent)
        let MinPercentFromMinHashrate = rent.MinPercentFromMinHashrate

        if ( MinPercentFromMinHashrate > Xpercent/100 ) {
            return {
                    update: true,
                    message: `Your pecent of the network ${Xpercent} changed to ${(MinPercentFromMinHashrate*100).toFixed(2)}%, or `+
                    `you can continute renting with ${Xpercent}% for the MiningRigRental market change percentage and switch renting on again.`,
                    Xpercent: (MinPercentFromMinHashrate*100).toFixed(2),
                    autoRent: false
                }
        }

        // const user = await User.findById({ _id: userId });
        
        // if (!user) {
        //     return 'Can\'t find user. setup.js line#16'
        // }
        options.to_do = {
            rent: {
                rent: true,
            }
        }
        options.emitter = emitter
        options.duration = 3
        options.newRent = Rent
        options.difficulty = rent.difficulty
        options.hashrate = rent.Rent
        options.rentType = 'Manual' 
        options.address = "somelongaddress3456"
        return options
    } catch (e) {
        return {err: 'Can\'t find user or input is wrong.'+ e}
    }
}

/* POST settings  page */
router.post('/',  async (req, res) => {
 
    let userInput = await processUserInput(req, res).then(data => data).catch(err => err)
    console.log('processUserInput ', userInput)
    // Any data that has been updated, it updates the user to proceed again
    if (userInput['update']) {
        return res.json(userInput)
    }
   
    
    try {
        let data = await controller(userInput);
        console.log('data: rent.js route', data)
        res.status(200).json({data: data, fromRent: data})

    } catch (err) {
        console.log('route rent.js line #129 catch error', err);
        res.status(500).json({err: err})
    }
});

module.exports = router;