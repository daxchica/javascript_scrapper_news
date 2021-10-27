const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const { contains } = require("cheerio/lib/static");

const app = express();

const newspapers = [
    {
        name: "radiofranciainternacional",
        address: "https://www.rfi.fr",
        base: "https://www.rfi.fr",
    },
    {
        name: "eluniverso",
        address: "https://www.eluniverso.com/noticias/economia",
        base: "https://www.eluniverso.com",
    },
    {
        name: "primicias",
        address: "https://www.primicias.ec/economia",
        base: "",
    },
    {
        name: "elcomercioec",
        address: "https://www.elcomercio.com/",
        base: "",
    },
    {
        name: "expresoec",
        address: "https://www.expreso.ec",
        base: "https://www.expreso.ec",
    },
];

const articles = [];

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("Ecuador")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr("href");

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name,
            });
        });
    });
});

app.get("/", function (req, res) {
    res.json("Welcome to my News API");
});

app.get("/news", function (req, res) {
    res.json(articles);
});

// {
//     axios.get('https://www.rfi.fr/es/')
//     .then(function(response) {
//         const html = response.data
//         const $ = cheerio.load(html)

//         $('a:contains("Ecuador")', html).each(function() {
//             const title = $(this).text()
//             const url = $(this).attr('href')
//             articles.push({
//                 title,
//                 url
//             })
//         })
//         res.json (articles)
//     }).catch((err) => console.log(err))
// })

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
