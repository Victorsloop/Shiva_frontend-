
/******** DOM Elements *********/
const gameContainer = document.querySelector('#game-list')
const gamePage = document.querySelector(`#game-page`) // Just made to append new game
const gameImage = document.querySelector('#game-image')
const gameTitle = document.querySelector('#game-title')
const gameDescription = document.querySelector('#game-description')
const gameRating = document.querySelector('#game-rating')
const gameRelease = document.querySelector('#game-release')
const gameReview = document.querySelector('#game-review')
const reviewContainer = document.querySelector('#review-container')


/******** Render Functions ********/
const getGames =  () => {
    fetch("http://localhost:3000/api/v1/games")
    .then(r => r.json())
    .then(games => renderAllGames(games))
}

function renderAllGames(games) {
    games.forEach((game) => {
        renderOneGame(game)
    })
}

function renderOneGame(game) {
    const li = document.createElement('li')
    li.dataset.id = game.id
    li.textContent = `${game.title}`

    
    gameContainer.append(li)

}

function renderGameDetails(gameObj) {
    
    gameImage.src = gameObj.image
    gameImage.alt = gameObj.title
    gameTitle.textContent = gameObj.title
    gameRating.textContent = parseInt(gameObj.overall_rating)
    gameRelease.textContent = gameObj.release_date
    gameDescription.textContent = gameObj.description 

    gamePage.append(gameImage, gameTitle, gameRating, gameRelease, gameDescription)

    gameObj.reviews.forEach((review) => {
        const titleLi = document.createElement('li')
        const contentP = document.createElement('p')
        const contentLike = document.createElement('p')
        const contentRating = document.createElement('h3')
        const contentPlaytime = document.createElement('h4')
        const likeButton = document.createElement('likebutton')
        const dislikeButton = document.createElement('dislikebutton')
        dislikeButton.textContent = '💩'
        likeButton.textContent = '👍'
        contentP.className = 'review-content'
        contentLike.className = 'likes'

        titleLi.textContent = review.title
        contentRating.textContent = review.rating
        contentP.textContent = review.content
        contentPlaytime.textContent = review.playtime
        contentLike.textContent = review.like
        
        gameReview.append(titleLi,contentP,contentPlaytime, contentLike, contentRating)
        
        reviewContainer.append(gameReview,likeButton, dislikeButton)
    })

    // t.string "title"
    // t.integer "rating"
    // t.integer "like"
    // t.text "content"
    // t.integer "playtime"
    
    
}


/******** Event Listeners ********/
gameContainer.addEventListener('click', handleGameClick)
reviewContainer.addEventListener('click', handleLikeButton)

/******** Event Handlers ********/
function handleGameClick(event) {
    if (event.target.matches('li')) {
        const li = event.target.closest('li')
        const id = li.dataset.id
        
        fetch(`http://localhost:3000/api/v1/games/${id}`)
        .then(r => r.json())
        .then(gameObj => renderGameDetails(gameObj))
        
    }
}

function handleLikeButton(event) {
    if (event.target.matches('#likebutton')) {

    }
}

function handleDislikeButton(e){
    if(e.target.matches('#dislikebutton')) {

    }
    
}

/****** Initialize *********/
getGames()