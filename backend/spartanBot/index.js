// @ts-nocheck

const rent = require('./rent/rent');
const add = require('./RentalProvider/add/add');
const clearSpartanBot = require('./RentalProvider/clearSpartanBot');
const SpartanBot = require('spartanbot').SpartanBot;
const Events = require('events').EventEmitter;
const emitter = new Events()
const wss = require('../routes/socket')

class Client {
    constructor(settings) {
        this.settings = settings
        this.users = []
        this.loadMessages()
        this.newSpartan = (name, userId, callback) => {
            this.users.push({
                name: name,
                id: userId.toString(),
                spartan: new SpartanBot(),
                emitter: emitter
            })
            if(callback) {
                callback(this.users[this.users.length-1])
            }
        }
    }

    loadMessages() {
        wss.on('connection', ws => {
            emitter.on('message', msg => {
                ws.send(msg);
            })
        })
    }

    async getUser(userName, userId) {
        let users = this.users
        let i = users.length
        let updatedUser;

        // If users array is empty will make new user / spartanbot and return it
        if(!users.length) {
            let data = this.newSpartan(userName, userId, (newUser) => {
                updatedUser = newUser
            })
            return updatedUser
        }
        
        while(i--) {
            let user = users[i]
            if (user.id === userId) {
                return user
            //If user doesn't exist in users array (no providers), make a new user and return it.
            } else if (!i) {
                this.newSpartan(userName, userId, (newUser) => {
                    updatedUser = newUser
                })
                return updatedUser
            }
        }
    }
    // Sign out
    removeUser(userId) {
        let users = this.users
        let i = users.length

        while(i--) {
            let user = users[i]
            if (user.id === userId) {
                this.users.splice(i,1)
                return this.users
            }
        }
    }

    async controller(options) {
        let user = await this.getUser(options.userName, options.userId)

        options.SpartanBot = user.spartan
        options.emitter = user.emitter
        console.log('options.userName', options.userName)
        console.log('this.users', this.users)

        switch (options.to_do) {
            case 'rent':
                try {
                    return await rent(options)
                }catch (err) {
                    return err
                }
            case 'add':
                try {
                    return await add(options)
                } catch (err) {
                    return err
                }
            case 'clearSpartanBot':
                let removedUser = this.removeUser(options.userId)
                console.log('Current Users after signout:', removedUser)
                return removedUser
                // return clearSpartanBot(options)
                break;
            case 'returnSpartanBot': 
                 return options
                break;
        }
    }
}
module.exports = {
    Client: new Client(),
    emitter: emitter
}

