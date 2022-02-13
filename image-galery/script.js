const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search-input');
const submitBtn = document.querySelector('.search-button');

const mainContainer = document.querySelector('.main-container');

let url = "https://api.unsplash.com/search/photos?per_page=21&query=";
const accessKey = "hi2DOS7_wAwioKQo2qAV3njCXReY3j-RNb7HijSfpsk";
const columnsCount = 3;


removeOldContent = (mainContainer) => {
  mainContainer.innerHTML = "";
}

addNewImage = (imgUrl, container) => {
  const imgBlock = document.createElement('div');
  const img = document.createElement('img');
  imgBlock.classList.add('img-item');
  img.src = imgUrl;
  imgBlock.append(img);

  container.append(imgBlock);
}

makeSubArrays = (array, count) => {
  let newArray = [];
  while (array.length > 0) {
    newArray.push(array.splice(0, count));
  }

  // concat the remainder of array split to last subarray
  if (newArray[newArray.length - 1].length < count) {
    newArray[newArray.length - 2] = newArray[newArray.length - 2].concat(newArray[newArray.length - 1]);
    newArray.splice(-1, 1);
  }

  return newArray;
}

pasteApiContent = (data, mainContainer) => {
  const imgUrls = data.results.map((element) => element.urls.regular);
  const imgCount = Math.floor(imgUrls.length / columnsCount);
  const imgColumnUrls = makeSubArrays(imgUrls, imgCount);
  imgColumnUrls.forEach(imgColumnUrl => {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    imgColumnUrl.forEach(imgUrl => addNewImage(imgUrl, imgContainer));
    mainContainer.append(imgContainer);
  });
}

async function getApiContent(e, query) {
  e.preventDefault();
  url = `${url}${query}&client_id=${accessKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data) {
    removeOldContent(mainContainer);
    pasteApiContent(data, mainContainer);
  }
}

searchForm.addEventListener('submit', (e) => {
  let query = searchInput.value.trim().toLowerCase().split(/\s+/).join('+');
  getApiContent(e, query);
});

