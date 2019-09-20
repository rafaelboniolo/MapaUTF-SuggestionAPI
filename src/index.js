const restify = require('restify') //pacote de importação
const mongoose = require('mongoose') // importar modulo mongoose
const corsMiddleware = require("restify-cors-middleware");  

const cors = corsMiddleware({  
    origins: ["*"],
    allowHeaders: ["Authorization"],
    exposeHeaders: ["Authorization"],
    allowMethods:["Authorization"]

});



mongoose.connect('***********************************', { // conectar ao mongoDB
    useNewUrlParser: true, useCreateIndex: true
})
    
const server = restify.createServer({ // método para criar servidor
    name:'my-rest-api', // nome do servidor
    version:'1.0.0'
})



server.pre(cors.preflight);  
server.use(cors.actual);  
server.use(restify.plugins.bodyParser()) // plugin para permitir o envio de dados, especifico para todos os métodos
// server.use(auth)

//declaração esquema, descrever como será armezado os documentos em mongoDB
const sugestSchema= new mongoose.Schema({
    
    sugestao: {
        type: String,
        required: true // obrigatorio
    },
    rating:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
})

//Model criar uma coleção em db chamado sugestao
const Sugest = mongoose.model('sugest', sugestSchema) 

server.get('/java/sugests/:start/:end', async (req, res, next)=>{
    
    const {start, end} = req.params;
    
    try {
        const sugestoes = await Sugest.find({
            date: {
                $gt:  start,
                $lt:  end
            }
        }).sort({rating: -1});
        res.send(sugestoes)
    } catch (error) {
        console.log(error);
    } finally{
        next();
    }

})


server.post('/java/sugest', async (req,res,next)=>{  

    try {
        await Sugest.create(req.body);
        res.send()
    } catch (error) {
        console.log(error);
    }finally{
        next();
    }
    
})
server.post('/java/sugestP', async (req,res,next)=>{  

    try {
        console.log(req.body.rating);
        
        const suggest = await Sugest.findByIdAndUpdate(req.body._id,{rating:req.body.rating},{new:true});
        console.log(suggest);
        
        res.send(suggest)
    } catch (error) {
        console.log(error);
    }finally{
        next();
    }
    
})

server.listen(process.env.PORT||3002, ()=>{ //indicar a porta para requisições
    console.log('Restify listening on port 3002')
})
