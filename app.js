const express = require('express');
const app = express();
const mysql = require('mysql2');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',  //no password is needed for XAMPP
        database: 'kjarosz02', // this is the NAME of your DB 
        port: '3306', // this PORT for XAMPP only
    }
);

connection.connect((err) => {
    if (err) {
        return console.log(err.message)
    } else {
        return console.log(`Connection to local MySQL DB.`)
    };
});



app.get('/', (req, res) => {
    let burgersSQL = `SELECT web_dev_burgers.id, web_dev_burgers.b_name, web_dev_burgers.price, web_dev_burg_types.p_type 
    FROM web_dev_burgers 
    INNER JOIN 
    web_dev_burg_types ON
    web_dev_burgers.type = web_dev_burg_types.id`;

    connection.query(burgersSQL, (err, result) => {
        if (err) throw err;
        res.render('menu', { burgerlist: result });
    });
});


app.get('/filter', (req, res) => {
    let filter = req.query.sort;
    let burgersSQL = `SELECT id, b_name, price FROM web_dev_burgers ORDER BY ${filter}`;

    connection.query(burgersSQL, (err, result) => {
        if (err) throw err;
        res.render('menu', { burgerlist: result });
    });
});

app.get('/admin/add', (req, res) => {
    res.render('add');
});

app.post('/admin/add', (req, res) => {
    const burgerN = connection.escape(req.body.burgername); //get data from <input type="text" name="burgername">
    const descriptB = connection.escape(req.body.descript);
    const ingredsB = connection.escape(req.body.ingreds);
    const priceB = connection.escape(req.body.burgerprice);

    const typeB = connection.escape(req.body.burgertype);

    const InsertBurgersSQL =`INSERT into web_dev_burgers (b_name, description, ingredients, price, img, type) values (${burgerN}, ${descriptB},${ingredsB},${priceB},'default.jpg',${typeB}); `;

    //res.send(InsertBurgersSQL);
    connection.query(InsertBurgersSQL, (err, result)=>{
        if(err) throw err;
        res.send(result);
    });
});


app.listen(3000, () => {
    console.log('Server is listening on localhost:3000');
});