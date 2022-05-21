const audio = new Audio(
    "https://css-tricks.com/examples/SoundOnHover/audio/beep.mp3"
)
const $hangman = document.querySelectorAll("#hangman-render svg g path")
const $hangmanRender = document.getElementById("hangman-render")
const $lives = document.getElementById("lives")
const $guess = document.getElementById("guess")
const $alphabet = document.querySelector(".alphabet")
const $buttons = document.getElementById("buttons")
const $startgame = document.querySelector(".startgame")

const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
]
// Audio volume
audio.volume = 0.1

// Remaining lives
let lives = 10
let correctGuessCounter = 0
let hangmanCounter = 0

function startGame() {
    $startgame.style.display = "none"
}

/**
 * Renders the alphabet from A-Z as button for guesses.
 * @param {Array} alphabet
 */
function renderAlphabetButtons(alphabet) {
    $alphabet.innerHTML = alphabet.map(
        (letter) => `<div class="letter">${letter}</div>`
    )
}

/**
 * Renders dashed lines as length of the word
 * @param {Array} word
 */
function renderGuessPreview(word) {
    const tempWord = word[0].split("")
    tempWord.forEach(() => {
        $guess.innerHTML += `<span class='correct'>-<span>`
    })
}

/**
 * Assigns hover audio for every alphabet button
 * @param {HTMLElement} letter
 */
function setHoverAudio(letter) {
    letter.addEventListener(
        "mouseover",
        function () {
            const isNoSelect = Object.values(letter.classList).includes(
                "noselect"
            )
            if (!isNoSelect) {
                audio.muted = false
                audio.play()
            }
        },
        false
    )

    letter.addEventListener(
        "mouseleave",
        function () {
            audio.pause()
            audio.currentTime = 0
        },
        false
    )
}

/**
 * This function will select every letter we have rendered to screen,
 * will add event listener to check the letter if it is used in the correct word.
 * If the guess is correct replace it with '✓' and call for correctGuess function
 * If the guess is wrong, check for remaining lives using remainingLivesChecker function
 * @param {Array} word
 */
function guessChecker(word) {
    const $letter = document.querySelectorAll(".letter")
    const upperWord = word[0].toUpperCase()
    console.log("Correct answer (FOR CHEATERS):", upperWord)

    $letter.forEach((letter) => {
        setHoverAudio(letter)

        letter.addEventListener("click", (event) => {
            const guessedLetter = event.target.innerText

            if (upperWord.includes(guessedLetter) && lives > 0) {
                event.target.innerText = "✓"
                event.target.style.color = "#00eb2f"
                event.target.setAttribute("disabled", "")
                event.target.classList.add("noselect")

                correctGuess(guessedLetter, upperWord)
            } else if (
                event.target.innerText !== "✓" &&
                event.target.innerText !== "✘" &&
                lives > 0
            ) {
                // check if the value is not x decrease the lives
                // we set this because after the wrong answer you can still click on the 'x'
                // and this was causing a bug

                lives = lives - 1
                wrongGuess(lives, upperWord)

                event.target.innerText = "✘"
                event.target.style.color = "red"
                event.target.setAttribute("disabled", "")
                event.target.classList.add("noselect")
            }
        })
    })
}

/**
 * Accept 2 arguments, correct word and the guessed letter
 * if the guessed letter exist in word, shows the letters on dashed area
 * @param {string} alphabet
 * @param {string} correctWord
 */
function correctGuess(alphabet, correctWord) {
    const correct = document.querySelectorAll(".correct")
    const splitCorrectWord = correctWord.split("")
    const count = []

    splitCorrectWord.filter((element, index) => {
        if (element === alphabet) {
            count.push([element, index])
        }
    })

    count.forEach((arr) => {
        correctGuessCounter = correctGuessCounter + 1
        correct[arr[1]].innerText = arr[0]
    })

    if (correctGuessCounter === correctWord.length) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        })

        $guess.innerText = correctWord
        $alphabet.innerHTML = `<h1>Congratulation</h1>`
        $buttons.innerHTML += `<button class="restart" onclick="window.location.reload()">Restart</button>`
        $guess.style.color = "green"
        $hangmanRender.style.display = "none"
    }
}

/**
 * Checks the remaning lives, if its 0 game is over
 * @param {number} counts
 */
function wrongGuess(remainingLives, correctWord) {
    if (remainingLives > 0) {
        $lives.innerHTML = remainingLives
        $hangman[hangmanCounter].style = "visibility: visible"
        hangmanCounter = hangmanCounter + 1
    } else {
        $hangman[9].style = "visibility: visible"
        $lives.innerHTML = 0
        $alphabet.innerHTML = `<h1>Game Over</h1>`
        $guess.innerHTML = correctWord
        $guess.style.color = "red"
        $buttons.innerHTML += `<button class="restart" onclick="window.location.reload()">Restart</button>`
    }
}

/**
 * Fethces a word from the API and send it to guessChecker function
 * @param {Array} letters
 */
async function fetchWordAPI(letters) {
    const URL = "https://random-word-api.herokuapp.com/word?number=1"
    const res = await fetch(URL)
    const word = await res.json()

    renderAlphabetButtons(letters)
    renderGuessPreview(word)
    guessChecker(word)
}

fetchWordAPI(alphabets)
