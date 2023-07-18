const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const path = require('path'); //

const API_KEY = process.env.APY_KEY

app.use(express.static(path.join(__dirname, 'build'))) 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.post('/completions', async(req, resp) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model : "gpt-3.5-turbo",
            messages : [{ role: "user", content: req.body.message}],
            max_tokens: 1000, 
        })
    }

    try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       resp.send(data)
    } catch(error){
       console.error(error)
    }
})

app.listen(process.env.PORT || 8000, ()=> console.log("Your server is running at PORT " + PORT))
