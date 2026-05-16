// const path = require('path')
// const fs = require('fs')
// const http = require('http')
// const os = require('os')
// const sum = require('./utils')
// require('./server.js')
// // let ext= path.extname("test.html")

// // console.log(ext);

// // console.log("welcome to backend development using nodejS and express JS")



// console.log(sum(1,2,3,4,5))

/* Browser Context
- window
- document
- fetch
- console
*/

// NodeJS Globals
// __dirName
// __fileName
// module
// require
// console


// console.log("directory Name",__dirname);
// console.log("file Name",__filename);
// console.log("module ",module);
// console.log("require",require)

const http = require('http')

let requestCounter = 0

const myServer = http.createServer( (req,res) =>{

    requestCounter ++


    console.log(req.url)
    
    if (req.url == "/" || req.url == "/home" ){
        
        res.write(`<h1>Home Page ${requestCounter}</h1>`)
    
        res.end()
    }
    else if (req.url =="/about"){
        
        res.write(`<h1>About Page ${requestCounter}</h1>`)
    
        res.end()
    }


    // console.log("request : " , req);
    // // console.log("request : " , req);

})

myServer.listen(8000,(err)=>{console.log("server started");})


