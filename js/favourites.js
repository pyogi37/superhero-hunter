async function fetchHero(heroId) {
	try {
		console.log('inside fetchHero');

		var apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${heroId}?apikey=b3518615117c78a3077efc679d39bf08&hash=386db2ed07fb138010fe8797a873b116&ts=1`;
		const response = await fetch(apiUrl);
		const data = await response.json();
		return data.data.results[0];
	} catch (error) {
		console.error("Error:", error);
    throw error; // Re-throw the error to handle it further up the call stack
}
}



async function fetchFavoriteHeroesComplete() {
	try {
		let favoriteHeroesComplete = [];

    // Retrieve the favoriteHeroes array from localStorage
		const favoriteHeroes = JSON.parse(localStorage.getItem('favoriteHeroes'));
		console.log(favoriteHeroes);

    // Show loading page
		var loadingMessage = document.createElement("div");
		loadingMessage.classList.add("loading-container");

		loadingMessage.innerHTML = '<img src="./images/loading-img.gif" class="loading-image">';
		document.body.appendChild(loadingMessage);

		if(favoriteHeroes == null)
		{ 	
			loadingMessage.innerHTML += "<p>No Favorites added</p>"
			return;
		}

		for (const heroId of favoriteHeroes) {
			const hero = await fetchHero(heroId);
			console.log("hero data", hero);

			if (hero) {
				favoriteHeroesComplete.push(hero);
			}
		}

    // Remove loading page
		document.body.removeChild(loadingMessage);

    // Do something with the favoriteHeroesComplete array
		console.log(favoriteHeroesComplete);

		var favoriteHeroesList = document.querySelector(".favourites-list");

    // Clear the existing search results
		favoriteHeroesList.innerHTML = "";

    // Loop through the results and create list items
		favoriteHeroesComplete.forEach((hero) => {
			var listItem = document.createElement("li");
			listItem.innerHTML += `
			<div class="flex-row single-search-result">
			<div class="flex-row img-info">
			<img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
			<div class="hero-info">
			<a class="character-info" href="./more_info.html?heroid=${hero.id}" data-heroid=${hero.id}>
			<span class="hero-name">${hero.name}</span>
			</a>
			</div>
			</div>
			<button class="fav-btn" data-heroid=${hero.id} id="hero-${hero.id} >
			${
				favoriteHeroes.includes(`${hero.id}`)
				? '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites'
				: '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites'
			}
			</button>
			<div style="display:none;">
			<span>${hero.id}</span>
			</div>
			</div>
			`;

      // Append the list item to the search results list
			favoriteHeroesList.appendChild(listItem);
		});

    // Save the favoriteHeroesComplete array back to localStorage
		localStorage.setItem('favoriteHeroesComplete', JSON.stringify(favoriteHeroesComplete));

		console.log('Favorite heroes complete fetched successfully!');

		addHeroToFav();
		console.log("events added");
	} catch (error) {
		console.error('Error occurred while fetching favorite heroes complete:', error);
	}
}

// Usage:
fetchFavoriteHeroesComplete();


function addHeroToFav() {
	console.log("inside events")
	let favouriteButton = document.querySelectorAll(".fav-btn");
	console.log(favouriteButton);
	favouriteButton.forEach((btn) =>  {
		btn.addEventListener("click",  function(){
			console.log("button clicked");
			console.log(this.dataset.heroid);
			let heroId = this.dataset.heroid;
			// removeHeroFromFav(heroId);

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


					this.innerHTML = "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites";


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


					this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favorites';

					console.log('Hero removed from favorites successfully!');

				}

			} catch (error) {
				console.error('Error occurred while adding hero to favorites:', error);
			}

		})
	})


}

