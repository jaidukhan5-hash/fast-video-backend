import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req,res)=>{
  res.sendFile(process.cwd() + '/public/index.html');
});

app.post('/download', async (req,res)=>{

  const { url } = req.body;

  if(!url){
    return res.json({success:false,error:"URL missing"});
  }

  return res.json({
    success:true,
    videoUrl:url,
    platform:"Test Mode"
  });

});

app.listen(3000,()=>{
  console.log("Server running");
});
