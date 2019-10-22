const { buildSchema } = require('graphql')
const schema = `
type User {
  username: String
  fullname: String
  email: String
  password: String
  token: String
  level: Int
  ranking: Int
  id: String
}
input UserInput {
  username:String!
  email: String!
  password: String!
  fullname: String!
}

type Query {
  hello: String
}
type LoginReturn {
  token: String
  id: String
}
type Location {
  lat: Float
  long: Float
}
type Request {
  id: String,
  user: String,
  description: String,
  date: String,
  location: Location
  completed: Boolean
}
input LocationInput {
  lat: Float
  long: Float
}
enum CarType{
  small,
  construction,
  commercial,
  truck
}
input RequestInput {
  token: String
  description: String
  date: String
  carType: CarType
  location: LocationInput
}
type Mutation {
  createUser(user: UserInput): User
  updateProfile(user: UserInput, token: String!): User
  login(email: String!, password: String!): LoginReturn
  createRequest(request: RequestInput): Request
  myRequests(token: String):[Request]
}
`
module.exports = buildSchema(schema)
