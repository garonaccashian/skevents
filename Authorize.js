const jwt = require("jsonwebtoken");

const Authorize=(req,res,next)=>{
    const token=req.header("Authorization");
    if (!token){
      return  res.status(401).json({message:"unauthorized"})
    }
    try{
    const verified=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=verified.id;
    next();
    } catch (error) {
        res.status(403).json({message:"error"});
    }

}

module.exports=Authorize;