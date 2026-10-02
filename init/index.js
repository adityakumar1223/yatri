import mongoose from 'mongoose';
import {data} from './data.js';
import { Listing } from '../models/listing.js';

const MONGO_URL = "mongodb://127.0.0.1:27017/yatri";

main().then((res)=>{
    console.log("Connection sucessfull..");
}).catch((err)=>{
    console.log(err);
});

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany();
    await Listing.insertMany(data);
    console.log("data was initialized");
}

initDB();