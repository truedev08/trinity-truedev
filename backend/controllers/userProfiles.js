require('dotenv').config();
const User = require('../models/user')



module.exports = {
    new: async( req, res ) => {
        try {
            const { name, token } = req.body;
            const user = await User.findById(req.user.id).select('profiles')

            const foundDupe = user.profiles.find(profile => profile.name == name)

            if(foundDupe) return res.status(400).json({error: 'Profile already exist'})

            user.profiles = [...user.profiles, {name, token}]

            await user.save()
            res.status(200).json({success: 'New profile created', profiles: user.profiles})

        } catch (error) {
            console.log(error)
        }
    },

    get: async( req, res ) => {
        try {
            const user = await User.findById(req.user.id).select('profiles')

            const {profiles} = user

            res.status(200).json({profiles: profiles})

        } catch (error) {
            console.log(error)
        }
    },

    update: async( req, res ) => {
        try {

            const {_id} = req.body

            const user = await User.findById(req.user.id).select('profiles')

            let profileIndex = user.profiles.findIndex(profile => profile._id == _id)

            let profile = user.profiles[profileIndex]

            profile = req.body

            user.profiles[profileIndex] = profile;

            await user.save()
            res.status(200).json({success: 'Updated profiles', profiles: user.profiles})
        } catch (error) {
            console.log(error)
        }
    }

};
