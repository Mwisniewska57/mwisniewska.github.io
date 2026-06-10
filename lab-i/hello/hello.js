import express from 'express';
const app = express();
const port= 57826;
app.set("view engine","ejs");
app.get('/',(req,res)=>{req
     res.send('Hello World from Express!')});
app.get("/hello/:name",(req,res)=>{
  const name = req.params.name;
  res.render("hello",{name});
});
app.listen(port,()=>{
    console.log(`Hello World app listening on port ${port}`)
});
