let tabCountries = null;
let tabFavorites = null;

let allCountries  = [];
let favoritesCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites  = 0

let numberFormat = null;

window.addEventListener('load', () => {
	tabCountries   = document.querySelector('#tabCountries');
	tabFavorites   = document.querySelector('#tabFavorites');
	countCountries = document.querySelector('#countCountries');
	countFavorites = document.querySelector('#countFavorites');

	totalPopulationList = document.querySelector('#totalPopulationList');
	totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');
	numberFormat = Intl.NumberFormat('pt-BR');

	fetchCountres();
});

async function fetchCountres() {
	const res = await fetch('https://restcountries.eu/rest/v2/all');
    const dataJson  = await res.json();
	allCountries = dataJson.map(country => {

		const { numericCode, translations, population , flag } = country; 

        return {
                 id: numericCode,
                 name: translations.pt,
                 population,
                 formattedPopulation: formatNumber(population),
                 flag
        };
	});

	render();
}

function render() {
	// console.log("rendering...");
	renderCountryList();
	renderFavorites()
	renderSumary();
	handleCountryButtons();
}

function renderCountryList() {
    let countriesHTML = '<div >';
  
    allCountries.forEach(country => {
       const { name, flag, id, population, formattedPopulation } = country;


       const countryHTML = `
           <div class="country">
              <div>
                  <a id="${id}" class="waves-effect waves-light btn"> + </a>
              </div>
              <div>
                  <img src="${flag}" alt="${name}">
              </div>
              <div>
                 <ul>
                     <li>${name}</li>
                     <li>${formattedPopulation}</li>
                 </ul>
              </div>
           </div>`;

       countriesHTML +=  countryHTML;
    });

    countriesHTML += '</div>';

    tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
    let favoritesHTML = '<div>';

    favoritesCountries.forEach(country => {
       
       const { name, flag, id, population, formattedPopulation } = country;

       const favoriteCountryHTML = `
           <div class="country">
              <div>
                  <a id="${id}" class="waves-effect waves-light btn red darken-4"> + </a>
              </div>
              <div>
                  <img src="${flag}" alt="${name}">
              </div>
              <div>
                 <ul>
                     <li>${name}</li>
                     <li>${formattedPopulation}</li>
                 </ul>
              </div>
           </div> 
           `;
        favoritesHTML += favoriteCountryHTML;

    });


    favoritesHTML += '</div>';
    tabFavorites.innerHTML = favoritesHTML;
}


function renderSumary() {
    countCountries.textContent = allCountries.length;
    countFavorites.textContent = favoritesCountries.length;


    const totalPopulation = allCountries.reduce((accumulator, current) => {
    	return accumulator + current.population;
    }, 0);

    const totalFavorites = favoritesCountries.reduce((accumulator, current) => {
        return accumulator + current.population;
    }, 0);

    totalPopulationList.textContent = formatNumber(totalPopulation);
    totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}


function handleCountryButtons() {
    // retorna uma nodeList
    const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
    const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

       
    console.log(favoriteButtons);

    countryButtons.forEach( button => {
    	button.addEventListener('click', () => addToFavorites(button.id))
    });

    favoriteButtons.forEach( button => {
    	button.addEventListener('click', () => removeFromFavorites(button.id))
    });

}

function  addToFavorites(id) {
	// traz o próprio elemento
   const countryToAdd = allCountries.find( country => country.id === id );
   // console.log(countryToAdd);

   favoritesCountries = [...favoritesCountries, countryToAdd];
   // console.log(favoritesCountries);

   favoritesCountries.sort((a, b) => {
   	  return a.name.localeCompare(b.name);
   });

   // console.log(favoritesCountries);

   // O filter é imutável
   allCountries = allCountries.filter(country => country.id !== id);

   render();
}

function removeFromFavorites(id) {
  // traz o próprio elemento
   const countryToRemove = allCountries.find( country => country.id === id );
   // console.log(countryToAdd);

   allCountries = [...allCountries,  countryToRemove];
   // console.log(favoritesCountries);

   allCountries.sort((a, b) => {
   	  return a.name.localeCompare(b.name);
   });

   // console.log(favoritesCountries);
   favoritesCountries =favoritesCountries.filter(country => country.id !== id);

   render();

}

function formatNumber(number) {
    return numberFormat.format(number);
}