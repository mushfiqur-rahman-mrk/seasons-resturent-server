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
    const orderCollection=client.db('seasons').collection('orderDB')

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

    // POST:: post order data to database 
    app.post('/orders',async(req,res)=>{
      const newOrder=req.body;
      // delete newOrder._id;
      const result= await orderCollection.findOne({_id:newOrder._id})
      if(result){
        res.status(404).json()
      }else{
        const result= await orderCollection.insertOne(newOrder)
        res.send(result)
      }

    })

 
    // Get:: get all user from database
    app.get('/users', async(req,res)=>{
      const cursor= await userCollection.find().toArray()
      res.send(cursor)
    })
    //GET:: get single user from database useing email
    app.get('/users/:email', async(req,res)=>{
      const email=req.params.email;
      const query={email:email}
      const resutl= await userCollection.findOne(query)
      res.send(resutl)
    })
    // GET:: get all food products from database also sort and search

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
 
      if(sortField && sortOrder){
          sortItem[sortField]=sortOrder
      }
      const cursor=await allFoodCollection.find(queryItem).sort(sortItem).toArray()
      res.send(cursor)

      }catch(error){
          console.log(error);
      }
  })

 



    // GET:: get single food item from database
    app.get('/api/v1/all-foods/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result= await allFoodCollection.findOne(query)
      res.send(result)
    })

    // GET:: get all data of a user 
    app.get('/api/v1/all-foods/user/:email', async(req,res)=>{
      try{
      const email=req.params.email;
      const query={addby:email}
      const result =await allFoodCollection.findOne(query)
      res.send(result)
      }catch (error) {
        console.log(error);
      }
    })

    // GET:: get all order data from database
    app.get('/orders', async(req,res)=>{
      const cursor= await orderCollection.find().toArray()
      res.send(cursor)
    })

    // Get:: get individual user order data
    app.get('/orders/:email', async(req,res)=>{
       const email=req.params.email;
       const query={userEmail:email}
       const result= await orderCollection.find(query).toArray()
       res.send(result)
    })

    // PUT:: 
    app.patch('/api/v1/all-foods/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const updateFood=req.body;
      const updatedoc={ 
        $set:{
          stock:updateFood.newstock,
          count:updateFood.newcount
        }
      }
      const result= await allFoodCollection.updateOne(query,updatedoc)
      res.send(result)
    })




    // DELETE:: delete one order item
    app.delete('/orders/:id', async(req,res)=>{
      const id= req.params.id;
      const query={_id:id};
      const result = await orderCollection.deleteOne(query)
      res.send(result)
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