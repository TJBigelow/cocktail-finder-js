document.addEventListener("DOMContentLoaded", main())

const unselectedIngredients = []
const cabinet = []
const allCocktails = []
let filteredCocktails = []
let filteredIngredients = []


function main(){
    fetchIngredients()
    fetchCocktails()
    addButtonListeners()
    addSearchInputListener()
}

function fetchCocktails(){
    fetch('/cocktails').then(resp => resp.json()).then(json => initializeCocktails(json))
}

function initializeCocktails(cocktails){
    cocktails.forEach(cocktail => allCocktails.push(cocktail))
}

function filterCocktails(){
    filteredCocktails = allCocktails.filter(cocktail => {
        return cocktail.ingredients.every(ingredient => {
            return cabinet.some(cabIngredient => cabIngredient.id === ingredient.id)
            })
    })
    buildCocktailCards()
}

function buildCocktailCards(){
    const div = document.getElementById('available-cocktails')
    div.innerHTML = ''
    filteredCocktails.forEach(cocktail => cocktailCard(cocktail))
}

function cocktailCard(cocktail){
    const div = document.getElementById('available-cocktails')
    const card = document.createElement('div')
    div.append(card)
    card.outerHTML = `
    <div class='cocktail-card d-inline-flex p-2'>
        <div class='cocktail-frame'>
        <img class='cocktail-image' src='${cocktail.image}'>
        <h5>${cocktail.name}</h5>
        </div>
    </div>`
}

function fetchIngredients(){
    fetch('/ingredients').then(resp => resp.json()).then(json => initializeIngredients(json))
}

function initializeIngredients(ingredients){
    ingredients.forEach(ingredient => unselectedIngredients.push(ingredient))
    buildIngredientCards(unselectedIngredients)
}

function buildIngredientCards(ingredients){
    const div = document.getElementById('all-ingredients')
    div.innerHTML= ''
    alphabetizeIngredients()
    ingredients.forEach(ingredient => ingredientCard(ingredient))
}

function alphabetizeIngredients(){
    unselectedIngredients.sort(function(a, b) {
        var nameA = a.name.toUpperCase()
        var nameB = b.name.toUpperCase()
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
    })
}

function ingredientCard(ingredient){
    const div = document.getElementById('all-ingredients')
    const card = document.createElement('div')
    div.append(card)
    card.outerHTML = `
    <div class='p-2 w-25'>
        <button class='ingredient-card btn btn-secondary btn-block' data-id=${ingredient.id}>${ingredient.name}</button>
    </div>`

}

function addButtonListeners(){
    document.addEventListener('click', event => {
        if (event.target.className.includes('ingredient-card btn btn-secondary')) {
            const index = (unselectedIngredients.findIndex(ingredient => ingredient.id == event.target.dataset.id))
            cabinet.push(unselectedIngredients.splice(index, 1)[0])
            filterIngredients()
            buildCabinet()
            filterCocktails()
        } else if (event.target.className.includes('ingredient-card btn btn-success')){
            const index = (cabinet.findIndex(ingredient => ingredient.id == event.target.dataset.id))
            unselectedIngredients.push(cabinet.splice(index, 1)[0])
            filterIngredients()
            buildCabinet()
            filterCocktails()
        } else if (event.target.id === 'search-clear') {
            document.getElementById('search-input').value = ''
            filterIngredients()
        }
    })
}

function addSearchInputListener(){
    document.addEventListener("input", event => {
        if (event.target.id === 'search-input'){
            filterIngredients()
        }
    })
}

function filterIngredients(){
    const searchInput = document.getElementById('search-input')
    filteredIngredients = unselectedIngredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    buildIngredientCards(filteredIngredients)
}

function buildCabinet(){
    const div = document.getElementById('cabinet')
    div.innerHTML = ''
    cabinet.forEach(ingredient => {
        const card = document.createElement('div')
        div.append(card)
        card.outerHTML = `
        <div class='p-2'>
            <button class='ingredient-card btn btn-success btn-block' data-id=${ingredient.id}>${ingredient.name}</button>
        </div>`
    })
}