const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const userCollection=client.db('seasons').collection('userDB')

    // client side related api

    //POST:: add new food item to database
    app.post('/api/v1/all-foods',async(req,res)=>{
        const newItem=req.body;
        const result= await allFoodCollection.insertOne(newItem)
        res.send(result)

    })

    // POST:: add new user fo database
    app.post('/user', async(req,res)=>{
      const newUser=req.body;
      const result =await userCollection.insertOne(newUser);
      res.send(result)
    })

    // Get:: get all user from database
    app.get('/user', async(req,res)=>{
      const cursor= await userCollection.find().toArray()
      res.send(cursor)
    })
    //GET:: get single user from database useing email
    app.get('/user/:email', async(req,res)=>{
      const email=req.params.email;
      const query={email:email}
      const resutl= await userCollection.findOne(query)
      res.send(resutl)
    })

    // 
    // app.get('/api/v1/all-foods',async(req,res)=>{
    //   const cursor= await allFoodCollection.find().toArray()
    //   res.send(cursor)
    // })

    // 

    app.get('/api/v1/all-foods/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result= await allFoodCollection.findOne(query)
      res.send(result)
    })



    // http://localhost:5000/api/v2/all-foods?name=India
    // http://localhost:5000/api/v1/all-foods?sortField=count&sortOrder=asc /desc
    // http://localhost:5000/api/v1/all-foods?sortField=count&sortOrder=desc
    app.get('/api/v1/all-foods', async(req,res)=>{
        try{
          let queryItem={}
          let sortItem={}
        
        const fname=req.query.fname;
        const sortField=req.query.sortField
        const sortOrder=req.query.sortOrder
        if(fname){
            queryItem.fname={ $regex: fname, $options: 'i' } 
        }
        // if(name){
        //   queryItem.name=name;
        // }
        if(sortField && sortOrder){
            sortItem[sortField]=sortOrder
        }
        const cursor=await allFoodCollection.find(queryItem).sort(sortItem).toArray()
        res.send(cursor)
 
        }catch(error){
            console.log(error);
        }
    })



    // app.get('/api/v1/all-foods',async(req,res)=>{
    //   const cursor= await allFoodCollection.find().toArray()
    //   res.send(cursor)
    // })






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