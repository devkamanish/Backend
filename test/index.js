
async function fetchUrl() {
  const res = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=15");
  const data = await res.json();

   let counts = {image: 0, video : 0}

   data.forEach((ele)=>{
    if(ele.media_type == "image"){
        counts.image ++;

    }
  
    
   })
  console.log("Total images:", counts.image);
  console.log("Total videos:", counts.video);
}

fetchUrl();
