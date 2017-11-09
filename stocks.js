const https = require("https");
const api = require("./api.json");
const http = require("http");

//fields needed to query Alpha Vantage API
const date = new Date();
const todaysDate = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + ("0" + date.getDate())).toString();
const timeSeries = "Time Series (Daily)";

function printStockPrices(stockPrices) {
  console.log(
    `Company: ${stockPrices["Meta Data"]["2. Symbol"]}
    Date: ${todaysDate}
    Open: ${stockPrices[timeSeries][todaysDate]["1. open"]}
    High: ${stockPrices[timeSeries][todaysDate]["2. high"]}
    Low: ${stockPrices[timeSeries][todaysDate]["3. low"]}
    Close: ${stockPrices[timeSeries][todaysDate]["4. close"]}
    Adjusted Close: ${stockPrices[timeSeries][todaysDate]["5. adjusted close"]}`
  );
}

function printError(error) {
  console.error(error.message);
}

//query string
//https://www.alphavantage.co/query?apikey=demo&function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT

function get(query) {
   try {
     https.get(`https://www.alphavantage.co/query?apikey=${api.key}&function=TIME_SERIES_DAILY_ADJUSTED&symbol=${query}`, (response) => {
       if (response.statusCode ===200) {
         //score the data as buffer to be parsed later
         let body = "";
         response.on('data', function(chunk) {
           body += chunk;
         }); //END OF on 'data'

         response.on('end', () => {
           //parse the data\
           try {
             const stockPrices = JSON.parse(body);
             //check to see if it was a valid stock symbol
            if(stockPrices["Meta Data"]["2. Symbol"]) {
              printStockPrices(stockPrices);
            }
            else {
              printError(new Error(`The company ${query} was not found`));
            }
           }
           catch (error) {
             printError(error);
           }
         }); //END OF on 'end'
       }//END OF if(response.statusCode === 200)
       else {
         printError(new Error(`There was an error getting stock information for ${query} (${http.STATUS_CODES[response.statusCode]})`));
       }
     }); //END of https.get()
   } //end of main try{}
   catch (error) {
     printError(error);
   } //END of main try-catch block
}

//export the module'
module.exports.get = get;
