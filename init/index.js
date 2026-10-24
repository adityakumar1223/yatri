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
    const dataWithOwner = data.map((obj) => ({...obj, owner: '6ad22474358d4f10632dcace'}))
    await Listing.insertMany(dataWithOwner);
    console.log("data was initialized");
}

initDB();