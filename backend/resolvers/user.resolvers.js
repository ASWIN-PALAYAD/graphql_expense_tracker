import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const useResolver = { 
    Mutation:{
        signUp:async(_,{input},context) => {
            try {
                const {username,name, password,gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }
                const existUser = await User.findOne({username});
                if(existUser){
                    throw new Error("User already exist");
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password,salt);

                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    password:hashedPassword,
                    gender,
                    profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
                });
                await newUser.save();
                await context.login(newUser);
                return newUser;

            } catch (err) {
                console.log("Error in signUp:", err);
                throw new Error(err.message ? err.message : "internal server error")  
            }
        },

        login: async(_,{input},context) => {
            try {
                const {username,password} = input;
                if(!username || !password) throw new Error("All fields are requiredss");
                const {user} = await context.authenticate("graphql-local",{username,password});
                await context.login(user);
                return user;

            } catch (err) {
                console.log("Error in login:", err);
                throw new Error(err.message ? err.message : "internal server error") 
            }
        },

        logout:async(_,__,context)=>{
            try {
                await context.logout();
                context.req.session.destroy((err)=> {
                    if(err) throw new Error(err.message ? err.message : "internal server error") 
                });
                context.res.clearCookie("connect.sid");

                return {message:"Logged out successfully"};

            } catch (err) {
                console.log("Error in logout:", err);
                throw new Error(err.message ? err.message : "internal server error")
            }
        }
    },

    Query: {

        authUser: async(_,__,context) => {
            try {
                const user = await context.getUser();  
                return user;  
                
            } catch (err) {
                console.log("Error in authuser:", err);
                throw new Error(err.message ? err.message : "internal server error")
            }
        }, 

       user:async(_,{userId}) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (err) {
            console.log("Error in user query:", err);
            throw new Error(err.message ? err.message : "Error geting user");
        }
       }
    },
User:{
        transactions:async(parent) =>{
            try {
                const transactions = await Transaction.find({userId:parent._id});
                return transactions;
            } catch (error) {
                console.log("error in user.transaction:",error);
                throw new Error(error.message ||"Internal server error");
            }
        }
    }
    
}

export default useResolver 