/* ===================================================
   DALUMAT
   Main Application
   Version 1.0 Final
=================================================== */



// ===================================================
// FIREBASE
// ===================================================

import {

    db

} from "./firebase.js";



import {

    collection,

    getDocs,

    query,

    orderBy,

    limit

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ===================================================
// DOM
// ===================================================

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

const searchResultContainer =
document.getElementById("searchResultContainer");

const randomWordBtn =
document.getElementById("randomWordBtn");

const backToTop =
document.getElementById("backToTop");

const translateForm =
document.getElementById("translateForm");

const translationResult =
document.getElementById("translationResult");




// ===================================================
// CACHE
// ===================================================

let words=[];

let translations=[];




// ===================================================
// START
// ===================================================

document.addEventListener(

"DOMContentLoaded",

async()=>{

await loadWords();

await loadTranslations();

await loadDailyWord();

initializeEvents();

}

);




// ===================================================
// EVENTS
// ===================================================

function initializeEvents(){

if(searchForm){

searchForm.addEventListener(

"submit",

searchWord

);

}

if(randomWordBtn){

randomWordBtn.addEventListener(

"click",

showRandomWord

);

}

if(translateForm){

translateForm.addEventListener(

"submit",

translateWord

);

}

window.addEventListener(

"scroll",

toggleBackToTop

);

if(backToTop){

backToTop.addEventListener(

"click",

()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

}

// ===================================================
// LOAD WORDS
// ===================================================

async function loadWords(){

try{

const snapshot =
await getDocs(
collection(db,"words")
);

words=[];

snapshot.forEach(doc=>{

words.push({

id:doc.id,

...doc.data()

});

});

console.log(

`Loaded ${words.length} words.`

);

}

catch(error){

console.error(

"Unable to load words.",

error

);

}

}



// ===================================================
// LOAD TRANSLATIONS
// ===================================================

async function loadTranslations(){

try{

const snapshot =
await getDocs(
collection(db,"translations")
);

translations=[];

snapshot.forEach(doc=>{

translations.push({

id:doc.id,

...doc.data()

});

});

console.log(

`Loaded ${translations.length} translations.`

);

}

catch(error){

console.error(

"Unable to load translations.",

error

);

}

}



// ===================================================
// LOAD ALAM MO BA?
// ===================================================

async function loadDailyWord(){

try{

const q=query(

collection(db,"daily_feature"),

orderBy("date","desc"),

limit(1)

);

const snapshot=
await getDocs(q);

if(snapshot.empty){

return;

}

const daily=snapshot.docs[0].data();

const word=words.find(

item=>item.id===daily.wordId

);

if(!word){

return;

}

document.getElementById(

"dailyWordTitle"

).textContent=

word.word;



document.getElementById(

"dailyDefinition"

).textContent=

word.definition;



document.getElementById(

"dailyExample"

).textContent=

word.example;



document.getElementById(

"dailyOrigin"

).textContent=

word.origin;



const typeElement=

document.querySelector(

".word-type"

);

if(typeElement){

typeElement.textContent=

word.partOfSpeech;

}

}

catch(error){

console.error(

"Unable to load daily word.",

error

);

}

}
// ===================================================
// LIVE SEARCH
// ===================================================

if(searchInput){

searchInput.addEventListener(

"input",

liveSearch

);

}



function liveSearch(){

const keyword=

searchInput.value

.trim()

.toLowerCase();



if(keyword===""){

searchResultContainer.innerHTML="";

return;

}



const results=

words.filter(word=>{

return(

word.word

.toLowerCase()

.includes(keyword)

);

});



displaySearchResults(

results

);

}



// ===================================================
// DISPLAY SEARCH RESULT
// ===================================================

function displaySearchResults(results){

searchResultContainer.innerHTML="";



if(results.length===0){

searchResultContainer.innerHTML=

`

<div class="feature-card">

<h3>

Walang Resulta

</h3>

<p>

Walang salitang tumutugma sa iyong hinanap.

</p>

</div>

`;

return;

}



results.forEach(word=>{

const card=

document.createElement("div");



card.className=

"feature-card";



card.innerHTML=

`

<h2>

${word.word}

</h2>

<p class="word-type">

${word.partOfSpeech}

</p>

<p>

${word.definition}

</p>

<div class="example-box">

<h4>

Halimbawa

</h4>

<p>

${word.example}

</p>

</div>

<div class="origin-box">

<h4>

Pinagmulan

</h4>

<p>

${word.origin}

</p>

</div>

`;



searchResultContainer.appendChild(

card

);

});

}



// ===================================================
// SEARCH FORM
// ===================================================

async function searchWord(event){

event.preventDefault();



liveSearch();

}

// ===================================================
// TRANSLATION
// ===================================================

async function translateWord(event){

event.preventDefault();



const language=

document.getElementById(

"languageSelect"

).value;



const keyword=

document.getElementById(

"translateInput"

)

.value

.trim()

.toLowerCase();



if(keyword===""){

translationResult.innerHTML=

`

<p>

Maglagay muna ng salitang isasalin.

</p>

`;

return;

}



const result=

translations.find(item=>{

return(

item.language

.toLowerCase()===

language.toLowerCase()

&&

item.foreignWord

.toLowerCase()===

keyword

);

});



if(!result){

translationResult.innerHTML=

`

<h3>

Walang Salin

</h3>

<p>

Walang natagpuang salin para sa salitang ito.

</p>

`;

return;

}



translationResult.innerHTML=

`

<h3>

${result.foreignWord}

</h3>

<p>

<strong>Salin sa Filipino</strong>

</p>

<h2>

${result.filipinoWord}

</h2>

<div class="example-box">

<h4>

Halimbawa

</h4>

<p>

${result.example}

</p>

</div>

`;

}



// ===================================================
// CLEAR TRANSLATION
// ===================================================

function clearTranslation(){

translationResult.innerHTML=

`

<p>

Ang salin ay lalabas dito.

</p>

`;

}



const translateInput=

document.getElementById(

"translateInput"

);



if(translateInput){

translateInput.addEventListener(

"input",

()=>{

if(

translateInput.value.trim()===""

){

clearTranslation();

}

}

);

}

// ===================================================
// RANDOM WORD
// ===================================================

function showRandomWord(event){

if(event){

event.preventDefault();

}

if(words.length===0){

return;

}

const random=

words[

Math.floor(

Math.random()*words.length

)

];

displaySingleWord(random);

window.scrollTo({

top:0,

behavior:"smooth"

});

}



// ===================================================
// DISPLAY SINGLE WORD
// ===================================================

function displaySingleWord(word){

searchResultContainer.innerHTML=

`

<div class="feature-card">

<h2>

${word.word}

</h2>

<p class="word-type">

${word.partOfSpeech}

</p>

<p id="dailyDefinition">

${word.definition}

</p>

<div class="example-box">

<h4>

Halimbawa

</h4>

<p>

${word.example}

</p>

</div>

<div class="origin-box">

<h4>

Pinagmulan

</h4>

<p>

${word.origin}

</p>

</div>

</div>

`;

}



// ===================================================
// BACK TO TOP
// ===================================================

function toggleBackToTop(){

if(

window.scrollY>400

){

backToTop.classList.add(

"show"

);

}

else{

backToTop.classList.remove(

"show"

);

}

}



// ===================================================
// ESC KEY
// ===================================================

document.addEventListener(

"keydown",

(event)=>{

if(

event.key==="Escape"

){

searchInput.value="";

searchResultContainer.innerHTML="";

clearTranslation();

}

});



// ===================================================
// ENTER KEY
// ===================================================

searchInput.addEventListener(

"keydown",

(event)=>{

if(

event.key==="Enter"

){

event.preventDefault();

liveSearch();

}

});



// ===================================================
// SEARCH FOCUS
// ===================================================

window.addEventListener(

"load",

()=>{

searchInput.focus();

});

// ===================================================
// UTILITIES
// ===================================================

function escapeHTML(value){

return String(value)

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}



// ===================================================
// SORT WORDS
// ===================================================

function sortWords(){

words.sort((a,b)=>{

return a.word.localeCompare(

b.word,

"fil"

);

});

}



// ===================================================
// REFRESH
// ===================================================

async function refreshDatabase(){

await loadWords();

await loadTranslations();

sortWords();

}



// ===================================================
// INITIAL SORT
// ===================================================

window.addEventListener(

"load",

()=>{

sortWords();

});



// ===================================================
// CONSOLE
// ===================================================

console.log(

"%cDALUMAT",

"font-size:22px;font-weight:bold;color:#111;"

);

console.log(

"DALUMAT Version 1.0 Final"

);

console.log(

"Application Loaded Successfully."

);



// ===================================================
// END
// ===================================================
