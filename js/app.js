 function searchHeroes() {
  var inputText = document.getElementById("search-bar").value;

      // Make an API request using the input text
      // Replace the placeholder URL with your actual API endpoint
  console.log(inputText);

  if(inputText.length == 0){
    searchResultsList.innerHTML = "";
    return;
  }

  var apiUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${inputText}&apikey=b3518615117c78a3077efc679d39bf08&hash=386db2ed07fb138010fe8797a873b116&ts=1`;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
          // Process the API response data
    console.log(data.data.results);

    let favoriteHeroes = localStorage.getItem("favoriteHeroes");
    if(favoriteHeroes == null){
          // If we did't got the favoriteHeroes then we iniitalize it with empty map
     favoriteHeroes = [];
   }
   else if(favoriteHeroes != null){
          // If the we got the favoriteHeroes in localStorage then parsing it and converting it to map
    favoriteHeroes = JSON.parse(favoriteHeroes);
  }

  var searchResultsList = document.querySelector(".search-results-list");

          // Clear the existing search results
  searchResultsList.innerHTML = "";

          // Loop through the results and create list items
  data.data.results.forEach(hero => {
    var listItem = document.createElement("li");
    listItem.innerHTML += 
    `
    <div class="flex-row single-search-result">
    <div class="flex-row img-info">
    <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
    <div class="hero-info">
    <a class="character-info" href="./more_info.html?heroid=${hero.id}" data-heroid=${hero.id}>
    <span class="hero-name">${hero.name}</span>
    </a>
    </div>
    </div>
    <button class="fav-btn" data-heroid=${hero.id} id="hero-${hero.id}" > ${favoriteHeroes.includes(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}

    <div style="display:none;">
    <span>${hero.id}</span>
    </div>
    </div>
    `

            // Append the list item to the search results list
    searchResultsList.appendChild(listItem);


  })

     // Adding the appropritate events to the buttons after they are inserted in dom
  events();
  console.log("events added");

})
  .catch(error => {
          // Handle any errors
    console.error("Error:", error);
  });
}


// Function for attacthing eventListener to buttons
function events() {
  console.log("inside events")
  let favouriteButton = document.querySelectorAll(".fav-btn");
  favouriteButton.forEach((btn) =>  {
    btn.addEventListener("click",  function(){console.log("button clicked");
      console.log(this.dataset.heroid);
      let heroId = this.dataset.heroid;
      addHeroToFav(heroId);
    })
  })

  let characterInfo = document.querySelectorAll(".character-info");
  characterInfo.forEach((character) => {
    character.addEventListener("click",  function(){console.log("button clicked");
      console.log(this.dataset.heroid);
    })
  })
}

function addHeroToFav(heroId) {
  try {
    console.log("inside addHeroToFav")
    let favoriteHeroes = JSON.parse(localStorage.getItem('favoriteHeroes'));
    if (!favoriteHeroes) {
      // If it doesn't exist, create an empty array and save it in localStorage
      favoriteHeroes = [];
    }

    // if the heroId isn't in the array then add it to favouriteHeroes array
    if (!favoriteHeroes.includes(heroId)) {

    // Add the hero ID to the favoriteHeroes array
      favoriteHeroes.push(heroId);

    // Save the updated favoriteHeroes array back to localStorage
      localStorage.setItem('favoriteHeroes', JSON.stringify(favoriteHeroes));


      var favBtn = document.getElementById(`hero-${heroId}`);
      favBtn.innerHTML = "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites";


      console.log('Hero added to favorites successfully!');
    } 
    // 
    else{
      // if the heroId is in the array then remove it from favouriteHeroes array
      if (!favoriteHeroes || favoriteHeroes.length === 0) {
    // Handle the case when the favoriteHeroes array is null or empty
        console.log('No heroes in favorites to remove');
        return;
      }

  // Remove the heroId from the favoriteHeroes array
      const index = favoriteHeroes.indexOf(heroId);
      if (index > -1) {
        favoriteHeroes.splice(index, 1);
      }

  // Save the updated favoriteHeroes array back to localStorage
      localStorage.setItem('favoriteHeroes', JSON.stringify(favoriteHeroes));

      var favBtn = document.getElementById(`hero-${heroId}`);

      favBtn.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favorites';

      console.log('Hero removed from favorites successfully!');

    }

  } catch (error) {
    console.error('Error occurred while adding hero to favorites:', error);
  }
}
