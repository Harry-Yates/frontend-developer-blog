const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");

// Git Hub Profile Set-Up

getUser("harry-yates");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard("No profile with this username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
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
      <h2>Front End Developer Blog</h2>
      <p>I post about CSS, JS, React and answer interview questions. Feel free to reach out and connect via the links below! 🤓<p>
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
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

//Posts and cards

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
  wrapper.innerHTML += `<li class="card-wrapper__card" data-aos="fade-up" ><a href="../pages/post.html?id=${card.id}">
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
    previewImage: post._embedded["wp:featuredmedia"][0].source_url,
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

function getPosts() {
  fetch("https://harry.josefcarlsson.com/wp-json/wp/v2/posts?_embed")
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        let formatedPosts = formatPost(data[i]);
        createPreviewCard(formatedPosts);
      }
    });
}

function getPostFromId() {
  var id = JSON.parse(findQuery("id"));

  fetch("https://harry.josefcarlsson.com/wp-json/wp/v2/posts?_embed")
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

function postComment() {
  var id = JSON.parse(findQuery("id"));
  console.log(JSON.stringify({ post: id, author_name: "Harry", author_email: "hyates1@gmail.com", content: "hello" }));
  fetch(`https://harry.josefcarlsson.com/wp-json/wp/v2/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post: id, author_name: "Harry", author_email: "hyates1@gmail.com", content: "juuu" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

function getComment() {
  var id = JSON.parse(findQuery("id"));
  console.log(JSON.stringify({ post: id, author_name: "Harry", author_email: "hyates1@gmail.com", content: "hello" }));
  fetch(`https://harry.josefcarlsson.com/wp-json/wp/v2/comments?post=${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("test data", data);
      for (let i = 0; i < data.length; i++) {
        postCommentCard(data[i]);
      }
    });
}

getComment();

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

// function getDrink() {
//   fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
//     .then((response) => response.json())
//     .then((data) => {
//       var drink = data.drinks[0];
//       var maxNumberOfIngredient = 15;
//       var post = {
//         title: drink.strDrink,
//         content: ["<img src=" + drink.strDrinkThumb + " />", "<p>" + drink.strInstructions + "</p>", "<h3>Ingredients</h3>"],
//       };

//       for (let i = 0; i < maxNumberOfIngredient; i++) {
//         if (i === 0) {
//           post.content.push("<ul>");
//         }

//         if (drink[`strIngredient${i}`]) {
//           post.content.push("<li>" + drink[`strIngredient${i}`] + " : " + drink[`strMeasure${i}`] + "</li>");
//         }
//         if (i === maxNumberOfIngredient - 1) {
//           post.content.push("</ul>");
//         }
//       }

//       document.getElementById("postContent").innerHTML = "";
//       populatePost(post);
//     });
// }
