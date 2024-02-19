
require('dotenv').config();
const mongoose= require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

 
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });


app.use(express.static('public'));
// for user routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute);

// for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);

app.listen(PORT,function () {
    console.log("server is runnig......",PORT);
})
