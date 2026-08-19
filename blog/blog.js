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
                                    post.category
                                )}

                            </span>


                            <h2 class="blog-post-title">

                                <a
                                    href="${post.url}"
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
                                href="${post.url}"
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
                                href="${post.url}"
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

        const categoriesContainer =
            document.getElementById(
                "categories-container"
            );


        if (categoriesContainer) {


            const categories = {};


            posts.forEach(function (post) {

                if (!post.category) {
                    return;
                }

                categories[post.category] =
                    (categories[post.category] || 0) + 1;

            });


            categoriesContainer.innerHTML =
                Object.entries(categories)

                    .map(function (
                        [category, count]
                    ) {

                        return `

                        <li class="category-item">

                            <a href="#">

                                ${escapeHTML(
                                    category
                                )}

                                <span class="count">

                                    ${count}

                                </span>

                            </a>

                        </li>

                        `;

                    })

                    .join("");

        }


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


            const currentCategory =
                document.querySelector(
                    'meta[name="post-category"]'
                )?.content || "";


            const relatedPosts =
                posts

                    .filter(function (post) {

                        return (
                            post.title !== currentTitle &&
                            post.category === currentCategory
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
                                href="${post.url}"
                                class="related-post-card"
                            >

                                <span class="related-tag">

                                    ${escapeHTML(
                                        post.category
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
   GET EXCERPT FROM FIRST PARAGRAPH
================================================== */

function getPostExcerpt(url) {

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
      Your public URL:

      /blog/post-name

      Your actual file:

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