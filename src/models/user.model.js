const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String, 
       required: true
    },

    last_name : {
        type: String, 
       required: true
    },

    email : {
        type: String, 
       required: true,
        index: true, 
        unique: true
    }, 

    password: {
        type: String, 
        //required: true
    },

    age : {
        type: Number, 
       required: true
    },
    role: {
        type: String,
        enum: ['admin', 'usuario', 'premium'],
        default: 'usuario'
    },
    resetToken:{
        token: String,
        expire: Date
    },
    documents:[{
        name: String,
        reference: String
    }],
    last_connection:{
        type:Date,
        default: Date.now
    }

});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
