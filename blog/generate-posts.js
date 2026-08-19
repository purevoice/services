const fs = require("fs");
const path = require("path");

const blogDirectory = __dirname;


/* ==================================================
   FIND BLOG HTML FILES
================================================== */

const files = fs.readdirSync(blogDirectory);

const posts = [];


/* ==================================================
   EXTRACT META TAG
================================================== */

function getMeta(content, name) {

    const regex = new RegExp(
        `<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,
        "i"
    );

    const match =
        content.match(regex);

    return match
        ? match[1].trim()
        : "";

}


/* ==================================================
   EXTRACT H1 AS FALLBACK TITLE
================================================== */

function getH1(content) {

    const match =
        content.match(
            /<h1[^>]*>([\s\S]*?)<\/h1>/i
        );

    if (!match) {
        return "";
    }

    return match[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


/* ==================================================
   PROCESS EACH HTML ARTICLE
================================================== */

files.forEach(function (file) {


    if (!file.endsWith(".html")) {
        return;
    }


    /*
       These aren't blog articles.
    */

    if (
        file === "index.html" ||
        file === "blog-template.html"
    ) {
        return;
    }


    const filePath =
        path.join(
            blogDirectory,
            file
        );


    const content =
        fs.readFileSync(
            filePath,
            "utf8"
        );


    const title =
        getMeta(
            content,
            "post-title"
        ) ||
        getH1(content);


    const description =
        getMeta(
            content,
            "post-description"
        );


    const category =
        getMeta(
            content,
            "post-category"
        );


    const date =
        getMeta(
            content,
            "post-date"
        );


    if (!title) {
        return;
    }


    const slug =
        file.replace(
            /\.html$/i,
            ""
        );


    posts.push({

        title: title,

        description: description,

        category: category || "SEO",

        date: date,

        url: `/blog/${slug}`

    });


});


/* ==================================================
   SORT NEWEST FIRST
================================================== */

posts.sort(function (a, b) {

    return (
        new Date(b.date) -
        new Date(a.date)
    );

});


/* ==================================================
   CREATE posts-data.json
================================================== */

const jsonPath =
    path.join(
        blogDirectory,
        "posts-data.json"
    );


fs.writeFileSync(

    jsonPath,

    JSON.stringify(
        posts,
        null,
        2
    ),

    "utf8"

);


/* ==================================================
   CREATE NETLIFY REDIRECTS
================================================== */

const redirects = [];


posts.forEach(function (post) {

    const slug =
        post.url.replace(
            "/blog/",
            ""
        );


    redirects.push(
        `/blog/${slug} /blog/${slug}.html 200`
    );

});


/*
   Keep /blog pointing to the actual
   blog index.
*/

redirects.push(
    "/blog /blog/index.html 200"
);


/*
   Keep this file inside /blog/.
*/

const redirectsPath =
    path.join(
        blogDirectory,
        "_redirects"
    );


fs.writeFileSync(

    redirectsPath,

    redirects.join("\n") + "\n",

    "utf8"

);


console.log(
    `Generated posts-data.json with ${posts.length} posts.`
);

console.log(
    `Generated ${redirects.length} Netlify redirects.`
);