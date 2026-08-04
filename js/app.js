/* ======================================================
DALUMAT
Version 1.0
====================================================== */

"use strict";

/* ======================================================
ELEMENTS
====================================================== */

const searchForm =
document.getElementById("searchForm");

const searchInput =
document.getElementById("searchInput");

const searchButton =
document.getElementById("searchButton");

const suggestions =
document.getElementById("suggestions");

const searchResult =
document.getElementById("searchResult");

const noResult =
document.getElementById("noResult");

const resultType =
document.getElementById("resultType");

const resultWord =
document.getElementById("resultWord");

const resultDefinition =
document.getElementById("resultDefinition");

const resultExample =
document.getElementById("resultExample");

const resultOrigin =
document.getElementById("resultOrigin");

const resultEnglish =
document.getElementById("resultEnglish");

const dailyWord =
document.getElementById("dailyWord");

const dailyDefinition =
document.getElementById("dailyDefinition");

const translateForm =
document.getElementById("translateForm");

const translateInput =
document.getElementById("translateInput");

const languageSelect =
document.getElementById("languageSelect");

const translationResult =
document.getElementById("translationResult");


/* ======================================================
GLOBAL DATA
====================================================== */

let dictionary = [];

let filteredWords = [];


/* ======================================================
INITIALIZE
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await loadDictionary();

        initializeDailyWord();

        initializeEvents();

    }

);
/* ======================================================
LOAD DICTIONARY
====================================================== */

async function loadDictionary(){

    try{

        const response = await fetch("data/dictionary.json");

        if(!response.ok){

            throw new Error("Hindi mabasa ang dictionary.");

        }

        dictionary = await response.json();

        filteredWords = [...dictionary];

        console.log(

            `DALUMAT loaded ${dictionary.length} words.`

        );

    }

    catch(error){

        console.error(error);

        dailyWord.textContent = "Hindi ma-load ang diksyunaryo.";

        dailyDefinition.textContent =
        "Pakisubukang i-refresh ang pahina.";

    }

}



/* ======================================================
DAILY WORD
====================================================== */

function initializeDailyWord(){

    if(dictionary.length === 0){

        return;

    }

    const today = new Date();

    const dayOfYear = Math.floor(

        (today - new Date(today.getFullYear(),0,0))

        / 86400000

    );

    const word = dictionary[
        dayOfYear % dictionary.length
    ];

    dailyWord.textContent =
    word.word;

    dailyDefinition.textContent =
    word.definition;

}

/* ======================================================
EVENTS
====================================================== */

function initializeEvents(){

    searchForm.addEventListener(

        "submit",

        function(event){

            event.preventDefault();

            searchWord();

        }

    );

}



/* ======================================================
SEARCH WORD
====================================================== */

function searchWord(){

    const keyword =

    searchInput.value

    .trim()

    .toLowerCase();



    if(keyword === ""){

        hideResults();

        return;

    }



    const word = dictionary.find(

        item =>

        item.word.toLowerCase() === keyword

    );



    if(word){

        displayWord(word);

    }

    else{

        showNoResult();

    }

}



/* ======================================================
DISPLAY RESULT
====================================================== */

function displayWord(word){

    noResult.classList.add("hidden");

    searchResult.classList.remove("hidden");



    resultType.textContent =

    word.partOfSpeech || "";



    resultWord.textContent =

    word.word || "";



    resultDefinition.textContent =

    word.definition || "";



    resultExample.textContent =

    word.example || "";



    resultOrigin.textContent =

    word.origin || "";



    resultEnglish.textContent =

    word.english || "";

}



/* ======================================================
NO RESULT
====================================================== */

function showNoResult(){

    searchResult.classList.add(

        "hidden"

    );



    noResult.classList.remove(

        "hidden"

    );

}



/* ======================================================
HIDE RESULT
====================================================== */

function hideResults(){

    searchResult.classList.add(

        "hidden"

    );



    noResult.classList.add(

        "hidden"

    );

}
/* ======================================================
LIVE SEARCH
====================================================== */

searchInput.addEventListener(

    "input",

    function(){

        const keyword =

        searchInput.value

        .trim()

        .toLowerCase();



        suggestions.innerHTML = "";



        if(keyword === ""){

            hideResults();

            return;

        }



        const matches = dictionary.filter(

            item =>

            item.word

            .toLowerCase()

            .startsWith(keyword)

        )

        .slice(0,8);



        if(matches.length === 0){

            return;

        }



        matches.forEach(word=>{

            const item =

            document.createElement("button");



            item.type = "button";



            item.className =

            "suggestion-item";



            item.textContent =

            word.word;



            item.addEventListener(

                "click",

                ()=>{

                    searchInput.value =

                    word.word;



                    suggestions.innerHTML =

                    "";



                    displayWord(word);

                }

            );



            suggestions.appendChild(item);

        });

    }

);



/* ======================================================
HIDE SUGGESTIONS
====================================================== */

document.addEventListener(

    "click",

    function(event){

        if(

            !searchForm.contains(

                event.target

            )

        ){

            suggestions.innerHTML = "";

        }

    }

);
/* ======================================================
TRANSLATION ENGINE
====================================================== */

translateForm.addEventListener(

    "submit",

    async function(event){

        event.preventDefault();

        await translateWord();

    }

);



async function translateWord(){

    const word =

    translateInput.value

    .trim();



    if(word === ""){

        translationResult.innerHTML =

        "<p>Maglagay muna ng salitang isasalin.</p>";

        return;

    }



    const language =

    languageSelect.value;



    translationResult.innerHTML =

    "<p>Nagsasalin...</p>";



    try{

        const response = await fetch(

            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${language}|tl`

        );



        const data =

        await response.json();



        if(

            data.responseData &&

            data.responseData.translatedText

        ){

            translationResult.innerHTML =

            `

            <h3>

                ${data.responseData.translatedText}

            </h3>

            <p>

                Salin ng

                <strong>${word}</strong>

                mula sa

                <strong>${language}</strong>.

            </p>

            `;

        }

        else{

            translationResult.innerHTML =

            "<p>Walang nahanap na salin.</p>";

        }

    }

    catch(error){

        console.error(error);

        translationResult.innerHTML =

        "<p>Hindi makakonekta sa serbisyo ng pagsasalin.</p>";

    }

}
/* ======================================================
FINAL UTILITIES
====================================================== */

window.addEventListener(

    "load",

    function(){

        hideResults();

    }

);



searchInput.addEventListener(

    "keydown",

    function(event){

        if(event.key === "Escape"){

            suggestions.innerHTML = "";

        }

    }

);



translateInput.addEventListener(

    "keydown",

    function(event){

        if(event.key === "Enter"){

            event.preventDefault();

            translateWord();

        }

    }

);



/* ======================================================
HELPERS
====================================================== */

function clearSuggestions(){

    suggestions.innerHTML = "";

}



function clearSearch(){

    searchInput.value = "";

    clearSuggestions();

    hideResults();

}



/* ======================================================
DALUMAT READY
====================================================== */

console.log(

`%cDALUMAT READY`,

"font-size:16px;font-weight:bold;color:#111;"

);

console.log(

`Dictionary Words : ${dictionary.length}`

);

console.log(

"Version : 1.0"

);
