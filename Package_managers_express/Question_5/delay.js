
function delay(msg , delayTime ){
   return new Promise((res, rej)=>{
    setTimeout(() => {
        res(msg)

    }, delayTime);
   })
}

module.exports = delay;;

