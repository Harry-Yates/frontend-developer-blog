function searchPosts() {
  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    let searchQuery = event.target.value.toLowerCase();
    let allPostsDOMCollection = document.getElementsByClassName("card-wrapper__card");

    for (let i = 0; i < allPostsDOMCollection.length; i++) {
      const currentName = allPostsDOMCollection[i].textContent.toLowerCase();

      if (currentName.includes(searchQuery)) {
        allPostsDOMCollection[i].style.display = "block";
      } else {
        allPostsDOMCollection[i].style.display = "none";
      }
    }
  });
}
searchPosts();

async function getCategories() {
  const response = await fetch("http://harry.josefcarlsson.com/wp-json/wp/v2/categories");
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  return data;
}

console.log(getCategories());
