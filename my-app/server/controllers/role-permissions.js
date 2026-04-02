
/*const roles={
    ADMIN:"agent",
    USER:"user"
}
const Inrole=(...roles)=>(req,res,next)=>{
  const role=roles.find(role=>req.user.role.indexOf(role)!=-1)
  if(!role){
    return res.status(401).json({message:"role not autoresed"})

  }
  next();
}
module.exports={
    Inrole,
    roles,
};
*/