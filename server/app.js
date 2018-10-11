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

const server = http.createServer((req, res) => {
  // Set CORS headers for cross origin calls
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
  else if(url === '/convert') {

    if(req.method === 'POST') {
      var jsonString = ''

      req.on('data', (data) => {
        jsonString += data;
      })

      req.on('end', () => {
        if(JSON.parse(jsonString).type === 'r2a') {
          var romanToConvert = JSON.parse(jsonString).number;

          if(romanToConvert != '') {
            // http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
            var lookup = {
              I:1,
              V:5,
              X:10,
              L:50,
              C:100,
              D:500,
              M:1000
            },
            result = 0;

            var romanLength = romanToConvert.length

            // This while loop reads the roman numeral from right to left
            // This is required due to how roman numerals work
            // e.g. user enters IX (9) - we first read the X, find it is a 10 from the lookup & add to our result
            // Then read the I, find it is a 1 and minus the 1 from the 10 to get 9
            // This method will work for any number up to 9999, we could extend this if really required though
            while(romanLength--) {

              if(lookup[romanToConvert[romanLength]] < lookup[romanToConvert[romanLength+1]]) {
                result -= lookup[romanToConvert[romanLength]]
              }
              else {

                result += lookup[romanToConvert[romanLength]]
              }
            }

            res.write(JSON.stringify({
              number: result
            }))
            res.end()
          }
        }
        else {
          var numToConvert = JSON.parse(jsonString).number;

          if(numToConvert != '') {
            // https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
            var lookup = {
              M:1000,
              CM:900,
              D:500,
              CD:400,
              C:100,
              XC:90,
              L:50,
              XL:40,
              X:10,
              IX:9,
              V:5,
              IV:4,
              I:1
            },
            result = '';

            // Checks each roman numeral against the input number (numToConvert)
            for(var i in lookup) {
              // Need a while loop here to iterate round for specific conversions
              // e.g. 2 needs two I's
              // Line 1 adds the I to result, loops round and adds another I
              // Line 2 would deduct 1(I) on the first iteration, then again on the second iteration
              // The while loop will then drop out, with the correct result
              while(numToConvert >= lookup[i]) {
                result += i;    // Line 1
                numToConvert -= lookup[i];    // Line 2
              }
            }
            ///////////////////////////////////////////////////////////////////

            res.write(JSON.stringify({
              number: result
            }))
            res.end()
          }
        }
      })
    }

  }
  else {
    res.write('404 - Page not found.')
    res.end();
  }

}).listen(PORT, () => {

 console.log("Server started on port " + PORT);

});
