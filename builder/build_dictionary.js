"use strict";

const fs = require("fs");
const path = require("path");

/* ============================================
PATHS
============================================ */

const SOURCE_FILE = path.join(

    __dirname,

    "..",

    "Filipino-WordNet-main",

    "filwordnet.csv"

);

const OUTPUT_DIRECTORY = path.join(

    __dirname,

    "..",

    "data"

);

const OUTPUT_FILE = path.join(

    OUTPUT_DIRECTORY,

    "dictionary.json"

);

let dictionary = [];

/* ============================================
READ CSV
============================================ */

function readCSV(){

    const raw = fs.readFileSync(

        SOURCE_FILE,

        "utf8"

    );



    const rows = raw

        .split("\n")

        .filter(

            row => row.trim() !== ""

        );



    rows.shift();



    return rows;

}
/* ============================================
BUILD DICTIONARY
============================================ */

function buildDictionary(){

    const rows = readCSV();



    const added = new Set();



    rows.forEach(row=>{

        const cols = row.split("\t");



        const word = clean(cols[1]);



        if(

            word === ""

        ){

            return;

        }



        if(

            added.has(

                word.toLowerCase()

            )

        ){

            return;

        }



        added.add(

            word.toLowerCase()

        );



        dictionary.push({

            id:

            dictionary.length + 1,



            word,



            partOfSpeech:

            clean(cols[4]),



            definition:

            clean(cols[6]),



            example:"",



            origin:

            "Filipino WordNet",



            english:

            clean(cols[8])

        });

    });

}
/* ============================================
MAIN
============================================ */

buildDictionary();

saveDictionary();

console.log(

"==================================="

);

console.log(

"DALUMAT BUILDER"

);

console.log(

"Words:",

dictionary.length

);

console.log(

"Saved:",

OUTPUT_FILE

);

console.log(

"==================================="

);
