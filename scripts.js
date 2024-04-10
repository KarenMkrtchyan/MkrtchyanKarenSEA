function populateDialog(dialog, inputCountry, countryDetail) {
	dialog.replaceChildren() // clear out dialog
	const image = document.createElement('img')
	const name = document.createElement('h2')
	const button = document.createElement('button')
	const list = document.createElement('ul')
	const population = document.createElement('li')
	const area = document.createElement('li')
	const gdp = document.createElement('li')
	list.appendChild(population)
	list.appendChild(area)
	list.appendChild(gdp)
	dialog.appendChild(name)
	dialog.appendChild(image)
	dialog.appendChild(list)
	dialog.appendChild(button)

	button.innerText = 'close'
	button.addEventListener('click', () => {
		console.log('trying to close')
		dialog.close()
	})
	for (country of countryDetail) {
		if (country.Country == inputCountry.Country) {
			image.setAttribute('src', inputCountry.URL)
			name.innerHTML = country.Country
			population.innerText = `Population ${country.Population}`
			area.innerText = `Area in square miles ${country['Area (sq. mi.)']}`
			gdp.innerText = `GDP ($ per capita) ${country['GDP ($ per capita)']}`
			return true
		}
	}
}
function createCard(country, countryDetail) {
	const card = document.createElement('div')
	const image = document.createElement('img')
	const name = document.createElement('h2')
	const button = document.createElement('button')
	const dialog = document.querySelector('dialog')
	button.innerText = 'learn more'
	button.addEventListener('click', () => {
		console.log(country.Country, ' modal')
		populateDialog(dialog, country, countryDetail)
		dialog.showModal()
	})
	card.className = 'card'
	image.setAttribute('src', country.URL)
	name.innerHTML = country.Country
	card.appendChild(image)
	card.appendChild(name)
	card.appendChild(button)
	return card
}

function showCards(filter) {
	const cardContainer = document.getElementById('card-container')
	cardContainer.innerHTML = ''

	if (filter) {
		for (const country of countryFlagSorted) {
			if (country.Country.toLowerCase().includes(filter.toLowerCase())) {
				cardContainer.appendChild(createCard(country, countryDetail))
			}
		}
	} else {
		for (const country of countryFlagSorted) {
			cardContainer.appendChild(createCard(country, countryDetail))
		}
	}
}

async function loadData() {
	countryFlag = await fetch('flags.json')
		.then(response => response.json())
		.then(json => {
			return json
		})
	countryDetail = await fetch('details.json')
		.then(response => response.json())
		.then(json => {
			return json
		})
}

let countryFlagSorted
let countryFlag
let countryDetail
let sortBy = 'name'
loadData().then(() => {
	countryFlagSorted = countryFlag
	showCards()
})

const filter = document.querySelector('.filter')
filter.addEventListener('input', () => {
	const filterValue = filter.value
	showCards(filterValue)
})

function sort(sortBy) {
	let filteredCountry = []

	switch (sortBy) {
		case 'population':
			filteredCountry = countryDetail.slice().sort((a, b) => {
				return a.Population - b.Population
			})
			break
		case 'area':
			filteredCountry = countryDetail.slice().sort((a, b) => {
				return a['Area (sq. mi.)'] - b['Area (sq. mi.)']
			})
			break
	
		//Data already sorted by Name
		case 'name':
			filteredCountry = countryDetail
			break
	}
	let result = []
	for (cf of filteredCountry) {
		for (c of countryFlag) {
			if (cf.Country == c.Country) {
				result.push(c)
			}
		}
	}

	return result
}

function setSortVal(val) {
	console.log('new sort val ', val)
	sortBy = val
	countryFlagSorted = sort(sortBy)
	showCards()
}
