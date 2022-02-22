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
			let element = document.createElement("option"); // create new option
			// insert letter into new option element and append onto dropdown
			element.textContent = String.fromCharCode(ascii);
			this.dropdown.appendChild(element);
			ascii++;
		}
	}

	// fetch data from restcountries API
	async getCountryNames() {
		try {
			const response = await fetch(
				"http://api.worldbank.org/v2/country?per_page=299&format=json"
			);
			// const response = await fetch(
			// 	`http://api.countrylayer.com/v2/all?access_key=627b90083cdb18bfd7935645a501eb36`
			// );
			const data = await response.json();
			console.log(data);

			// iterate over data and retrieve all country names
			const countries = data[1].map((country) => ({
				name: country.name,
				isoCode: country.iso2Code,
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

	// fetch data from specific country
	async getCountryData(country) {
		try {
			const x = await fetch(
				`https://restfulcountries.com/api/v1/countries/Nigeria`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log(await x.json());
			const response = await fetch(
				`http://api.worldbank.org/v2/country/${country.isoCode}?format=json`
			);
			const data = await response.json();
			this.displayDataInTable(data[1][0]);
		} catch (e) {
			console.error("Failed to fetch country.", e);
		}
	}

	// display data for corresponding country within a table
	displayDataInTable(country) {
		console.log(country);
		document.querySelector(".info-container").innerHTML = `
		  <div class="country-info-grid row">        
        <div class="country-info-item-light col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Country Name</h2>
          <p class="country-info-text" class="country-info-text">${
						country.name
					}</p>
        </div>       
        <div class="country-info-item-dark col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">ISO alpha-2 code</h2>
          <p class="country-info-text">${country.iso2Code}</p>
        </div>      
        <div class="country-info-item-light col-12 col-md-4 col-sm-6 d-flex flex-column justify-content-center p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Capital</h2>
          <p class="country-info-text">${country.capitalCity || "none"}</p>
        </div>       
        <div class="country-info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Region</h2>
          <p class="country-info-text">${country.region.value || "none"}</p>
        </div>       
        <div class="country-info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Lending Type</h2>
          <p class="country-info-text">${country.lendingType.value}</p>
        </div>       
        <div class="country-info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Income Level</h2>
          <p class="country-info-text">${
						country.incomeLevel.value || "none"
					}</p>
        </div>     
        <div class="country-info-item-light col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Latitude</h2>
          <p class="country-info-text">${country.latitude || "none"}</p>
        </div>       
        <div class="country-info-item-dark col-12 col-md-4 col-sm-6 p-3 border">
          <h2 class="country-info-title fs-5 fw-bold">Longitude</h2>
          <p class="country-info-text">${country.longitude || "none"}</p>
        </div>                          
      </div>
		`;
		this.countryList.innerHTML = "";
		// document.querySelector(".info-container").innerHTML = `
		//   <table class="table country-table" style="display: table">
		//     <tr>
		//       <th >Name</th>
		//       <td>${country.name}</td>
		//     </tr>
		//     <tr>
		//       <th>ISO alpha-2 code</th>
		//       <td>${country.iso2Code}</td>
		//     </tr>
		//     <tr>
		//       <th>Capital</th>
		//       <td>${country.capitalCity}</td>
		//     </tr>
		//     <tr>
		//       <th>Region</th>
		//       <td>${country.region.value || "none"}</td>
		//     </tr>
		//     <tr>
		//       <th>Population</th>
		//       <td>Available soon</td>
		//     </tr>
		//     <tr>
		//       <th>Income Level</th>
		//       <td>${country.incomeLevel.value || "none"}</td>
		//     </tr>
		//     <tr>
		//       <th>Latitude</th>
		//       <td>${country.latitude || "none"}</td>
		//     </tr>
		//     <tr>
		//       <th>Longitude</th>
		//       <td>${country.longitude || "none"}</td>
		//     </tr>
		//     <tr>
		//       <th>Timezones</th>
		//       <td>Available Soon</td>
		//     </tr>
		//     <tr>
		//       <th>Currencies</th>
		//       <td>Available Soon</td>
		//     </tr>
		//     <tr>
		//       <th>Languages</th>
		//       <td>Available Soon</td>
		//     </tr>
		//   </table>
		// `;
	}
	// displayDataInTable(data) {
	// 	// extract desired properties from country data
	// 	const tableData = this.extractData(data, [
	// 		"name",
	// 		"capital",
	// 		"area",
	// 		"region",
	// 		"subregion",
	// 		"population",
	// 		"borders",
	// 		"timezones",
	// 		"languages",
	// 		"currencies",
	// 		"demonym",
	// 		"latlng",
	// 		"gini",
	// 		"nativeName",
	// 		"numericCode",
	// 		"translations",
	// 		"flag",
	// 	]); // array of desired keys

	// 	let tableDataArr = Object.keys(tableData); // initialise new object as array

	// 	// iterate over table data array
	// 	for (let i = 0; i < tableDataArr.length; ++i) {
	// 		// insert value of current object property into appropriate table cell
	// 		if (
	// 			tableData[tableDataArr[i]] === null ||
	// 			tableData[tableDataArr[i]].length < 1
	// 		) {
	// 			this.tableCells[i].textContent = "No " + tableDataArr[i];
	// 		} else {
	// 			if (tableDataArr[i] === "flag") {
	// 				this.renderFlag(tableData.flag);
	// 			} else if (
	// 				tableDataArr[i] === "currencies" ||
	// 				tableDataArr[i] === "languages" ||
	// 				tableDataArr[i] === "translations"
	// 			) {
	// 				// output object values containing objects in JSON string format
	// 				if (tableDataArr[i] === "languages") {
	// 					let temp = [];
	// 					// iterate over object within object value array and output name
	// 					for (let item of tableData[tableDataArr[i]]) {
	// 						temp.push(item.name); // push name value onto array
	// 					}
	// 					this.tableCells[i].textContent = temp.join(", ");
	// 				} else {
	// 					this.tableCells[i].textContent = JSON.stringify(
	// 						tableData[tableDataArr[i]]
	// 					).split(", ");
	// 				}
	// 			} else {
	// 				// insert object value into table cell with separation for arrays
	// 				Array.isArray(tableData[tableDataArr[i]])
	// 					? (this.tableCells[i].textContent =
	// 							tableData[tableDataArr[i]].join(", "))
	// 					: (this.tableCells[i].textContent = tableData[tableDataArr[i]]);
	// 			}
	// 		}
	// 	}
	// }

	// extracts and stores neccessary data from GET request within new object
	extractData(data, keys) {
		const newData = {};
		// store key/property within new object if included in keys array
		Object.keys(data[0]).forEach((key) => {
			if (keys.includes(key)) {
				newData[key] = data[0][key];
			}
		});
		return newData;
	}

	// renders image with specified dimension and size values
	renderFlag(flag) {
		const flagContainer = document.querySelector(".flag-container");
		flagContainer.innerHTML = `
      <img class="flag" src="${flag}" alt="Flag cannot be rendered">`;
		flagContainer.style.display = "block"; // display container for flag
	}
}

// instantiate our class as an object
const country = new Country();
