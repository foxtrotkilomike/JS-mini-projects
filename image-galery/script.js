const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#search-input");
const submitBtn = document.querySelector(".search-button");

let url = "https://api.unsplash.com/search/photos?query=";
const accessKey = "hi2DOS7_wAwioKQo2qAV3njCXReY3j-RNb7HijSfpsk";

searchForm.addEventListener("submit", (e) => {
  let query = searchInput.value.trim().toLowerCase().split(/\s+/).join('+');
  sendQuery(e, query);
});

async function sendQuery(e, query) {
  e.preventDefault();
  console.log(query);
  url = `${url}${query}&client_id=${accessKey}`;
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}