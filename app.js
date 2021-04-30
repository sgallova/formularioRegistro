const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const cookieSession = require('cookie-session');

const app=express();
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
    secret: 'sdfkjskjhnf',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema= mongoose.Schema({ 
    name:String,
    email:String,
    password:String
   });

var User= mongoose.model("User",schema);

app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/login', (req,res)=>{
    res.render('login');
});


app.post('/login', async (req,res)=>{

    let validation=false;

    try{
        const usuario= await User.findOne({'email':req.body.email});
        if(usuario){
            validation=await bcrypt.compare(req.body.password, usuario.password);
        }

        if(validation){
            req.session.user= usuario.id;
            const usuarios= await User.find();
            res.render('users', {"userList":usuarios});
        }else{
            res.render('login', {"error":true});
        }

    }catch(err){
        console.log(err);
    }
    
});


app.get('/logout', (req,res)=>{
    res.clearCookie('user');
    req.session = null;
    res.redirect('/login');
});

app.listen(3000, () => console.log('Listening on port 3000!'));