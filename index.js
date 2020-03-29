const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

let page = axios
  .get(
    "https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic#covid19-container"
  )
  .then(response => {
    const $ = cheerio.load(response.data);
    const countries = [];
    $("div#covid19-container>table>tbody>tr").each((index, element) => {
      if (index > 1) {
        let cases = $(element) //Parse Infected, dead, cured
          .find("td")
          .text()
          .split("[")[0]
          .replace(/,/g, "");
        let infected = parseInt(cases.split("\n")[0]);
        let dead = parseInt(cases.split("\n")[1]);
        let cured = parseInt(cases.split("\n")[2]);
        let flag = $(element)
          .find("img")
          .attr("src");
        const name = {
          //Prepare json
          flag: flag,
          country: $(element)
            .find("a")
            .text()
            .split("[")[0],
          infected: infected,
          dead: dead,
          cured: cured
        };
        if (!isNaN(name.infected)) {
          countries.push(JSON.stringify(name));
        }
      }
    });
    //Write to file
    fs.writeFileSync("./output/countries.json", `[${countries}]`, err => {});
  });
