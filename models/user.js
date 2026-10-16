import mongoose from 'mongoose';
import passportLocalMongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

User.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;