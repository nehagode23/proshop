import jwt from 'jsonwebtoken';

const generateToken=(res, userid)=>{
    const token=jwt.sign({userId:userid}, process.env.JWT_SECRET, {
        expiresIn:'5d'
    });
    //set JWT as http-only cookie
    res.cookie('jwt',token,{
        httpOnly:true,
        secure: process.env.NODE_ENV!=='development',
        sameSite:'strict',
        maxAge: 5*24*60*60*1000 //5 days
    })

    
}
export default generateToken;