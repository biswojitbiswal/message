import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: boolean,
    verifyCodeExpire: Date,
    isAcceptingMessage: boolean,
    isVerified: boolean,
    messages: Message[],
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    verifyCode: {
        type: Boolean,
        default: false,
    },
    verifyCodeExpire: { 
        type: Date,
        default: Date.now,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema); 

export default UserModel;