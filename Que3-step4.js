const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
   
        MongoClient.connect(url, { useNewUrlParser: true })
                .catch((err)=>{
                    console.log("error occurred while connecting to the database")
                })
                .then((client)=>{
                    console.log('Connected successfully to MongoDB');
                    console.log('1');
            const db = client.db("mydb");
            console.log('2');
            const collection = db.collection('customers');
            console.log('3');
            const cursor = collection.find({}).limit(10);
            console.log('4');
            cursor.forEach(doc => {
                console.log(doc)
            }, err => {
                if (err) {
                    console.log("Error reading documents:", err);
                    return;
                }
                console.log('5');
                client.close();
            })
        })          
    }

setTimeout(() => {
    findAll()
    console.log('iter');           
}, 5000);
