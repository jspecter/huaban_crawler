const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const sa = require("superagent");

/**
 *
 * @param {String} url:https://huaban.com/explore/guzhen
 * @param {Number} limit:img number
 * @param {Boolean} isCut:is cut image
 */

module.exports = function({ query, limit }, isCut) {
    return new Promise((resolve, rejected) => {
        let baseUrl = "https://huaban.com/search/";
        query = require("querystring").escape(query);
        let url = `${baseUrl}?q=${query}&type=pins&k2q1tu9d&page=3&per_page=${limit}&wfl=1`;
        sa.get(url)
            .then(res => {
                const $ = cheerio.load(res.text);

                // fs.writeFile(path.resolve(__dirname, "huaban.html"), res.text, err => {
                //     if (err) {
                //         throw err;
                //     }
                // });

                let imgs = {};

                const eles = $("body").find("script");

                let contents = eles
                    .first()
                    .contents()
                    .text();

                let reg = /.*app\.page\["pins"\]\s+=\s+(\[{.+}\])/gm,
                    result,
                    source;

                source = reg.exec(contents);

                if (!source || source.length === 0) {
                    rejected("没有查询到相关图片");
                }

                result = JSON.parse(source[1]);

                result.forEach((item, index) => {
                    let imgCdn = "http://hbimg.huabanimg.com";
                    let { file } = item;
                    imgs[index] = `${imgCdn}/${file.key}${isCut ? "_fw236" : ""}?width=${file.width}&height=${
                        file.height
                    }`;
                });

                let data = JSON.stringify(imgs, null, " ");

                fs.writeFile(path.resolve(__dirname, "data.json"), data, err => {
                    if (err) {
                        throw err;
                    }
                });

                resolve(data);
            })
            .catch(err => {
                rejected("采集发生错误");
            });
    });
};
