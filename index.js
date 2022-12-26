const express = require('express')
const { v4: uuid} = require('uuid')
const fs = require('fs')

const app = express();
app.use(express.json());
const directory = './data'; 

const port = 3000;

app.post('/produits', (req, res) => {

    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    const id = uuid();
    const produit = req.body; 

    fs.writeFileSync(`${directory}/${id}.txt`,JSON.stringify(produit));
    res.sendStatus(201);
});

app.listen(port, () => {
    console.log('Serveur lance ....')
})
