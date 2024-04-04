import Transaction from "../models/transaction.model.js"; 
import User from "../models/user.model.js";

const transactionResolver = {
    Query:{
        transactions:async(_,__,context)=> {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = await context.getUser()._id
                const transactions = await Transaction.find({userId});
                return transactions
            } catch (err) {
                console.log("Error getting transactions:", err);
                throw new Error("error in getting transactions")
            }
        },
        transaction:async(_, {transactionId})=> {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                console.log("Error getting transaction:", err);
                throw new Error("error in getting transaction")  
            }
        },
        categoryStatistics: async(_,__,context)=>{
            if(!context.getUser()) throw new Error("Unauthorized"); 

            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            let categoryMap = {};

            transactions.forEach((transaction)=>{
                if(!categoryMap[transaction?.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount
            });

            return Object.entries(categoryMap).map(([category,totalAmount]) => ({category,totalAmount}));

        }
    },
    Mutation:{
        createTransaction: async(_,{input},context)=>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction
            } catch (err) {
                console.log("Error in creating transaction:", err);
                throw new Error("error  in creating transaction");
            }
        },

        updateTransaction: async(_,{input})=>{
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
                return updatedTransaction;
            } catch (err) {
                console.log("Error in updating transaction:", err);
                throw new Error("error  in updating transaction"); 
            }
        },

        deleteTransaction: async(_,{transactionId})=>{
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                console.log("Error in deleting transaction:", err);
                throw new Error("error  in deleting transaction");
            }
        }
    },
    Transaction:{
        user:async(parent) =>{
            const userId = parent.userId
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.log("Error getting user :",error);
                throw new Error("Error getting user");
            }
        }
    }
}

export default transactionResolver;