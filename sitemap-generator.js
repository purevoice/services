const fs = require("fs");
const path = require("path");

const BASE_URL = "https://chicagoseocompany.netlify.app";

const POSTS_FILE = path.join(
    __dirname,
    "blog",
    "posts-data.json"
);

const SITEMAP_FILE = path.join(
    __dirname,
    "sitemap.xml"
);


/* ==================================================
   LOAD POSTS
================================================== */

if (!fs.existsSync(POSTS_FILE)) {

    throw new Error(
        "Could not find blog/posts-data.json"
    );

}

const posts = JSON.parse(
    fs.readFileSync(
        POSTS_FILE,
        "utf8"
    )
);


if (!Array.isArray(posts)) {

    throw new Error(
        "posts-data.json must contain an array."
    );

}


/* ==================================================
   STATIC URLS
================================================== */

const urls = new Map();


function addUrl(url, lastmod = null) {

    const cleanUrl =
        url.replace(/\/+$/, "");

    urls.set(
        cleanUrl,
        lastmod
    );

}


/* Homepage */

addUrl(
    `${BASE_URL}/`
);


/* Blog */

addUrl(
    `${BASE_URL}/blog`
);


/* ==================================================
   BLOG POSTS
================================================== */

posts.forEach(function (post) {

    if (!post || !post.url) {
        return;
    }

    const postUrl =
        post.url.startsWith("http")
            ? post.url
            : `${BASE_URL}${post.url}`;

    addUrl(
        postUrl,
        post.date || null
    );

});


/* ==================================================
   CATEGORY PAGES
================================================== */

const categories = new Set();


posts.forEach(function (post) {

    if (!post || !post.category_slug) {
        return;
    }

    categories.add(
        post.category_slug
    );

});


categories.forEach(function (categorySlug) {

    addUrl(
        `${BASE_URL}/blog/category/${encodeURIComponent(
            categorySlug
        )}`
    );

});


/* ==================================================
   XML ESCAPING
================================================== */

function escapeXML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}


/* ==================================================
   GENERATE XML
================================================== */

const sitemapUrls =
    Array.from(urls.entries())
        .map(function ([url, lastmod]) {

            let xml = `
    <url>
        <loc>${escapeXML(url)}</loc>`;

            if (lastmod) {

                xml += `
        <lastmod>${escapeXML(
            lastmod
        )}</lastmod>`;

            }

            xml += `
    </url>`;

            return xml;

        })
        .join("");


const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${sitemapUrls}
</urlset>
`;


/* ==================================================
   WRITE SITEMAP
================================================== */

fs.writeFileSync(
    SITEMAP_FILE,
    sitemap,
    "utf8"
);


console.log(
    `Sitemap generated successfully: ${urls.size} URLs`
);