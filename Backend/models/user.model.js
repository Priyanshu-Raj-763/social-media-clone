import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        url: {
            type: String,
        },
        publicId: {
            type: String,
        }
    },
    bio: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
    },
    follower: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    bookmark: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]

}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function ( password) {
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema)