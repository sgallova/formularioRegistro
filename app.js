const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const app=express();
app.use(express.urlencoded({ extended: false }));

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

app.get('/register', (req,res)=>{
    res.render('index');
});


app.post('/register', async (req,res)=>{

    try{
        const hash = await bcrypt.hash(req.body.password, 10);
        await User.create({name:req.body.name, email:req.body.email, password:hash});
        res.redirect('/');

    }catch(err){
        console.log(err);
    }
    
});

app.get('/', async (req,res)=>{
    try{
        const usuarios= await User.find();
        res.render('users', {"userList":usuarios});
        

    }catch(err){
        console.log(err);
    }
});


app.listen(3000, () => console.log('Listening on port 3000!'));