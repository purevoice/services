document.addEventListener("DOMContentLoaded", function () {


/* ==================================================
   MOBILE NAVIGATION
================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const mobileNav =
    document.getElementById("mobileNav");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const closeMenu =
    document.getElementById("closeMenu");


function openMenu() {

    if (mobileNav) {
        mobileNav.classList.add("active");
    }

    if (mobileOverlay) {
        mobileOverlay.classList.add("active");
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    document.body.classList.add("menu-open");
}


function closeMobileMenu() {

    if (mobileNav) {
        mobileNav.classList.remove("active");
    }

    if (mobileOverlay) {
        mobileOverlay.classList.remove("active");
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    document.body.classList.remove("menu-open");
}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function () {

            if (
                mobileNav &&
                mobileNav.classList.contains("active")
            ) {

                closeMobileMenu();

            } else {

                openMenu();

            }

        }
    );

}


if (closeMenu) {

    closeMenu.addEventListener(
        "click",
        closeMobileMenu
    );

}


if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


if (mobileNav) {

    mobileNav
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });

}


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            mobileNav &&
            mobileNav.classList.contains("active")
        ) {

            closeMobileMenu();

        }

    }
);


/* ==================================================
   CATEGORY INFORMATION
================================================== */

const categoryData = {

    "seo-fundamentals": {

        name: "SEO Fundamentals",

        slug: "seo-fundamentals",

        description:
            "Understand how search engine optimization works, from crawling and indexing to rankings, relevance, and organic search visibility. These guides establish the core concepts businesses need before tackling more specialized SEO strategies."

    },


    "local-seo": {

        name: "Local SEO",

        slug: "local-seo",

        description:
            "Learn how businesses can improve visibility in local search, Google Maps, and location-based results. Explore the ranking signals, location pages, neighborhood relevance, and Google Business Profile factors that influence how local customers find a business."

    },


    "technical-seo": {

        name: "Technical SEO",

        slug: "technical-seo",

        description:
            "Improve the technical foundation that allows search engines to crawl, interpret, and index a website efficiently. These guides cover website architecture, technical issues, audits, internal linking, and the structural factors that support stronger organic visibility."

    },


    "keyword-research-search-intent": {

        name: "Keyword Research & Search Intent",

        slug: "keyword-research-search-intent",

        description:
            "Learn how to identify valuable search terms, understand what users expect from the results, and connect keywords with the right pages. Effective keyword research and search-intent analysis help prevent irrelevant targeting, overlapping pages, and missed search opportunities."

    },


    "seo-content-strategy": {

        name: "SEO Content Strategy",

        slug: "seo-content-strategy",

        description:
            "Build content around the questions, problems, and search intent that matter to your audience. These guides cover content planning, optimization, topical relevance, and practical ways to improve existing pages so they serve users and perform better in organic search."

    },


    "link-building": {

        name: "Link Building",

        slug: "link-building",

        description:
            "Explore how relevant backlinks contribute to website authority and search visibility, and how businesses can earn links that make sense for their industry and audience. Learn to evaluate link quality, develop local link opportunities, and build authority without relying on low-value tactics."

    },


    "seo-services-pricing": {

        name: "SEO Services & Pricing",

        slug: "seo-services-pricing",

        description:
            "Understand the commercial side of SEO, including what SEO services involve, what affects pricing, and how to assess an agency before committing to a campaign. These resources help businesses compare providers based on strategy, expertise, scope, and expected outcomes."

    }

};


/* ==================================================
   CATEGORY HELPERS
================================================== */

/*
  Find the fixed category definition using
  the category name stored in the post data.
*/

function getCategoryByName(categoryName) {

    if (!categoryName) {
        return null;
    }


    const normalizedName =
        String(categoryName)
            .trim()
            .toLowerCase();


    const category =
        Object.values(categoryData)
            .find(function (item) {

                return (
                    item.name
                        .trim()
                        .toLowerCase() ===
                    normalizedName
                );

            });


    return category || null;

}


/*
  Get the category slug for a post.

  The generated post data may contain a slug,
  but the system does not depend on it.

  If the slug exists and matches a known
  category, use it.

  Otherwise resolve the slug from the
  category name.
*/

function getPostCategorySlug(post) {

    if (!post) {
        return "";
    }


    if (
        post.category_slug &&
        categoryData[
            String(post.category_slug).trim()
        ]
    ) {

        return String(
            post.category_slug
        ).trim();

    }


    const category =
        getCategoryByName(
            post.category
        );


    if (category) {
        return category.slug;
    }


    return "";

}


/*
  Get the category name from the post.
*/

function getPostCategoryName(post) {

    if (!post) {
        return "";
    }


    if (post.category) {

        return String(
            post.category
        ).trim();

    }


    const slug =
        getPostCategorySlug(post);


    if (
        slug &&
        categoryData[slug]
    ) {

        return categoryData[slug].name;

    }


    return "";

}


/* ==================================================
   LOAD POSTS DATA
================================================== */

fetch("/blog/posts-data.json")

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "posts-data.json could not be loaded."
            );

        }

        return response.json();

    })

    .then(function (posts) {


        /*
          Make sure posts is an array.
        */

        if (!Array.isArray(posts)) {

            throw new Error(
                "posts-data.json must contain an array of posts."
            );

        }


        /* ==========================================
           CATEGORY PAGE
        ========================================== */

        renderCategoryPage(posts);


        /* ==========================================
           BLOG POST LIST
        ========================================== */

        const blogPostList =
            document.getElementById(
                "blog-post-list"
            );


        if (blogPostList) {


            if (!posts.length) {

                blogPostList.innerHTML = `
                    <p class="no-posts">
                        No posts published yet.
                    </p>
                `;

            } else {


                blogPostList.innerHTML =
                    posts.map(function (post, index) {

                        return `

                        <article
                            class="blog-post-card"
                            data-post-index="${index}"
                        >

                            <span class="blog-post-tag">

                                ${escapeHTML(
                                    getPostCategoryName(post)
                                )}

                            </span>


                            <h2 class="blog-post-title">

                                <a
                                    href="${escapeHTML(
                                        post.url
                                    )}"
                                >

                                    ${escapeHTML(
                                        post.title
                                    )}

                                </a>

                            </h2>


                            <span class="blog-post-date">

                                ${formatDate(
                                    post.date
                                )}

                            </span>


                            <p class="blog-post-description">

                                Loading...

                            </p>


                            <a
                                href="${escapeHTML(
                                    post.url
                                )}"
                                class="blog-post-read-more"
                            >

                                Read more

                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >

                                    <path d="M5 12h14"/>

                                    <path d="m13 6 6 6-6 6"/>

                                </svg>

                            </a>

                        </article>

                        `;

                    }).join("");


                /*
                  Get the first paragraph from each
                  actual blog post and use it as
                  the blog-list excerpt.
                */

                posts.forEach(function (post, index) {

                    getPostExcerpt(post.url)

                        .then(function (excerpt) {

                            const card =
                                blogPostList.querySelector(
                                    `[data-post-index="${index}"]`
                                );


                            if (!card) {
                                return;
                            }


                            const description =
                                card.querySelector(
                                    ".blog-post-description"
                                );


                            if (!description) {
                                return;
                            }


                            description.textContent =
                                excerpt;

                        });

                });

            }

        }


        /* ==========================================
           RECENT POSTS
        ========================================== */

        const recentContainer =
            document.getElementById(
                "recent-posts-container"
            );


        if (recentContainer) {


            const recentPosts =
                posts.slice(0, 5);


            if (!recentPosts.length) {

                recentContainer.innerHTML =
                    "<p>No recent posts.</p>";

            } else {

                recentContainer.innerHTML =
                    recentPosts.map(function (post) {

                        return `

                        <div class="recent-post">

                            <a
                                href="${escapeHTML(
                                    post.url
                                )}"
                            >

                                ${escapeHTML(
                                    post.title
                                )}

                            </a>


                            <span class="date">

                                ${formatDate(
                                    post.date
                                )}

                            </span>

                        </div>

                        `;

                    }).join("");

            }

        }


        /* ==========================================
           CATEGORIES
        ========================================== */

        renderCategories(posts);


        /* ==========================================
           RELATED POSTS
        ========================================== */

        const relatedContainer =
            document.getElementById(
                "related-posts-container"
            );


        if (relatedContainer) {


            const currentTitle =
                document.querySelector(
                    'meta[name="post-title"]'
                )?.content || "";


            const currentCategorySlug =
                document.querySelector(
                    'meta[name="post-category-slug"]'
                )?.content || "";


            const currentCategoryName =
                document.querySelector(
                    'meta[name="post-category"]'
                )?.content || "";


            const relatedPosts =
                posts

                    .filter(function (post) {

                        if (
                            post.title ===
                            currentTitle
                        ) {

                            return false;

                        }


                        /*
                          Prefer the category slug
                          when available.

                          Otherwise match using
                          the category name.
                        */

                        const postSlug =
                            getPostCategorySlug(
                                post
                            );


                        if (
                            currentCategorySlug &&
                            postSlug
                        ) {

                            return (
                                postSlug ===
                                currentCategorySlug
                            );

                        }


                        return (
                            getPostCategoryName(
                                post
                            )
                                .toLowerCase() ===
                            currentCategoryName
                                .trim()
                                .toLowerCase()
                        );

                    })

                    .slice(0, 4);


            if (!relatedPosts.length) {

                relatedContainer.innerHTML =
                    "<p>No related posts yet.</p>";

            } else {


                relatedContainer.innerHTML =
                    relatedPosts

                        .map(function (post) {

                            return `

                            <a
                                href="${escapeHTML(
                                    post.url
                                )}"
                                class="related-post-card"
                            >

                                <span class="related-tag">

                                    ${escapeHTML(
                                        getPostCategoryName(post)
                                    )}

                                </span>


                                <h4>

                                    ${escapeHTML(
                                        post.title
                                    )}

                                </h4>


                                <p class="related-post-description">

                                    Loading...

                                </p>


                                <span class="related-read">

                                    Read more →

                                </span>

                            </a>

                            `;

                        })

                        .join("");


                /*
                  Load the first paragraph for
                  related-post descriptions too.
                */

                relatedPosts.forEach(function (post, index) {

                    getPostExcerpt(post.url)

                        .then(function (excerpt) {

                            const relatedCard =
                                relatedContainer
                                    .querySelectorAll(
                                        ".related-post-card"
                                    )[index];


                            if (!relatedCard) {
                                return;
                            }


                            const description =
                                relatedCard.querySelector(
                                    ".related-post-description"
                                );


                            if (!description) {
                                return;
                            }


                            description.textContent =
                                excerpt;

                        });

                });

            }

        }


    })

    .catch(function (error) {

        console.error(
            "Blog system error:",
            error
        );

    });


/* ==================================================
   RENDER SIDEBAR CATEGORIES
================================================== */

function renderCategories(posts) {

    const categoriesContainer =
        document.getElementById(
            "categories-container"
        );


    if (!categoriesContainer) {
        return;
    }


    /*
      Start every defined category at zero.

      This guarantees that all seven categories
      have a stable URL and can appear in the
      sidebar even before they have posts.
    */

    const categoryCounts = {};


    Object.keys(categoryData)
        .forEach(function (slug) {

            categoryCounts[slug] = 0;

        });


    /*
      Count posts by their category NAME.

      This is the important fix.

      The generated post data does not need
      category_slug because the fixed
      categoryData already knows the slug.
    */

    posts.forEach(function (post) {

        const category =
            getCategoryByName(
                post.category
            );


        if (!category) {
            return;
        }


        categoryCounts[
            category.slug
        ]++;

    });


    categoriesContainer.innerHTML =
        Object.values(categoryData)

            .map(function (category) {

                return `

                <li class="category-item">

                    <a
                        href="/blog/category/${escapeHTML(
                            category.slug
                        )}"
                    >

                        <span class="category-name">

                            ${escapeHTML(
                                category.name
                            )}

                        </span>

                        <span class="count">

                            ${categoryCounts[
                                category.slug
                            ]}

                        </span>

                    </a>

                </li>

                `;

            })

            .join("");

}


/* ==================================================
   RENDER CATEGORY PAGE
================================================== */

function renderCategoryPage(posts) {

    const categoryContainer =
        document.getElementById(
            "category-page-content"
        );


    /*
      If this is not a category page,
      stop here.
    */

    if (!categoryContainer) {
        return;
    }


    const path =
        window.location.pathname
            .replace(/\/+$/, "");


    const categoryPrefix =
        "/blog/category/";


    /*
      Only run on:

      /blog/category/category-slug
    */

    if (
        path.indexOf(categoryPrefix) !== 0
    ) {

        return;

    }


    const categorySlug =
        decodeURIComponent(
            path.substring(
                categoryPrefix.length
            )
        );


    /*
      Look up the category using the
      fixed categoryData object.
    */

    const category =
        categoryData[categorySlug];


    if (!category) {

        categoryContainer.innerHTML = `

            <section class="category-page">

                <header class="category-header">

                    <span class="category-label">
                        Blog Category
                    </span>

                    <h1>
                        Category Not Found
                    </h1>

                    <p class="category-description">

                        The requested blog category could not be found.

                    </p>

                </header>

            </section>

        `;

        return;

    }


    /*
      IMPORTANT FIX

      Match published posts using their
      category NAME.

      This means:

      post.category
      "SEO Fundamentals"

      matches:

      category.name
      "SEO Fundamentals"

      The generated JSON does not need
      category_slug for this to work.
    */

    const categoryPosts =
        posts.filter(function (post) {

            return (
                getPostCategoryName(post)
                    .trim()
                    .toLowerCase() ===
                category.name
                    .trim()
                    .toLowerCase()
            );

        });


    /*
      Render category page.
    */

    categoryContainer.innerHTML = `

        <section class="category-page">

            <header class="category-header">

                <span class="category-label">
                    Blog Category
                </span>

                <h1>

                    ${escapeHTML(
                        category.name
                    )}

                </h1>

                <p class="category-description">

                    ${escapeHTML(
                        category.description
                    )}

                </p>

                <span class="category-post-count">

                    ${categoryPosts.length}

                    ${
                        categoryPosts.length === 1
                            ? "article"
                            : "articles"
                    }

                </span>

            </header>


            <div class="category-post-list">

                ${
                    categoryPosts.length
                        ? categoryPosts
                            .map(function (post, index) {

                                return `

                                <article
                                    class="blog-post-card"
                                    data-category-post-index="${index}"
                                >

                                    <span class="blog-post-tag">

                                        ${escapeHTML(
                                            getPostCategoryName(post)
                                        )}

                                    </span>


                                    <h2 class="blog-post-title">

                                        <a
                                            href="${escapeHTML(
                                                post.url
                                            )}"
                                        >

                                            ${escapeHTML(
                                                post.title
                                            )}

                                        </a>

                                    </h2>


                                    <span class="blog-post-date">

                                        ${formatDate(
                                            post.date
                                        )}

                                    </span>


                                    <p class="blog-post-description">

                                        Loading...

                                    </p>


                                    <a
                                        href="${escapeHTML(
                                            post.url
                                        )}"
                                        class="blog-post-read-more"
                                    >

                                        Read more

                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            aria-hidden="true"
                                        >

                                            <path d="M5 12h14"/>

                                            <path d="m13 6 6 6-6 6"/>

                                        </svg>

                                    </a>

                                </article>

                                `;

                            })
                            .join("")
                        : `

                            <p class="no-posts">

                                No posts have been published
                                in this category yet.

                            </p>

                        `
                }

            </div>

        </section>

    `;


    /*
      Load first paragraph excerpts for
      category-page posts.
    */

    categoryPosts.forEach(function (post, index) {

        getPostExcerpt(post.url)

            .then(function (excerpt) {

                const card =
                    categoryContainer.querySelector(
                        `[data-category-post-index="${index}"]`
                    );


                if (!card) {
                    return;
                }


                const description =
                    card.querySelector(
                        ".blog-post-description"
                    );


                if (!description) {
                    return;
                }


                description.textContent =
                    excerpt;

            });

    });

}


/* ==================================================
   GET EXCERPT FROM FIRST PARAGRAPH
================================================== */

function getPostExcerpt(url) {

    if (!url) {
        return Promise.resolve("");
    }


    return fetch(
        getHTMLPostURL(url)
    )

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Could not load blog post."
                );

            }

            return response.text();

        })

        .then(function (html) {

            const parser =
                new DOMParser();


            const document =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            /*
              Only select the first paragraph
              inside .post-body.
            */

            const firstParagraph =
                document.querySelector(
                    ".post-body p"
                );


            if (!firstParagraph) {
                return "";
            }


            let excerpt =
                firstParagraph.textContent
                    .replace(/\s+/g, " ")
                    .trim();


            /*
              Limit the excerpt to 180 characters.
            */

            if (excerpt.length > 180) {

                excerpt =
                    excerpt.substring(
                        0,
                        180
                    );


                /*
                  Don't cut a word in half.
                */

                const lastSpace =
                    excerpt.lastIndexOf(" ");


                if (lastSpace > 0) {

                    excerpt =
                        excerpt.substring(
                            0,
                            lastSpace
                        );

                }


                excerpt += "...";

            }


            return excerpt;

        })

        .catch(function (error) {

            console.error(
                "Excerpt error:",
                error
            );

            return "";

        });

}


/* ==================================================
   GET ACTUAL HTML POST FILE
================================================== */

function getHTMLPostURL(url) {

    if (!url) {
        return "";
    }


    /*
      Public URL:

      /blog/post-name

      Actual file:

      /blog/post-name.html
    */

    if (url.endsWith(".html")) {
        return url;
    }


    return url.replace(/\/$/, "") + ".html";

}


/* ==================================================
   HELPERS
================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


function escapeHTML(value) {

    if (!value) {
        return "";
    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

});