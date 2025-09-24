
const isPrime = require("./isPrime")
const os  = require("os")



const numbers = [2, 10, 17, 21, 29, "hello", -5];

numbers.forEach(num=>{
    if(typeof num!== "number"  || isNaN(num) || num<2){
        console.log(`${num} is not a prime number`)

    }else if(isPrime(num)){
        console.log(`${num} is a prime number`)
    }else{
        console.log(`${num} is a prime number`)
    }
})

console.log(os.arch())


