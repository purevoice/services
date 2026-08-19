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
                    posts.map(function (post) {

                        return `

                        <article class="blog-post-card">

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

                                ${escapeHTML(
                                    post.description
                                )}

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


                                <p>

                                    ${escapeHTML(
                                        post.description
                                    )}

                                </p>


                                <span class="related-read">

                                    Read more →

                                </span>

                            </a>

                            `;

                        })

                        .join("");

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