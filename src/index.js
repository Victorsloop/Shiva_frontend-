const getGames =  () => {
    fetch("http://localhost:3000/api/v1/games")
    .then(r => r.json())
    .then(games => console.log(games))
}
getGames()