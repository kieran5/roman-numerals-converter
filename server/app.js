var http = require('http');

var PORT = 5000;

const MongoClient = require('mongodb').MongoClient

var dbResult;

MongoClient.connect('mongodb://localhost:27017/', (err, db) => {

  // *** Create db

  // if (err) throw err;
  // console.log("Database created!");
  // db.close();

  // *** Create collection

  // if(err) throw err;
  // var dbo = db.db("roman-numerals-db")
  // dbo.createCollection("conversions", function(err, res) {
  //   if(err) throw err;
  //   console.log("Collection created.")
  //   db.close()
  // })

  // *** Create test document

  // if(err) throw err;
  // var dbo = db.db("roman-numerals-db")
  //
  // var obj = {
  //   date: "09-10-2018",
  //   from: "3",
  //   to: "III"
  // }
  //
  // dbo.collection("conversions").insertOne(obj, function(err, res) {
  //   if(err) throw err;
  //   console.log("1 document inserted")
  //   db.close()
  // })

  // *** Pull all conversions from db
  if (err) throw err;
  var dbo = db.db("roman-numerals-db");
  dbo.collection("conversions").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    dbResult = result;
    db.close();
  });

})

http.createServer((req, res) => {
  // Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

  var url = req.url;

  if(url === '/allConversions') {
    res.write(JSON.stringify(dbResult));
    res.end();
  }
  else {
    res.write('404 - Page not found.')
    res.end();
  }

}).listen(PORT, () => {

 console.log("Server started on port " + PORT);

});
