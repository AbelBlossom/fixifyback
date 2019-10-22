const express = require('express')
const expressGraphql = require('express-graphql')
const resolver = require('./resolvers')
const schema = require('./schema')
const app = express()
app.use(
  '/graphql',
  expressGraphql({
    rootValue: resolver,
    schema: schema,
    graphiql: true,
  })
)
app.listen(3000, () => {
  console.log('server-started')
})
