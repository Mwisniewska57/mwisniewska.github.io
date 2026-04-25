const API_KEY="5cfcf33a0d2d3bdfff3c3c4fdb95cbd4";
const cityInput= document.getElementById("city");
const searchbutton=document.getElementById("search");
const currentResult=document.getElementById("current-result");
const forecastResult=document.getElementById("forecast-results");
const todaysSection=document.getElementById("todays");
const forecastSection=document.getElementById("forecastsec")

searchbutton.addEventListener("click", ()=>{
  const city = cityInput.value.trim();
  if (!city) return;
  getCurrentWeather(city);
  getForecast(city);

});
function getCurrentWeather(query){
  const url = `https://api.openweathermap.org/data/2.5/weather`
    + `?q=${query}&appid=${API_KEY}&units=metric`;
  let req= new XMLHttpRequest();
  req.open("GET",url,true);
  req.addEventListener("load",()=>{
    const data=JSON.parse(req.responseText);
    console.log(data);
    displayCurrent(data);
  })
  req.send();
}
async function getForecast(query){
  const url = `https://api.openweathermap.org/data/2.5/forecast`
    + `?q=${query}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    console.log("fetch",data);
    displayForecast(data);
  } catch(err){
    forecastResult.textContent=err.message;

  }
}
function displayCurrent(query){
  todaysSection.style.display="block";
  const temp = Math.round(query.main.temp);
  const description = query.weather[0].description;
  const city =query.name;
  const iconCode = query.weather[0].icon;
  const tempMax= Math.round(query.main.temp_max);
  const tempMin= Math.round(query.main.temp_min);
  const feelsLike = Math.round(query.main.feels_like);


  const iconUrl=`https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  currentResult.innerHTML=` <img src="${iconUrl}" alt="${description}">
    <div>
     <p>${city}: ${temp}°C, ${description}</p>
     <p>Feels Like: ${feelsLike}°C</p>
     <p>Min: ${tempMin}°C &nbsp;|&nbsp Max:${tempMax}°C</p>
     </div>
    `;
}
function displayForecast(query){
  forecastSection.style.display="block";
  const days = query.list.filter((_,i)=>i % 8==0).slice(0,4);
  forecastResult.innerHTML=days.map(entry=>{
    const date = new Date(entry.dt_txt).toLocaleDateString();
    const temp =Math.round(entry.main.temp);
    const desc = entry.weather[0].description;
    const icon= entry.weather[0].icon;
    return `<div class="forecast-card">
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png">
      <p>${temp}°C — ${desc}</p>
    </div>`;
  }).join("");

}
