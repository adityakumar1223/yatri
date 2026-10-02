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