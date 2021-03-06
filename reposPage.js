const request = require("request");
const cheerio = require("cheerio");
const getIssuesPageHtml = require("./issue");

const getReposPageHtml = (url, topic) => {
    request(url, (err, response, html) => {
        if (err) {
            console.log(err);
        } else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else {
            getReposLink(html);
        }
    });

    const getReposLink = (html) => {
        // cheerio
        let $ = cheerio.load(html);
        let headingsArr = $(".f3.color-text-secondary.text-normal.lh-condensed");
        console.log(topic);
        for (let i = 0; i < 10; i++) {
            let twoAnchors = $(headingsArr[i]).find("a");
            let link = $(twoAnchors[1]).attr("href");
            // console.log(link);
            let fullLink = `https://github.com${link}/issues`;
            // console.log(fullLink);
            let repoName = link.split("/").pop();

            getIssuesPageHtml(fullLink, topic,repoName);
        }
        console.log("````````````````````````````");
    }
}
module.exports = getReposPageHtml;