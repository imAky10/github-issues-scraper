const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");

const getIssuesPageHtml = (url, topic, repoName) => {
    request(url, (err, response, html) =>{
        if (err) {
            console.log(err);
        } else if (response.statusCode == 404) {
            console.log("page not found");
        }
        else {
            // getReposLink(html);
            // console.log(html);
            getIssues(html);
        }
    });

    const getIssues = (html) => {
        let $ = cheerio.load(html);
        let issuesElemArr = $(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
        console.log(issuesElemArr.length);
        let arr = [];
        for (let i = 0; i < issuesElemArr.length; i++) {
            let link = $(issuesElemArr[i]).attr("href");
            let fullLink = `https://github.com${link}`;
            arr.push(fullLink);
        }
        // console.log(topic,"     ",arr);
        let folderpath = path.join(__dirname, topic);
        dirCreater(folderpath);
        let filePath = path.join(folderpath, repoName + ".pdf");
        console.log(filePath);
        
        let pdfDoc = new pdfkit();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.text("Open Issues", { align: 'center'});
        pdfDoc.moveDown(1.5);
        pdfDoc.fillColor('purple').list(arr);
        pdfDoc.moveDown(0.5);

        pdfDoc.end();
        
    }
}
module.exports = getIssuesPageHtml;
const dirCreater = (folderpath) => {
    if (fs.existsSync(folderpath) == false) {
        fs.mkdirSync(folderpath);
    }

}