class Country {
  // instantiate a class blueprint
  constructor() {
    this.dropdown = document.getElementById('dropdown')
    this.countryList = document.querySelector('.country-list')
    this.countryTable = document.querySelector('.country-table')
    this.tableCells = document.getElementsByTagName('td')
    this.populateDropdown()
    this.events()
  }

  // events
  events() {
    this.dropdown.onchange = () => {
      if (this.dropdown.value.length == 1) this.getCountryNames()
    }
  }

  // methods will go here

  // populates select dropdown with letters from A-Z
  populateDropdown() {
    let ascii = 65

    while (ascii <= 90) {
      let element = document.createElement('option') // create new option

      // insert letter into new option element and append onto dropdown
      element.textContent = String.fromCharCode(ascii)
      this.dropdown.appendChild(element)
      ascii++
    }
  }

  // fetch data from restcountries API
  async getCountryNames() {
    try {
      const response = await fetch("https://restcountries.eu/rest/v2/all")
      const data = await response.json()
      // iterate over data and retrieve all country names
      const countries = data.map((country) => {
        return country.name
      })
      this.loadByLetter(countries) 
    } catch(e) {
      console.log("Failed to fetch all countries.", e)
    }
  }

  // load and output all countries beginning with corresponding letter
  loadByLetter(countries) {
    this.countryList.innerHTML = '' // empty country list

    for (let i = 0; i < countries.length; ++i) {
      // insert country with corresponding starting letter into list
      if (countries[i][0] == this.dropdown.value) {
        let countryListItem = document.createElement('li')
        this.countryList.appendChild(countryListItem)
        countryListItem.innerHTML = countries[i]
        countryListItem.onclick = () => this.getCountryData(countryListItem)
      } 
    }
  }

  // fetch data from specific country 
  async getCountryData(countryListItem) {
    try {
      const response = await fetch(`https://restcountries.eu/rest/v2/name/${countryListItem.textContent}?fullText=true`)
      const data = await response.json()
      this.displayDataInTable(data)
      this.countryTable.style.display = 'table' // display country table
    } catch(e) {
      console.error("Failed to fetch country.", e)
    }
  }

  // display data for corresponding country within a table
  displayDataInTable(data) {
    // extract desired properties from country data
    const tableData = this.extractData(data, ["name", "capital", "area", "region", "subregion", "population", "borders", "timezones", 
      "languages", "currencies", "demonym", "latlng", "gini", "nativeName", "numericCode", "translations", "flag"]) // array of desired keys

    let tableDataArr = Object.keys(tableData) // initialise new object as array
   
    // iterate over table data array
    for (let i = 0; i < tableDataArr.length; ++i) {
      // insert value of current object property into appropriate table cell
      if (tableData[tableDataArr[i]] === null || tableData[tableDataArr[i]].length < 1) {
        this.tableCells[i].textContent = "No " + tableDataArr[i]
      } else {
        if (tableDataArr[i] === "flag") {
          this.renderImage(tableData.flag)
        }
        else if (tableDataArr[i] === 'currencies' || tableDataArr[i] === 'languages' || tableDataArr[i] === 'translations') {
          // output object values containing objects in JSON string format
          if (tableDataArr[i] === 'languages') {
            let temp = []
            // iterate over object within object value array and output name
            for (let item of tableData[tableDataArr[i]]) {
              console.log("language")
              temp.push(item.name) // push name value onto array
            }
            this.tableCells[i].textContent = temp.join(', ')
          } else {
            this.tableCells[i].textContent = JSON.stringify(tableData[tableDataArr[i]]).split(', ')
          }
        } else {
          // insert object value into table cell with separation for arrays
          Array.isArray(tableData[tableDataArr[i]]) ? this.tableCells[i].textContent = tableData[tableDataArr[i]].join(', ')
            : this.tableCells[i].textContent = tableData[tableDataArr[i]]
        }
      }           
    }
  }

  // extracts and stores neccessary data from GET request within new object
  extractData(data, keys) {
    const newData = {}
    // store key/property within new object if included in keys array
    Object.keys(data[0]).forEach((key) => {
      if (keys.includes(key)) {
        newData[key] = data[0][key]
      }
    })
    return newData
  }

  // renders image with specified dimension and size values
  renderImage(flag) {
    const flagContainer = document.querySelector('.flag-container')
    flagContainer.innerHTML = `
      <img class="flag" src="${flag}" alt="Flag cannot be rendered">`
    flagContainer.style.display = 'block' // display container for flag
  }
}

// instantiate our class within an object
const country = new Country()
