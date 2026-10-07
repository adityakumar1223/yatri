import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        max: [50, "Length out or bound"],
    },
    description:{
        type: String,
        max: [1000, "length should be in between 250 words"],
        default: "NA",
    },
    image:{
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        }
    },
    price:{
        type: Number,
        default: 0,

    },
    location: {
        type: String,
        default:"",
    },
    country:{
        type: String,
        default: "India",
    }
});

const Listing = mongoose.model("Listing", listingSchema);

export {Listing};