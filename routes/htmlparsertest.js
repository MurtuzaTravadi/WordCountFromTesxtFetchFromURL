var express = require('express');
var router = express.Router();
const request = require('request');
var HTMLParser = require('node-html-parser');


router.get('/baseurl/:testurl', async function(req, res, next){
  if(req.params.testurl == '' || req.params.testurl == null)
  {
    res.send('Enter URL');
  }
  try {
    let totalwords = await getWordfromURL(req.params.testurl);  
    let root = HTMLParser.parse(totalwords);
    let result = findMostRepeatedWord(root.innerText);
    res.send(JSON.stringify(result));
  } catch (error) {
    res.send('URL is invalid');
  }
});

function getWordfromURL(urlid){
    return new Promise(function (resolve, reject) {
      request('http://'+urlid, async function (error, res, body) {
       if (!error && res.statusCode === 200) {
         resolve(body);
       } else {
         reject(error);
       }
   })
 });    
}

 function findMostRepeatedWord(str) {
  let words = str.match(/\w+/g);
  let occurances = {};

  for (let word of words) {
    if (occurances[word]) {
      occurances[word]++;
    } else {
      occurances[word] = 1;
    }
  }

  let mostRepeatedWord = [];
    for(let cnt of Array.from(new Set(words))){
        mostRepeatedWord.push({ 'Word' : cnt, 'Count' :  occurances[cnt] });
    }
   return mostRepeatedWord;
}

module.exports = router;
