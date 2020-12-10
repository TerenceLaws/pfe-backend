const Citizen = require("../models/citizen")
const webPush = require("web-push")
require('dotenv').config()

webPush.setVapidDetails(process.env.WEB_PUSH_CONTACT,process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

exports.send_public_key = function (req, res){
    res.json({'publicKey': process.env.PUBLIC_VAPID_KEY}).status(200).end()
}

exports.subscribe = function (req, res){
    const subscription = req.body.subscription
    if(subscription === null) return res.sendStatus(200)

    console.log("Trying to update citizen with id", req.body.id, subscription)

    Citizen.updateOne(
        { id: req.body.id ,
         subscription: req.body.subscription }
    ).then(
        res.sendStatus(200)
    ).catch(err => {
        if(process.env.NODE_ENV === "dev")
            console.log("Error during location_create", err)
        res.sendStatus(400)
    })

    console.log(subscription)
    const jsonSub = JSON.parse(subscription)

    // const payload = JSON.stringify({
    //     title: 'Hello!',
    //     body: 'It works.',
    // })

    // const payload = {
    //     title: 'Hello!',
    //     body: 'It works.',
    // }
//
    //const jsonPayload = JSON.parse(payload)

    webPush.sendNotification(jsonSub,'it works')
        .then(result => console.log(result))
        .catch(e => console.log(e.stack))

    res.status(200).json({'success': true})
}

exports.notify = function(citizen_id){
    let subscription = null
    Citizen.find({id: citizen_id}).exec()
        .then(result => {
           subscription = result[0].subscription
            if(subscription != null){
                // const payload = JSON.stringify({
                //     title: 'Hello!',
                //     body: 'you have come into contact with a sick person it is better to stay at home.',
                // })

                webPush.sendNotification(subscription, 'You have come into contact with a sick person it is better to stay at home.')
                    .then(result => console.log(result))
                    .catch(e => console.log(e.stack))
            }
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)

        })




}

