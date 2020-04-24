require('dotenv').config();
const { MNE } = process.env; //! DEV - del me
const axios = require('axios');
const User = require('../models/user')
const ATSupportedEx = require('../autoTrade/supportedExchanges')

module.exports = {
    on: async(req, res ) => {
        try {

            //- profiles _id as param
            const { _id } = req.params
            const accessToken = req.headers['x-auth-token']

            const user = await User.findById(req.user.id).select('profiles')


            let profile = user.profiles.filter(profile => profile._id == _id)


    
            

            let mnemonic = MNE;
            ATSupportedEx(...profile, mnemonic, accessToken)

            res.status(200).json({success: 'Auto Trading Started.',})
        } catch (error) {
            console.log(error);
        }
    },

}