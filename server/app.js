var http = require('http');

var PORT = 5000;

const MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://localhost:27017/', (err, db) => {

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

// })

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

    MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
      // *** Pull all conversions from db
      if (err) throw err;
      var dbo = db.db("roman-numerals-db");
      dbo.collection("conversions").find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        var dbResult = result;
        db.close();
        res.write(JSON.stringify(dbResult));
        res.end();
      });
    })
  }
  else if(url === '/convert') {

    if(req.method === 'POST') {
      var jsonString = ''

      req.on('data', (data) => {
        jsonString += data;
        console.log("help " + jsonString)
      })

      req.on('end', () => {
        if(JSON.parse(jsonString).type === 'r2a') {
          var romanToConvert = JSON.parse(jsonString).number.toUpperCase();

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
            r2aResult = 0;

            var romanLength = romanToConvert.length

            // This while loop reads the roman numeral from right to left
            // This is required due to how roman numerals work
            // e.g. user enters IX (9) - we first read the X, find it is a 10 from the lookup & add to our result
            // Then read the I, find it is a 1 and minus the 1 from the 10 to get 9
            // This method will work for any number up to 9999, we could extend this if really required though
            while(romanLength--) {

              if(lookup[romanToConvert[romanLength]] < lookup[romanToConvert[romanLength+1]]) {
                r2aResult -= lookup[romanToConvert[romanLength]]
              }
              else {

                r2aResult += lookup[romanToConvert[romanLength]]
              }
            }

            console.log("r2a result: " + r2aResult)
            if(!isNaN(r2aResult) || r2aResult == null) {
              addConversionToDb(romanToConvert, r2aResult)
            }

            res.write(JSON.stringify({
              number: r2aResult
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
            a2rResult = '',
            copyNumToConvert = numToConvert;

            // Checks each roman numeral against the input number (numToConvert)
            for(var i in lookup) {
              // Need a while loop here to iterate round for specific conversions
              // e.g. 2 needs two I's
              // Line 1 adds the I to result, loops round and adds another I
              // Line 2 would deduct 1(I) on the first iteration, then again on the second iteration
              // The while loop will then drop out, with the correct result
              while(copyNumToConvert >= lookup[i]) {
                a2rResult += i;    // Line 1
                copyNumToConvert -= lookup[i];    // Line 2
              }
            }
            ///////////////////////////////////////////////////////////////////

            console.log("a2r result: " + a2rResult)
            if(a2rResult != '') {
              addConversionToDb(numToConvert, a2rResult)
            }

            res.write(JSON.stringify({
              number: a2rResult
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

function addConversionToDb(from, to) {
  MongoClient.connect('mongodb://localhost:27017/', (err, db) => {

    if (err) throw err;
    var dbo = db.db("roman-numerals-db");
    dbo.collection("conversions").insertOne({
      date: getTodaysDate(),
      from: from,
      to: to
    }, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted")
      db.close()
    })
  })

}

function getTodaysDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  }

  today = mm + '-' + dd + '-' + yyyy;

  return today;
}
