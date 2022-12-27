const express = require('express')
const { v4: uuid} = require('uuid')
const path = require('path')
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

    fs.writeFileSync(path.join(directory,`${id}.txt`) ,JSON.stringify(produit));
    res.sendStatus(201);
});

app.get('/produits/all', (req, res) => {

    var prds = []; 

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const data = fs.readFileSync(path.join(directory, file), 'utf8');
        prds.push({id:file.split('.')[0], ...JSON.parse(data)});
    })

    res.json(prds);
}); 

app.get('/produits/id/:id', (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }
    const data = fs.readFileSync(path.join(directory, `${id}.txt`), 'utf8'); 
    res.status(201).json({id:id , ...JSON.parse(data)});
})

app.get('/produits/famille/:famille', (req, res) => {

    var prds = []; 

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const data = fs.readFileSync(path.join(directory, file), 'utf8');
        const prd = JSON.parse(data); 
        if(prd.famille === req.params.famille)
            prds.push({id:file.split('.')[0], ...JSON.parse(data)});
    })

    res.json(prds);
})

app.put('/produits/:id', (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }

    fs.writeFileSync(path.join(directory,`${id}.txt`) ,JSON.stringify(req.body));
    res.sendStatus(202);

})

app.delete('/produits/:id', (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }

    fs.unlinkSync(path.join(directory,`${id}.txt`))
    res.sendStatus(202);
})

app.listen(port, () => {
    console.log('Serveur lance ....')
})