
function factorial(num){

    if( typeof num !== "number" || isNaN(num)) return `${num} is not a number sorry.`
    if (num < 0) {
        return "Factorial is not defined for negative numbers";
    }

    if (num ==0) return 1;
  let res = 1;
    for(let i = num; i>0;i--){
        res *= i
    }

    return res;
}


module.exports = factorial

