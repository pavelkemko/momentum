const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const currentName = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
let randomNum = getRandom();
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const currentCity = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
let randomQuote = getRandomQuote();
const audio = document.querySelectorAll('audio');
let isPlay = false;
const play = document.querySelector('.play');
let currentAudio = 0;
const nextAudio = document.querySelector('.play-next');
const prevAudio = document.querySelector('.play-prev');
const playItem = document.querySelectorAll('.play-item');

//add current time to page
function showTime() {
  const localDate = new Date();
  const currentTime = localDate.toLocaleTimeString('en-US', { hour12: false });
  time.textContent = currentTime;
  showDate();
  showGreeting();
  getTimeOfDay();
  setTimeout(showTime, 1000);
}

//call function for time
showTime()

//add current date to page
function showDate() {
  const localDate = new Date();
  const currentDate = localDate.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
  date.textContent = currentDate;
}

//add function for greeting
function showGreeting() {
  const localDate = new Date();
  const hours = localDate.getHours();
  if (hours >= 6 && hours < 12) {
    greeting.textContent = "Good morning";
  } else if (hours >= 12 && hours < 18) {
    greeting.textContent = "Good afternoon";
  } else if (hours >= 18 && hours <= 23) {
    greeting.textContent = "Good evening";
  } else {greeting.textContent = "Good night"};
}

//add function to save name and city
function setLocalStorage() {
  localStorage.setItem('name', currentName.value);
  localStorage.setItem('city', currentCity.value);
}

//call function to save name and city
window.addEventListener('beforeunload', setLocalStorage)

//add function to load name and city
function getLocalStorage() {
  if(localStorage.getItem('name')) {
    currentName.value = localStorage.getItem('name');
  }
  if(localStorage.getItem('city')) {
    currentCity.value = localStorage.getItem('city');
    getWeather();
  } else {
    currentCity.value = "Minsk";
    getWeather();
  }
}

//call function to load name and city
window.addEventListener('load', getLocalStorage);

//add function for background
function setBg() {
  let num = randomNum.toString().padStart(2, '0');
  let timeOfDay = getTimeOfDay();
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${num}.jpg`;
  img.onload = () => {      
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${num}.jpg')`
  }; 
}

//call function for background
setBg()

//add function for time of day
function getTimeOfDay() {
  const localDate = new Date();
  const hours = localDate.getHours();
  if (hours >= 6 && hours < 12) {
    return 'morning';
  } else if (hours >= 12 && hours < 18) {
    return 'afternoon';
  } else if (hours >= 18 && hours <= 23) {
    return 'evening';
  } else {return 'night'};
}

//add function to get number of picture
function getRandom() {
  min = 1;
  max = 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//add functions to change slides
function getSlideNext() {
  if (randomNum < 20) {
    randomNum += 1;
  } else if (randomNum === 20) {
    randomNum = 1;
  }
  setBg()
}

function getSlidePrev() {
  if (randomNum > 1) {
    randomNum -= 1;
  } else if (randomNum === 1) {
    randomNum = 20;
  }
  setBg()
}

//call functions to change slides
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

//add function to get weather
async function getWeather() {
  try {
  weatherError.textContent = '';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity.value || 'Minsk'}&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
  humidity.textContent = `Humidity: ${Math.round(data.main.humidity)} %`;
  } catch (error) {
    weatherError.textContent = `Error! city not found for "${currentCity.value}"`;
    wind.textContent = '';
    humidity.textContent = '';
    weatherDescription.textContent = '';
    temperature.textContent = '';
  }
}

//call function to get weather
getWeather();

//add function to update weather every 10 minutes
setInterval(getWeather, 600000);

//function to read city input
currentCity.addEventListener('change', () => {
  if (currentCity.value.length < 1) {
    weatherError.textContent = "Error! Nothing to geocode for ''!";
    weatherIcon.className = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherDescription.textContent = '';
    temperature.textContent = '';
  }
  if (currentCity.value.length >= 1) {
    getWeather();
  }
});

//add function to get quote and author
async function getQuotes() {  
  const quotes = 'js/data.json';
  const res = await fetch(quotes);
  const data = await res.json();
  quote.textContent = data[randomQuote].quote;
  author.textContent = data[randomQuote].source;
}

//add function to get a random quote
function getRandomQuote() {
  min = 0;
  max = 13;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//call function to get quote and author
getQuotes();

//add function to get next quote
function getNextQuote() {
  if (randomQuote < 13) {
    randomQuote += 1;
  } else if (randomQuote === 13) {
    randomQuote = 0;
  }
  getQuotes();
}

//add function to get next quote by quote-button
changeQuote.addEventListener('click', getNextQuote);

//add function to play audio
function playAudio() {
  if (!isPlay) {
    audio[currentAudio].currentTime = 0;
    audio[currentAudio].play();
    playItem[currentAudio].classList.add('item-active');
    isPlay = true;
  } else {
    audio[currentAudio].pause();
    isPlay = false;
  }
  audio[currentAudio].addEventListener('ended', getNextAudio);
}

//add function to toggle audio button
function toggleBtn() {
  play.classList.toggle('pause');
  playAudio();
}

//add function to read audio button
play.addEventListener('click', toggleBtn);

//add function to get next audio
function getNextAudio() {
  playItem[currentAudio].classList.remove('item-active');
  audio[currentAudio].pause();
  if (currentAudio < 3) {
    currentAudio += 1;
  } else if (currentAudio === 3) {
    currentAudio = 0;
  }
  audio[currentAudio].play();
  playItem[currentAudio].classList.add('item-active');
  audio[currentAudio].addEventListener('ended', getNextAudio);
}

//add function to get previous audio
function getPrevAudio() {
  playItem[currentAudio].classList.remove('item-active');
  audio[currentAudio].pause();
  if (currentAudio > 0) {
    currentAudio -= 1;
  } else if (currentAudio === 0) {
    currentAudio = 3;
  }
  audio[currentAudio].play();
  playItem[currentAudio].classList.add('item-active');
  audio[currentAudio].addEventListener('ended', getNextAudio);
}

//add function to read play next button
nextAudio.addEventListener('click', getNextAudio);

//add function to read play previous button
prevAudio.addEventListener('click', getPrevAudio);

//add self-test to console
console.log('Полностью выполненные пункты:\n1.Часы и календарь +15\n2.Приветствие +10\n3.Смена фонового изображения +20\n4.Виджет погоды +15\n5.Виджет цитата дня +10\n6.Аудиоплеер +15\n\nНевыполненные пункты:\n7.Продвинутый аудиоплеер\n8.Перевод приложения на два языка\n9.Получение фонового изображения от API\n10.Настройки приложения\n11.Дополнительный функционал на выбор\n12.На основе созданного проекта вы можете создать расширение для Google Chrome без публикации его в интернет-магазине\n\nTotal score: 85/160');