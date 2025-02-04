import bcrypt from 'bcryptjs';

const users=[
    {
        name:'Admin User',
        email:'admin@email.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin:true,
    },
    {
        name:'Neha Gode',
        email:'neha@email.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
    {
        name:'Saad Surve',
        email:'saad@email.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin:false,
    }
]

export default users;