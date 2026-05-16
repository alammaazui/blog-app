console.log("executed utils.js")
const sum = function (...numbers){

    return numbers.reduce((a,b)=>a+b ,0)

}


module.exports =sum 
