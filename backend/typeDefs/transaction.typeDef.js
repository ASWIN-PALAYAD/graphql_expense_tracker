const  transactionTypeDef = `#graphql

 type Transaction{
    _id:ID!
    userId:ID!
    description:String!
    paymentType:String!
    category: String!
    amount: Float!
    location: String
    date:String!
    user:User!
 } 
 type Query {
   transactions:[Transaction!]
   transaction(transactionId:ID!): Transaction
   categoryStatistics:[CategoryStatustics!]
 }

 type Mutation{
   createTransaction(input:createTransactionInput!):Transaction!
   updateTransaction(input:updateTransactionInput!):Transaction!
   deleteTransaction(transactionId:ID):Transaction!
 }

type CategoryStatustics {
  category:String!
  totalAmount:Float!
}

 input createTransactionInput {
   description:String!
    paymentType:String!
    category: String!
    amount: Float!
    location: String
    date:String!
 }
 input updateTransactionInput{
   transactionId:ID!
   description:String
    paymentType:String
    category: String
    amount: Float
    location: String
    date:String
 }
`

export default transactionTypeDef;