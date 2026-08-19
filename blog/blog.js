document.addEventListener("DOMContentLoaded", function () {

  const POSTS_JSON = "/posts.json";

  const postList = document.getElementById("postList");
  const recentPosts = document.getElementById("recentPosts");
  const popularPosts = document.getElementById("popularPosts");
  const relatedPosts = document.getElementById("relatedPosts");
  const categoryList = document.getElementById("categoryList");

  let allPosts = [];


  /* =========================================================
     LOAD POSTS
  ========================================================= */

  async function loadPosts() {

    try {

      const response = await fetch(POSTS_JSON, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Could not load posts.json");
      }

      allPosts = await response.json();

      if (!Array.isArray(allPosts)) {
        throw new Error("posts.json must contain an array of posts");
      }

      /*
        Sort newest first.
      */
      allPosts.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });


      /*
        Load the opening paragraph of every post.
      */
      await Promise.all(
        allPosts.map(async function (post) {
          post.excerpt = await getPostExcerpt(post.url);
        })
      );


      /*
        Generate the different sections.
      */
      generatePostList();
      generateRecentPosts();
      generatePopularPosts();
      generateCategories();
      generateRelatedPosts();

    } catch (error) {

      console.error("Blog error:", error);

      if (postList) {
        postList.innerHTML =
          '<p class="blog-error">Unable to load blog posts.</p>';
      }

    }

  }


  /* =========================================================
     GET EXCERPT FROM FIRST PARAGRAPH
  ========================================================= */

  async function getPostExcerpt(url) {

    try {

      const response = await fetch(url);

      if (!response.ok) {
        return "";
      }

      const html = await response.text();

      const parser = new DOMParser();

      const postDocument = parser.parseFromString(
        html,
        "text/html"
      );


      /*
        Find the first paragraph inside .post-body.
      */
      const paragraphs =
        postDocument.querySelectorAll(".post-body p");


      if (!paragraphs.length) {
        return "";
      }


      /*
        Start with the first paragraph.
      */
      let excerpt = paragraphs[0].textContent.trim();


      /*
        If the first paragraph is extremely short,
        add the next paragraph.
      */
      if (
        excerpt.length < 100 &&
        paragraphs.length > 1
      ) {

        const secondParagraph =
          paragraphs[1].textContent.trim();

        excerpt += " " + secondParagraph;

      }


      /*
        Limit excerpt length.
      */
      excerpt = shortenText(excerpt, 190);

      return excerpt;

    } catch (error) {

      console.warn(
        "Could not generate excerpt for:",
        url,
        error
      );

      return "";

    }

  }


  /* =========================================================
     SHORTEN TEXT
  ========================================================= */

  function shortenText(text, maxLength) {

    if (!text) {
      return "";
    }

    if (text.length <= maxLength) {
      return text;
    }

    /*
      Cut at the last complete word rather than
      cutting a word in half.
    */
    let shortened = text.substring(0, maxLength);

    shortened = shortened.substring(
      0,
      shortened.lastIndexOf(" ")
    );

    return shortened.trim() + "...";

  }


  /* =========================================================
     CREATE BLOG POST LIST
  ========================================================= */

  function generatePostList() {

    if (!postList) {
      return;
    }

    if (!allPosts.length) {

      postList.innerHTML =
        '<p class="blog-empty">No blog posts available.</p>';

      return;
    }


    postList.innerHTML = "";


    allPosts.forEach(function (post) {

      const card = document.createElement("article");

      card.className = "blog-card";


      /*
        Category
      */
      const tag = document.createElement("span");

      tag.className = "blog-card-tag";

      tag.textContent =
        post.category || "SEO";


      /*
        Title
        Only the title is clickable.
      */
      const title = document.createElement("h2");

      const titleLink = document.createElement("a");

      titleLink.href = post.url;

      titleLink.textContent =
        post.title || "Untitled Post";

      title.appendChild(titleLink);


      /*
        Date
      */
      const date = document.createElement("span");

      date.className = "blog-card-date";

      date.textContent =
        formatDate(post.date);


      /*
        Excerpt
      */
      const excerpt = document.createElement("p");

      excerpt.className = "blog-card-excerpt";

      excerpt.textContent =
        post.excerpt || "";


      /*
        Read More
        Only the button is clickable.
      */
      const readMore = document.createElement("a");

      readMore.className = "blog-card-read-more";

      readMore.href = post.url;

      readMore.innerHTML =
        'Read more <span aria-hidden="true">→</span>';


      /*
        Assemble card
      */
      card.appendChild(tag);

      card.appendChild(title);

      card.appendChild(date);

      card.appendChild(excerpt);

      card.appendChild(readMore);


      postList.appendChild(card);

    });

  }


  /* =========================================================
     RECENT POSTS
  ========================================================= */

  function generateRecentPosts() {

    if (!recentPosts) {
      return;
    }

    recentPosts.innerHTML = "";


    /*
      First five newest posts.
    */
    const recent =
      allPosts.slice(0, 5);


    recent.forEach(function (post) {

      const item =
        document.createElement("div");

      item.className = "recent-post";


      const link =
        document.createElement("a");

      link.href = post.url;

      link.textContent =
        post.title;


      const date =
        document.createElement("span");

      date.className = "date";

      date.textContent =
        formatDate(post.date);


      item.appendChild(link);

      item.appendChild(date);

      recentPosts.appendChild(item);

    });

  }


  /* =========================================================
     POPULAR POSTS
  ========================================================= */

  function generatePopularPosts() {

    if (!popularPosts) {
      return;
    }

    popularPosts.innerHTML = "";


    /*
      Popularity is determined by the optional
      "views" value in posts.json.

      If no views value exists, it defaults to 0.
    */
    const popular =
      [...allPosts]
        .sort(function (a, b) {

          return (
            Number(b.views || 0) -
            Number(a.views || 0)
          );

        })
        .slice(0, 5);


    popular.forEach(function (post) {

      const item =
        document.createElement("div");

      item.className = "recent-post";


      const link =
        document.createElement("a");

      link.href = post.url;

      link.textContent =
        post.title;


      item.appendChild(link);

      popularPosts.appendChild(item);

    });

  }


  /* =========================================================
     CATEGORIES
  ========================================================= */

  function generateCategories() {

    if (!categoryList) {
      return;
    }

    categoryList.innerHTML = "";


    const categories = {};


    allPosts.forEach(function (post) {

      const category =
        post.category || "SEO";


      if (!categories[category]) {
        categories[category] = 0;
      }

      categories[category]++;

    });


    Object.keys(categories)
      .sort()
      .forEach(function (category) {

        const li =
          document.createElement("li");


        const link =
          document.createElement("a");

        link.href =
          "/blog/?category=" +
          encodeURIComponent(category);


        link.textContent =
          category;


        const count =
          document.createElement("span");

        count.className = "count";

        count.textContent =
          categories[category];


        link.appendChild(count);

        li.appendChild(link);

        categoryList.appendChild(li);

      });

  }


  /* =========================================================
     RELATED POSTS
  ========================================================= */

  function generateRelatedPosts() {

    if (!relatedPosts) {
      return;
    }


    /*
      Determine the current article from the URL.
    */
    const currentUrl =
      window.location.pathname
        .replace(/\/$/, "");


    /*
      Find current post.
    */
    const currentPost =
      allPosts.find(function (post) {

        return normalizeUrl(post.url) ===
          normalizeUrl(currentUrl);

      });


    /*
      If this is not a blog post page,
      use the newest posts instead.
    */
    if (!currentPost) {

      renderRelatedPosts(
        allPosts.slice(0, 4)
      );

      return;

    }


    /*
      Prefer posts from the same category.
    */
    let related =
      allPosts.filter(function (post) {

        return (
          normalizeUrl(post.url) !==
            normalizeUrl(currentPost.url)
          &&
          post.category &&
          currentPost.category &&
          post.category.toLowerCase() ===
            currentPost.category.toLowerCase()
        );

      });


    /*
      If there aren't enough posts in the
      same category, add other posts.
    */
    if (related.length < 4) {

      const additional =
        allPosts.filter(function (post) {

          return (
            normalizeUrl(post.url) !==
              normalizeUrl(currentPost.url)
            &&
            !related.includes(post)
          );

        });


      related =
        related.concat(additional);

    }


    /*
      Limit to four related posts.
    */
    related =
      related.slice(0, 4);


    renderRelatedPosts(related);

  }


  /* =========================================================
     RENDER RELATED POSTS
  ========================================================= */

  function renderRelatedPosts(posts) {

    relatedPosts.innerHTML = "";


    posts.forEach(function (post) {

      const card =
        document.createElement("a");

      card.className = "related-card";

      card.href = post.url;


      const tag =
        document.createElement("span");

      tag.className = "related-tag";

      tag.textContent =
        post.category || "SEO";


      const title =
        document.createElement("h4");

      title.textContent =
        post.title;


      const excerpt =
        document.createElement("p");

      excerpt.textContent =
        post.excerpt || "";


      const readMore =
        document.createElement("span");

      readMore.className =
        "related-link";

      readMore.innerHTML =
        'Read more <span aria-hidden="true">→</span>';


      card.appendChild(tag);

      card.appendChild(title);

      card.appendChild(excerpt);

      card.appendChild(readMore);


      relatedPosts.appendChild(card);

    });

  }


  /* =========================================================
     DATE FORMAT
  ========================================================= */

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


  /* =========================================================
     NORMALIZE URL
  ========================================================= */

  function normalizeUrl(url) {

    if (!url) {
      return "";
    }

    return url
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/\.html$/i, "")
      .replace(/\/$/, "");

  }


  /* =========================================================
     START BLOG
  ========================================================= */

  loadPosts();

});