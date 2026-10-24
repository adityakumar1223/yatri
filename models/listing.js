import mongoose from 'mongoose';
import Schema from 'mongoose';
import Review from './review.js';

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
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
        },
        filename: {
            type: String,
            default: "listingimage",
        },
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
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geoLocation : {
        type : {
            type: String,
            enum : ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required : true,
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews }});
    }
})

const Listing = mongoose.model("Listing", listingSchema);

export {Listing};