
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
const reviewLike = document.querySelector('#review-like')
const reviewForm = document.querySelector('#review-form')
const globalLikeButton = document.createElement('likebutton')
globalLikeButton.textContent = '👍'
const globalDeleteButton = document.createElement('deletebutton')
globalDeleteButton.textContent = '😵'
const globalDislikeButton = document.createElement('dislikebutton')
globalDislikeButton.textContent = '💩'
// const reviewRating = document.querySelector('#review-rating')


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
    reviewForm.dataset.id = gameObj.id
    reviewContainer.dataset.id = gameObj.id // Dislike and like 
    gameImage.src = gameObj.image
    gameImage.alt = gameObj.title
    gameTitle.textContent = gameObj.title
    gameRating.textContent = parseInt(gameObj.overall_rating)
    gameRelease.textContent = gameObj.release_date
    gameDescription.textContent = gameObj.description 

    gamePage.append(gameImage, gameTitle, gameRating, gameRelease, gameDescription)

    gameObj.reviews.forEach((review) => {
        const div = document.createElement('div')
        div.dataset.id = review.id
        // div.className = "content-info"
        const titleH2 = document.createElement('h2')
        const contentP = document.createElement('p')
        const contentLike = document.createElement('p')
        const contentRating = document.createElement('h3')
        const contentPlaytime = document.createElement('h4')
        const likeButton = document.createElement('likebutton')
        const deleteButton = document.createElement('deletebutton')
        likeButton.className = "like-button"
        likeButton.dataset.id = review.id
        const dislikeButton = document.createElement('dislikebutton')
        dislikeButton.className = "dislike-button"
        dislikeButton.dataset.id = review.id
        dislikeButton.textContent = '💩'
        likeButton.textContent = '👍'
        deleteButton.textContent = '😵'
        deleteButton.className = 'delete-button'
        deleteButton.dataset.id = review.id
        contentP.className = 'review-content'
        contentLike.className = 'likes'

        titleH2.textContent = review.title
        contentRating.textContent = review.rating
        contentP.textContent = review.content
        contentPlaytime.textContent = review.playtime
        contentLike.textContent = review.like
        //updatedLike = document.querySelector('.likes')
        div.append(titleH2,contentP,contentPlaytime, contentLike, contentRating,likeButton, dislikeButton,deleteButton)
        gameReview.append(div )
        
        reviewContainer.append(gameReview)
        
    })
    
    
    
}


/******** Event Listeners ********/
gameContainer.addEventListener('click', handleGameClick)
reviewContainer.addEventListener('click', handleLikeButton)
reviewContainer.addEventListener('click', handleDislikeButton)
reviewContainer.addEventListener('click', handleDeleteButton)
reviewForm.addEventListener('submit', handleReviewSubmit)

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
  // debugger
    const id = event.target.dataset.id
    const updatedLike = event.target.parentElement.querySelector('.likes')
    const increaseLike = parseInt(updatedLike.textContent) + 1
    
    
    console.log(event.target)
    if (event.target.matches('.like-button')) {
      const likeObj = {
          like: increaseLike
      }
      // debugger
      updateLike(id, likeObj, updatedLike, increaseLike)
      console.log('click');
      // updatedLike.textContent = increaseLike
    }

}

function handleDislikeButton(e){
    const id = e.target.dataset.id
    // debugger
    const updatedLike = e.target.parentElement.querySelector('.likes')
    const decreaseLike = parseInt(updatedLike.textContent) - 1
    if(e.target.matches('.dislike-button')) {
        const likeObj = { 
            like: decreaseLike
        }
        
        updateLike(id, likeObj, updatedLike, decreaseLike)
    }

}

const updateLike = (id, likeObj, updatedLike, like) => {
  // debugger
    fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(likeObj)
    })
    .then(r => r.json())
    .then(data => {updatedLike.textContent = like})
}


function handleReviewSubmit(event) {
    event.preventDefault()
    console.log(event.target.rating);
    const id = parseInt(reviewForm.dataset.id)
    const reviewTitle = event.target.title.value
    const reviewRating = parseInt(event.target.rating.value)
    const reviewPlaytime = event.target.playtime.value
    const reviewContent = event.target.content.value

    const newReview = {
        title: reviewTitle,
        rating: reviewRating,
        like: 1,
        playtime: reviewPlaytime,
        content: reviewContent, 
        user_id: 4,
        game_id: id
    }
    addReview(newReview)
}


const addReview = (newReview) => {   
    fetch(`http://localhost:3000/api/v1/reviews/`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(newReview)
    })
    .then(r => r.json())
    .then(newReview => {
      const div = document.createElement('div')
      div.innerHTML = `
        <h2>${newReview.title}</h2>
        <p class='likes'>${newReview.content}</p>
        <h4>${newReview.playtime}</h4>
        <p>${newReview.like}</p>
        <h3>${newReview.rating}</h3>
        ${globalLikeButton.textContent}  
        ${globalDislikeButton.textContent}
        ${globalDeleteButton.textContent}
      `
      gameReview.append(div)
      console.log(div);
    })
}

function handleDeleteButton(event) {
    //deletebutton.dataset.id = review.id 
    
    
    if (event.target.matches('.delete-button')) {
        const id = event.target.dataset.id
        const ul = event.target.closest('ul')
        fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: 'DELETE',
    })
    .then(r => r.json())
    .then(deleteReview => {
        ul.remove();
    })

    }

}

/****** Initialize *********/
getGames()