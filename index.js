const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())
// app.use(cors({
//     origin:['http://localhost:5173'],
//     credentials: true
//   }))
// app.use(express.json())
// seasons
// UyehTCTwDbKZ27KU



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qaytt3g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // database collection 
    const testCollection=client.db('seasons').collection('testingDB')
    const allFoodCollection=client.db('seasons').collection('allFood')

    app.post('/api/v1/all-foods',async(req,res)=>{
        const newItem=req.body;
        const result= await allFoodCollection.insertOne(newItem)
        res.send(result)

    })





    // http://localhost:5000/api/v1/all-foods?name=India
    // http://localhost:5000/api/v1/all-foods?sortField=count&sortOrder=asc /desc
    // http://localhost:5000/api/v1/all-foods?sortField=count&sortOrder=desc
    app.get('/api/v2/all-foods', async(req,res)=>{
        try{
            let query={}
        let sortItem={}
        
        const name=req.query.name;
        const sortField=req.query.sortField
        const sortOrder=req.query.sortOrder
        if(name){
            query.name={ $regex: name, $options: 'i' } 
        }
        if(sortField && sortOrder){
            sortItem[sortField]=sortOrder
        }
        const cursor=await testCollection.find(query).sort(sortItem).toArray()
        res.send(cursor)
 
        }catch(error){
            console.log(error);
        }
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('seasons server is running.........')
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})