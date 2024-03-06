var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
var data = require("./datasetB/datasetB.json")
const exphbs = require("express-handlebars");
const handlebars = require("handlebars")



const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));

//custom handlebar helper
handlebars.registerHelper('reviewsConverter', function(value){
  if(value === 0)
       return "N/A";
  else
       return value;
});
app.set("view engine", ".hbs");

app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

app.get("/data", (req, res) => {
  
    if (data) {
      res.render("data", { jsonData: JSON.parse(JSON.stringify(data)).slice(0,50), title: "Top 50 products details." });
      return;
    }
    else{
    res.render("error",{message:"Error occurred while reading the file"});
    }
});
app.get('/data/product/:index(\\d+)', (req, res) => {
  var product_id;
   
         if(data)
             {
               if(data.length > req.params.index)
               {
                  product_id = data[req.params.index].asin;
                  console.log(product_id);
                  res.render('prodId',{id:product_id});
               }
               else
               {
                res.render('error',{message:"Product does not exist in the system."});
               }
             }
             else{
              res.render('error',{message:"Error occurred while reading the file."})
             }
      }
  )

// this will return the search form
app.get('/data/search/prdIDform',(req,res)=>{
  res.render('search');
});

// this will return the product information which asin matches with the searched product id
app.get('/data/search/prdID',(req,res)=>{
  var product_id = req.query.productID;
  var responseFlag = false;
          if(data)
             {
              data.forEach(element => {
                  
               if(element.asin == product_id)
               {
                 res.render('data',{jsonData:[element],title: "Requested product details."}) 
                 responseFlag = true;
               }
              }
              );
              if(!responseFlag)
                  res.render('error',{message:"Requested product does not exist in the system."});
          }
          else{
            res.render('error',{message:"Error occurred while reading the file."})
          }
      }
  )
app.get('/data/search/prdNameform',(req,res)=>{
  res.render('searchByName');
});

//this will return all the products which contains the search word in thier titles
app.get('/data/search/prdName',(req,res)=>{
  var product_name = req.query.productName.toString().toLowerCase();
  var dataFlag = false;
  var matchedProducts = [];
   
          if(data)
             {
              data.forEach(element => {     
              let title = element.title.toLowerCase();
               if(title.includes(product_name))
               {
                matchedProducts.push(element);
                dataFlag = true
               }
              }
              );
              if(!dataFlag)
                  res.send('error',{message:"Oops! There are no products matched with your interest."});
              else
                res.render('data',{jsonData: matchedProducts,title: "Requested product possible matches."})
          }
          else
          {
            res.render('error',{message:"Error occurred while reading the file."})
          }
      }
  )


  app.get("/allData", function (req, res) {
   
    if (data) {
      res.render("alldata", { jsonData: JSON.parse(JSON.stringify(data))});
    }
    else{
    res.render("error",{message:"Error occurred while reading the file"});
    }
  });

app.get("/users", function (req, res) {
  res.send("respond with a resource");
});


app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
