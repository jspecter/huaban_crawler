const fetchJson = function(url, obj) {
    return new Promise((resolve, reject) => {
        url = `${url}/?q=${obj.query}&limit=${obj.number}`;
        fetch(url, {
            method: "GET",
            mode: "cors"
            // headers: {
            //     "Content-Type": "application/json"
            // }
        })
            .then(res => {
                resolve(res.json());
            })
            .catch(err => {
                reject(err.message);
            });
    });
};

const fetchJsonByXHR = function(url, query, fn) {
    url = query ? `${url}/?q=${query}` : url;

    let xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.send();
    xhr.onload = fn;
};

const parseUrl = function(url) {
    let querys = url.match(/(.+)\?width=(\d+)&height=(\d+)$/);
    return {
        src: querys[1],
        width: parseInt(querys[2]),
        height: parseInt(querys[3])
    };
};

const getMinHeightImg = function(start, end, i, list) {
    let upperRow = list.slice(start, end);
    let sortRow = upperRow.sort((a, b) => {
        let { height: aHeight } = a;
        let { height: bHeight } = b;
        return aHeight - bHeight;
    });
    return sortRow[i];
};

const render = function(urls) {
    const ROW_NUM = 5;
    let len = Object.keys(urls).length;
    let parentEle = document.querySelector(".wrapper");
    let iWidth = Math.floor((document.body.offsetWidth - 20) / ROW_NUM);
    let imgList = [];

    for (let i = 0; i < len; i++) {
        let img = new Image(),
            url = urls[i];

        let { src, width, height } = parseUrl(url);
        let radio = width / height;
        let row = Math.floor(i / ROW_NUM);

        img.src = src;
        imgList.push(img);
        img.width = iWidth;
        img.height = Math.floor(iWidth / radio);
        img.style.position = "absolute";

        if (row === 0) {
            img.style.top = 0;
            img.style.left = (i - row * ROW_NUM) * iWidth + "px";
        } else {
            let start = (row - 1) * ROW_NUM,
                end = start + ROW_NUM,
                iInRow = i - row * ROW_NUM;
            let topImg = getMinHeightImg(start, end, iInRow, imgList);
            if (topImg) {
                let topNum = parseInt(topImg.style.top.replace("px", ""));
                img.style.left = topImg.style.left;
                img.style.top = topNum + topImg.height + "px";
            }
        }

        parentEle.appendChild(img);
    }
};

export { fetchJson, fetchJsonByXHR, render };
