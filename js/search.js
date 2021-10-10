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
