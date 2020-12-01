
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
// let updatedLike = ""
const reviewLike = document.querySelector('#review-like')


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
    
    reviewContainer.dataset.id = gameObj.id // Dislike and like 
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
        likeButton.className = "like-button"
        likeButton.dataset.id = review.id
        const dislikeButton = document.createElement('dislikebutton')
        dislikeButton.className = "dislike-button"
        dislikeButton.dataset.id = review.id
        dislikeButton.textContent = '💩'
        likeButton.textContent = '👍'
        contentP.className = 'review-content'
        contentLike.className = 'likes'

        titleLi.textContent = review.title
        contentRating.textContent = review.rating
        contentP.textContent = review.content
        contentPlaytime.textContent = review.playtime
        contentLike.textContent = review.like
        //updatedLike = document.querySelector('.likes')
        
        gameReview.append(titleLi,contentP,contentPlaytime, contentLike, contentRating)
        
        reviewContainer.append(gameReview,likeButton, dislikeButton)
    })
    
    
}


/******** Event Listeners ********/
gameContainer.addEventListener('click', handleGameClick)
reviewContainer.addEventListener('click', handleLikeButton)
reviewContainer.addEventListener('click', handleDislikeButton)

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
    const id = event.target.dataset.id
    const updatedLike = document.querySelector('.likes')
    const increaseLike = parseInt(updatedLike.textContent) + 1
    
    
    console.log(event.target)
    if (event.target.matches('.like-button')) {
        updatedLike.textContent = increaseLike
        }

        const likeObj = {
            like: increaseLike
        }
        
        updateLike(id, likeObj)

}

function handleDislikeButton(e){
    const id = e.target.dataset.id
    const updatedLike = document.querySelector('.likes')
    const decreaseLike = parseInt(updatedLike.textContent) - 1
    
    if(e.target.matches('.dislike-button')) {
        updatedLike.textContent = decreaseLike

    }
    
    const likeObj = {
        like: decreaseLike
    }
    
    updateLike(id, likeObj)
}

const updateLike = (id, likeObj) => {
    fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(likeObj)
    })
    .then(r => r.json())
    .then(console.log)
}


/****** Initialize *********/
getGames()