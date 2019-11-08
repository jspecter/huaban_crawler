const http = require("http");
const chalk = require("chalk");
const cralwer = require("./crawler");
const urlParser = require("url");
const path = require("path");
const fs = require("fs");

const server = http.createServer((msg, res) => {
    const { url } = msg;
    let { pathname, query: source } = urlParser.parse(url);
    const { q: query, limit } = require("querystring").parse(source);

    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Transfer-Encoding", "chunked");

    res.statusCode = 200;

    //限制最大图片获取数量为100
    let number = limit > 100 ? 100 : limit;

    routeUrl(res, pathname, { query, limit: number });
});

server.listen(5000, "localhost", () => {
    console.log(chalk.green("服务器工作在：http://localhost:5000"));
});

function routeUrl(res, route, query) {
    if (route === "/") {
        let html = fs.readFileSync(path.resolve(__dirname, "fe", "gallery.html"), { encoding: "utf-8" });
        res.setHeader("Content-Type", "text/html; charset:utf-8");
        res.end(html);
    } else if (route === "/favicon.ico") {
        return;
    } else if (route === "/renderImg.js") {
        let js = fs.readFileSync(path.resolve(__dirname, "fe", "renderImg.js"), { encoding: "utf-8" });
        res.setHeader("Content-Type", "text/javascript; charset:utf-8");
        res.end(js);
    } else if (route === "/data/") {
        res.setHeader("Content-Type", "application/json; charset:utf-8");
        cralwer(query, false)
            .then(data => {
                if (!data) {
                    data = JSON.stringify({});
                }
                res.end(data);
            })
            .catch(err => {
                res.end(err);
            });
    }
}
