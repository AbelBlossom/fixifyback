const admin = require('firebase-admin')

let serviceAccount = require('./config.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

let db = admin.firestore()

module.exports = { db, admin }
