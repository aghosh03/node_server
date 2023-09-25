require("dotenv").config();
const express = require('express');
const cors = require("cors");

//settup app for api routing
const app = express();
app.use(cors());
app.use(express.json());


//Setup database query function
const {Pool, Client} = require("pg");
const pool = new Pool();
const client = new Client();
pool.connect((err, release) => {
    if (err) {
      return console.error(`connection error to database`, err.stack)
    } else {
      return console.log(`connected successfuly to database`)
    }
  })
const dbQuery=(text, params) =>pool.query(text, params);


//setup test api
app.get('/api/nodeapitest', async(req, res)=>{ 

        try{ 
                res.status(200).json({
                        response: "success"
                })      
        }
        catch(error){
                console.log(error);
        }

});

app.get("/api/restaurants", async (req, res)=>{
    try{

        const queryText = "select * from restaurants left join (select restaurant_id, count(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"

        const restaurantsData = await dbQuery(queryText);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurantsData.rows
            }
        });
    } catch (err){
        console.log(err);
    }
});

//setup port for server
const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`Server is running and listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});

