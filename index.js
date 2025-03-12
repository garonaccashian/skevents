const express= require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const routes=require("./routes");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const app=express();
dotenv.config();
app.use(cors({
    origin: 'http://localhost:3000', // 👈 Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // optional, only if you send cookies or auth headers
  }));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("backend working");
});

const adminemail="skevents@hotmail.com";
const adminpassword="skwebsite2025";
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Check if the email matches the admin email
    if (email !== adminemail || password !== adminpassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } else{
  
    
  
    // Generate a JWT token for the admin
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    return res.json({ token });
    }
  });
  
  // Protected route for the admin dashboard
  app.get('/admin/dashboard', (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
    });
  });

mongoose.connect("mongodb+srv://garonaccashian:Garonaccashian1997@cluster0.1oess.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("connected to Mongodb")).catch(error=> console.log("connection error",error));
app.use("/auth",routes);
app.listen(process.env.PORT,()=>{
    console.log("server running");
});

