import express from 'express';
import { v4 as uuidv4} from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {Listing} from './models/listing.js';
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = "mongodb://127.0.0.1:27017/yatri";

main().then((res)=>{
    console.log("Connection sucessfull...");
}).catch((err)=>{
    console.log(err);
})

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

let port = 3000;

async function main(){
   await mongoose.connect(MONGO_URL);

};

app.get("/", (req, res)=>{
    res.status(200).render("index.ejs");
});

app.get("/testListing", async (req, res)=>{
    // let newList = new Listing({
    //     title: "Sea facing property",
    //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde iure aut ratione nostrum itaque ea, animi debitis tempora ab, perspiciatis dolorem assumenda amet? Omnis recusandae, animi voluptatum accusamus nulla repudiandae?",
    //     price: 1000,
    //     location: "Golden Beach, Puri",
    //     country: "India"
    // });
    await newList.save();
    console.log("sample was saved");
    res.send("Sucessfull testing");
    
});

 // new & create routes

 app.get("/listing/new", (req, res)=>{
    res.status(200).render("./newProperty/newProperty.ejs");
 });

 app.post("/listing", async(req, res)=>{
    let newList = req.body;
    await Listing.create(newList).then((response)=>{
        console.log(response);
    }).catch((err)=>console.log(err));
    res.status(200).redirect("/listing");
 })

//showing properties
app.get("/listing",async(req,res)=>{
const allListings = await Listing.find({});
res.status(200).render("./listings/index.ejs", {allListings});
 })

 app.get("/listing/:id", async(req, res)=>{
    let {id} = req.params;
    let property = await Listing.findById(id);
    res.status(200).render("./listings/show.ejs",{property});
 })

 //edit and update route
 app.get("/listing/:id/edit", async(req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.status(200).render("./editing/edit.ejs", {list});
 });

 app.patch("/listing/:id", async(req, res)=>{
    let {id} = req.params;
    let list = req.body;
    await Listing.findByIdAndUpdate(id,list);
    res.status(200).redirect("/listing");
 });

 //delete route
 app.delete("/listing/:id/delete", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.status(200).redirect("/listing");
 })









app.use((req, res)=>{
res.status(404).send("This page doesn't exist");
});

app.listen(port, ()=>{
    console.log(`App is listening on port http://localhost:${port}/`);
});