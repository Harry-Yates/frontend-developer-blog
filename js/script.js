const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
let posts = [];
// Git Hub User and Profile Functions

getUser("harry-yates");
async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response === 404) {
      createErrorCard("No profile with this username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching my repo");
  }
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 4).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar gradient-border">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      <h2>Frontend Developer Blog</h2>
      <p>I post about CSS, JS, React and answer interview questions. Feel free to reach out and connect via the links below! 🤓<p>
      <ul class="repoStatsMain">
        <li class="repoStats">${user.followers} <strong>Followers</strong></li>
        <li class="repoStats">${user.following} <strong>Following</strong></li>
        <li class="repoStats">${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
       <div class="social-media-icons">
            <a href="https://github.com/Harry-Yates"><i style="padding-left:10px;" class="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/harryjtyates/"><i style="padding-left:10px;" class="fab fa-linkedin"></i></a>
            <a href="https://twitter.com/HA9RY"><i style="padding-left:10px;" class="fab fa-twitter" ></i></a>
            <a href="mailto:hyates1@gmail.com"><i style="padding-left:10px;" class="fas fa-envelope-square"></i></a>
          </div>
    </div>
  </div>
    `;
  main.innerHTML = cardHTML;
}

//Post Page Functions

function toggleState() {
  document.querySelector(".toggle-me").classList.toggle("active");
}

function populatePost(post) {
  document.getElementById("postTitle").innerHTML = post.title.rendered;
  document.getElementById("postDate").innerHTML = post.date;
  document.getElementById("postAuthor").innerHTML = post.author;

  var content = post.content;
  console.log(post.content);

  document.getElementById("postContent").innerHTML = content.rendered;
}

function findQuery(param) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function createPreviewCard(card) {
  var wrapper = document.getElementById("postsSummaries");
  wrapper.innerHTML += `<li class="card-wrapper__card fade-in" data-aos="fade-up" ><a href="../pages/post.html?id=${card.id}">
        <img src="${card.previewImage}" alt="A random image" />
        <div class="card-wrapper__content" >
        <div class="post-date">${card.date}</div>
         <h3>${card.title}</h3>
         <p>${card.shortSummary}</p>
         <button href="../pages/post.html">Read More</button>
        </div>
        </a>
       </li>`;
}

function formatPost(post) {
  let formated = {
    id: post.id,
    title: post.title.rendered,
    date: formatDate(post.date),
    previewImage: post._embedded[`wp:featuredmedia`][0].source_url,
    shortSummary: post.excerpt.rendered,
    content: post.content.rendered,
  };

  return formated;
}

function formatDate(date) {
  var d = new Date(date);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return d.getDate() + " " + monthNames[d.getMonth()];
}

// Pagination Functions

var filterCategories = (filter) => {
  document.getElementById("postsSummaries").innerHTML = "";
  for (let i = 0; i < posts.length; i++) {
    if (filter == "1") {
      let formatedPosts = formatPost(posts[i]);
      createPreviewCard(formatedPosts);
    } else if (posts[i].categories[0] == filter || posts[i].categories[1] == filter || posts[i].categories[2] == filter) {
      let formatedPosts = formatPost(posts[i]);
      createPreviewCard(formatedPosts);
    }
  }
};

async function getCategories() {
  const response = await fetch("https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/categories");
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  return data;
}

function createCategoryButtons(data) {
  let container = document.querySelector(".categoriesHolder");
  container.innerHTML += `<button onclick="filterCategories('${data.id}')" class="category-btn">${data.name}</button>`;
}

async function getPosts() {
  var page = JSON.parse(findQuery("page"));

  page = page ? page : 1;

  await fetch(`https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/posts?_embed&per_page=4&page=${page}`)
    .then((response) => {
      createPaginationList(response.headers.get("x-wp-totalpages"), page);
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let formatedPosts = formatPost(data[i]);
        createPreviewCard(formatedPosts);
      }
    });
}

async function getAllPosts() {
  var page = JSON.parse(findQuery("page"));

  page = page ? page : 1;

  await fetch(`https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/posts?_embed`)
    .then((response) => {
      createPaginationList(response.headers.get("x-wp-totalpages"), page);
      return response.json();
    })
    .then((data) => {
      posts = data;
      for (let i = 0; i < data.length; i++) {
        let formatedPosts = formatPost(data[i]);
        createPreviewCard(formatedPosts);
      }
    })
    .then(() => {
      getCategories().then((data) => {
        for (i = 0; i < data.length; i++) {
          console.log(data[i]);
          createCategoryButtons(data[i]);
        }
      });
    });
}

function createPaginationList(numberOfPages, currentPage) {
  for (let i = 0; i < JSON.parse(numberOfPages); i++) {
    if (i == 0) {
      document.getElementById("paginationList").innerHTML += `
    <a href="/?page=${currentPage - 1 == 0 ? "1" : currentPage - 1}" >&laquo</a>`;
    }

    document.getElementById("paginationList").innerHTML += `
    <a class="${i + 1 == currentPage ? "active" : ""}" href="/?page=${i + 1}" >${i + 1}</a>`;

    if (i == JSON.parse(numberOfPages) - 1) {
      document.getElementById("paginationList").innerHTML += `
      <a href="/?page=${currentPage == JSON.parse(numberOfPages) ? currentPage : currentPage + 1}" >&raquo</a>`;
    }
  }
}

async function getPostFromId() {
  addSubmitListener();
  var id = JSON.parse(findQuery("id"));
  await fetch("https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/posts?_embed")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          populatePost(data[i]);
          console.log(data[i]);
        }
      }
    });
}

// Wordpress Comment Functions

async function postComment(event) {
  event.preventDefault();
  console.log("here" + event);
  var id = JSON.parse(findQuery("id"));
  var email = document.getElementById("commentEmail").value;
  var name = document.getElementById("commentName").value;
  var subject = document.getElementById("subject").value;

  await fetch(`https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: id, author_name: name, author_email: email, content: subject }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("postCommentsForm").classList.add("formSent");
      document.getElementById("sentComment").classList.toggle("refreshShow");
    });
}

async function getComment() {
  var id = JSON.parse(findQuery("id"));
  await fetch(`https://shielded-ridge-56527.herokuapp.com/https://harry.josefcarlsson.com/wp-json/wp/v2/comments?post=${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("test data", data);
      for (let i = 0; i < data.length; i++) {
        postCommentCard(data[i]);
      }
    });
}

function addSubmitListener() {
  document.getElementById("submitComment").addEventListener("submit", postComment);
}

function postCommentCard(card) {
  console.log(card);
  var wrapper = document.getElementById("postComments");
  wrapper.innerHTML += `
  <div class="cardContainer">
  <div class="detailz">
  <div class="img">
  <img src="/assets/images/avatar.png" alt="avatarimage" class="avatar2">
  </div>
  <div class="details">
  <div class="cardAuthor">${card.author_name}</div>
  <div class="cardDate">${formatDate(card.date)}</div>
  </div>
  </div>
  <div class="cardP">${card.content.rendered}</div>
  </div>`;
}
