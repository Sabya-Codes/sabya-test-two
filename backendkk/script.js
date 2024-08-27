const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const path = require('path');

const app = express();

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = mysql.createConnection({
    host: "sihdbconnection.cvu4owusgq3p.ap-south-1.rds.amazonaws.com",
    user: "sih2024",
    password: "sih12345.",
    database: "Travel_Chatbot",
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');

  });

  app.get("/api/states",(req,res)=>{
    const query = "SELECT * FROM States"
    db.query(query,[],(err,results)=>{
      if(err) return res.status(500).send("ERROR in fetching states");
      else res.json(results);

    })

  })

  app.get('/api/cities', (req, res) => {
    const stateCode = req.query.state_code; 
    const query = 'SELECT * FROM Cities WHERE state_code = ?';
    
    db.query(query, [stateCode], (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching cities');
      }
      res.json(results);
    });
  });
  app.get('/api/museums', (req, res) => {
    const stateCode = req.query.state_code;
    const cityName = req.query.city_name;

    let query;
    let queryParams = [];

    if (cityName) {
        query = 'SELECT * FROM Museums WHERE city_name = ?';
        queryParams = [cityName];
    } else if (stateCode) {
        query = 'SELECT * FROM Museums WHERE state_code = ?';
        queryParams = [stateCode];
    } else {
        return res.status(400).send('Either city_name or state_code must be provided');
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching museums');
      }
      const museums = results.map(museum => ({
        ...museum,
        image_data: museum.image_data,
        
      }));
      res.json(museums);
    });
});

  

  app.listen(3000,()=>{
    console.log("Server running on port 3000");
  })