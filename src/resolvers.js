const { db, admin } = require('../firestore.init')
const Users = db.collection('users')
const Requests = db.collection('requests')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
module.exports = {
  hello: () => {
    return 'hii'
  },
  createUser: async args => {
    let already = await Users.where('email', '==', args.user.email).get()
    if (already.size > 0) {
      throw new Error('email already exists')
    } else {
      let checkUsername = await Users.where(
        'username',
        '==',
        args.user.username
      ).get()
      if (checkUsername.size > 0) {
        throw new Error('username already exists')
      }
    }
    const tempPassword = await bcrypt.hashSync(args.user.password, 8)
    args.user.password = tempPassword
    let user = await Users.add(args.user)
    let doc = await user.get()
    return doc.data()
  },
  login: async ({ email, password }) => {
    const query = await Users.where('email', '==', email).get()
    if (query.empty) throw new Error('user with this email not found')
    const user = query.docs[0]
    const passwordChecked = await bcrypt.compareSync(
      password,
      user.data().password
    )
    if (!passwordChecked)
      throw new Error(`password do not match with ${user.data().email}`)
    const token = await jwt.sign(user.id, JWT_SECRET)
    return {
      id: user.id,
      token: token,
    }
  },
  updateProfile: ({ user, token }) => {
    delete user.password
    delete user.email
    // handle profile update
  },
  createRequest: async ({ request }) => {
    // console.log({ request });
    const userId = await jwt.decode(request.token, JWT_SECRET)
    const user = await Users.doc(userId).get()
    delete request.token
    const query = await Requests.add({
      ...request,
      user: user.id,
      completed: false,
      date: Date.now(),
    })
    const req = await query.get()
    return {
      id: req.id,
      ...req.data(),
    }
  },
  myRequests: async ({ token }) => {
    const userId = await jwt.decode(token, JWT_SECRET)
    const query = await Requests.where('user', '==', userId).get()
    const requests = []
    query.docs.forEach(val => {
      requests.push({
        id: val.id,
        ...val.data(),
        date: new Date(),
      })
    })
    return requests
  },
}
