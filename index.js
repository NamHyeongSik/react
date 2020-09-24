const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adminUser:gudtlr731@studio.amuc4.mongodb.net/privacy?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

app.get('/', (req,res)=>{res.send('EXPRESS')});

app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});