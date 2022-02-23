class Country {
	// instantiate a class blueprint
	constructor() {
		this.dropdown = document.getElementById("dropdown");
		this.countryList = document.querySelector(".country-list");
		this.countryTable = document.querySelector(".info-container");
		this.tableCells = document.getElementsByTagName("td");
		this.populateDropdown();
		this.events();
	}

	// events
	events() {
		this.dropdown.onclick = () => {
			if (this.dropdown.value.length == 1) this.getCountryNames();
		};
	}

	// populates select dropdown with letters from A-Z
	populateDropdown() {
		let ascii = 65;

		while (ascii <= 90) {
			// insert letter into new option element and append onto dropdown
			let element = document.createElement("option");
			element.textContent = String.fromCharCode(ascii);
			this.dropdown.appendChild(element);
			ascii++;
		}
	}

	async getCountryNames() {
		try {
			const response = await fetch(
				"https://api.worldbank.org/v2/country?per_page=299&format=json"
			);
			const data = await response.json();

			// retrieve all country names and iso2 codes
			const countries = data[1].map((country) => ({
				name: country.name,
				iso2Code: country.iso2Code,
			}));
			this.loadByLetter(countries);
		} catch (e) {
			console.error("Failed to fetch all countries.", e);
		}
	}

	// load and output all countries beginning with corresponding letter
	loadByLetter(countries) {
		this.countryList.innerHTML = ""; // empty country list

		for (let country of countries) {
			// insert country with corresponding starting letter into list
			if (country.name[0] == this.dropdown.value) {
				let countryListItem = document.createElement("li");
				countryListItem.innerHTML = country.name;
				countryListItem.setAttribute("name", country.isoCode);
				this.countryList.appendChild(countryListItem);
				countryListItem.onclick = () => this.getCountryData(country);
			}
		}
	}

	createCountryViewModel(wbData, rcData) {
		return {
			name: wbData.name || "Not Applicable",
			iso2Code: wbData.iso2Code || "Not Applicable",
			capitalCity: wbData.capitalCity || "Not Applicable",
			region: wbData.region || "Not Applicable",
			size: rcData.size || "Not Applicable",
			population: rcData.population || "Not Applicable",
			currency: rcData.currency || "Not Applicable",
			phoneCode: rcData.phone_code || "Not Applicable",
			incomeLevel: wbData.incomeLevel || "Not Applicable",
			lendingType: wbData.lendingType || "Not Applicable",
			latitude: wbData.latitude || "Not Applicable",
			longitude: wbData.longitude || "Not Applicable",
			flagSrc: `https://countryflagsapi.com/png/${wbData.iso2Code}`,
		};
	}

	async getRestfulCountriesData(country) {
		try {
			const response = await fetch(
				`https://restfulcountries.com/api/v1/countries/${country.name}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer 55|tGYLGHgoBRLfheDDikCsyrKarReWHzIUuP3NTKid",
					},
				}
			);
			const data = await response.json();
			return data.data || {};
		} catch (e) {
			console.error("Failed to fetch restfulcountries data: ", e);
		}
	}

	async getWorldBankData(country) {
		try {
			const response = await fetch(
				`https://api.worldbank.org/v2/country/${country.iso2Code}?format=json`
			);
			const data = await response.json();
			return data[1][0] || {};
		} catch (e) {
			console.error("Failed to fetch worldbank data: ", e);
		}
	}

	async getCountryData(initialCountry) {
		const worldBankData = await this.getWorldBankData(initialCountry);
		const restfulCountriesData = await this.getRestfulCountriesData(
			initialCountry
		);

		// Merge and extract data sets into a single country object
		const country = this.createCountryViewModel(
			worldBankData,
			restfulCountriesData
		);
		console.log({ country });
		this.renderFlag(country.flagSrc);
		this.displayDataInTable(country);
	}

	// display data for corresponding country
	displayDataInTable(country) {
		document.querySelector(".info-container").innerHTML = `
		  <div class="row">        
        <div class="info-item-light col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="info-title fs-5 fw-bold">Country Name</h2>
          <p class="info-text">${country.name}</p>
        </div>       
        <div class="info-item-dark col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="info-title fs-5 fw-bold">ISO Alpha-2 Code</h2>
          <p class="info-text">${country.iso2Code}</p>
        </div>      
        <div class="info-item-light col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="info-title fs-5 fw-bold">Capital</h2>
          <p class="info-text">${country.capitalCity}</p>
        </div>       
        <div class="info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Region</h2>
          <p class="info-text">${country.region?.value}</p>
        </div>
				<div class="info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Size</h2>
          <p class="info-text">${country.size}</p>
        </div>
				<div class="info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Population</h2>
          <p class="info-text">${country.population}</p>
        </div>
				<div class="info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Currency</h2>
          <p class="info-text">${country.currency}</p>
        </div>
				<div class="info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Phone Code</h2>
          <p class="info-text">${country.phoneCode}</p>
        </div>       
				<div class="info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Income Level</h2>
          <p class="info-text">${country.incomeLevel?.value}</p>
        </div> 
        <div class="info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Lending Type</h2>
          <p class="info-text">${country.lendingType?.value}</p>
        </div>                   
        <div class="info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Latitude</h2>
          <p class="info-text">${country.latitude}</p>
        </div>       
        <div class="info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="info-title fs-5 fw-bold">Longitude</h2>
          <p class="info-text">${country.longitude}</p>
        </div>                          
      </div>
		`;
		this.countryList.innerHTML = ""; // Empty country list once data is rendered
	}

	// render flag image
	renderFlag(flagSrc) {
		const flagContainer = document.querySelector(".flag-container");
		const flagImageHTML = `<img class="flag" src="${flagSrc}" alt="Flag of source: ${flagSrc} cannot be rendered">`;
		flagContainer.innerHTML = flagImageHTML;
		const flagImage = document.querySelector(".flag");
		flagImage.onerror = () => (flagImage.src = "./images/fake-flag.jpg"); // replace image source if original is invalid
		flagContainer.style.display = "block"; // display flag container
	}
}

// instantiate our class as an object
const country = new Country();
