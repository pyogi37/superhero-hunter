async function fetchHero() {

	// Get the URL query parameters
	const queryParams = new URLSearchParams(window.location.search);

  // Extract the 'heroid' value from the query parameters
	const heroId = queryParams.get('heroid');

	try {

		 // Show loading page
		var loadingMessage = document.createElement("div");
		loadingMessage.classList.add("loading-container");

		loadingMessage.innerHTML = '<img src="./images/loading-img.gif"  class="loading-image">';
		document.body.appendChild(loadingMessage);

		var apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${heroId}?apikey=b3518615117c78a3077efc679d39bf08&hash=386db2ed07fb138010fe8797a873b116&ts=1`;
		const response = await fetch(apiUrl);
		const data = await response.json();

		 // Remove loading page
		document.body.removeChild(loadingMessage);

		localStorage.setItem('hero', JSON.stringify(data.data.results[0]));

		// console.log(data.data.results[0]);
		fillDetailsinDOM();

	} 
	catch (error) {
		console.error("Error:", error);
    	throw error; // Re-throw the error to handle it further up the call stack
    }
}

fetchHero();

function fillDetailsinDOM() {

	const hero = JSON.parse(localStorage.getItem('hero'));

	// Update the inner text of the div element with the hero's name
	const heroNameElement = document.querySelector('.hero-name');
	heroNameElement.textContent = hero.name;

	// Add the icon of the hero 
	var imgElement = document.createElement("img");
	imgElement.classList.add("hero-icon");
	imgElement.src = `${hero.thumbnail.path}/portrait_medium.${hero.thumbnail.extension}`;
	imgElement.alt = "Hero Icon";

	var basicInfo = document.querySelector('.basic-info');
	basicInfo.appendChild(imgElement);


	// Update the inner text of dropdown buttons
	const comicsElement = document.querySelector('.comics');
	comicsElement.textContent = `Comics (${hero.comics.available})`;

	const seriesElement = document.querySelector('.series');
	seriesElement.textContent = `Series (${hero.series.available})`;

	const storiesElement = document.querySelector('.stories');
	storiesElement.textContent = `Stories (${hero.stories.available})`;

	// Create the comics list
	const comicsList = createListItems(hero.comics.items);
	// Append the comics list to the comics section
	comicsElement.appendChild(comicsList);

	// Create the series list
	const seriesList = createListItems(hero.series.items);
	// Append the series list to the series section
	seriesElement.appendChild(seriesList);

	// Create the stories list
	const storiesList = createListItems(hero.stories.items);
	// Append the stories list to the stories section
	storiesElement.appendChild(storiesList);

}


function createListItems(items) {
	const list = document.createElement('ul');
	list.classList.add('dropdown-menu');

	items.forEach((item) => {
		const listItem = document.createElement('li');
		listItem.textContent = item.name;
		list.appendChild(listItem);
	});

	return list;
}