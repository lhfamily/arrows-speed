const game = {
	gameData: {},
	level: 1,
	highScore: 0,
	highScoreCass: "",

	// Divs
	gameBoard: document.getElementById("game-board"),
	playButton: document.getElementById("play-button"),
	scoreDisplay: document.getElementById("score"),
	timerDisplay: document.getElementById("timer"),
	backgroundDisplay: document.getElementById("background"),

	// Indice de la note dominante dans la gamme pentatonique
	dominanteIndex: 432,

	// Nombre de notes dans la mélodie
	numNotes: 7,

	// Indices de la gamme pentatonique mineure blues
	pentatonicBlues: [0, 3, 5, 6, 7, 10, 12],
	pentatonicMelody: [],

	noteIndex: 0,
	score: 0,
	currentIndex: 0,
	currentDuration: 0,
	currentArrow: "play",
	currentTest: "",
	next: false,
	keyListener: null,

	pixelTiming: 30,
	maxPixels: 300,
	pixels: [],

	// Init
	run() {
		// this.generatePixels(100);
		setInterval(() => {
			this.createPixel(this);
		}, this.pixelTiming);
		this.generateRandomPentatonicMelody();
		this.loadHighScore();
		this.setupEventListeners();
	},

	loadHighScore() {
		const storedHighscore = localStorage.getItem("highscore");
		if (storedHighscore !== null) {
			this.highScore = parseInt(storedHighscore);
		}
	},

	setupEventListeners() {
		window.addEventListener("DOMContentLoaded", () => {
			this.playButton.classList.remove("hidden");
			this.playButton.addEventListener("click", () => {
				this.playGame();
			});
		});

		document.addEventListener("keydown", (event) => {
			// console.log(event.key);
			if (this.currentArrow != "") {
				// Gestion des touches et du score
				if (this.currentArrow == "play" && event.key == " ") {
					this.currentArrow = "";
					this.playGame();
				} else if (this.currentArrow != "play") {
					this.currentTest =
						"Arrow" +
						this.currentArrow.charAt(0).toUpperCase() +
						this.currentArrow.slice(1);
					if (event.key === this.currentTest) {
						this.currentArrow = "";
						this.score++;
						this.scoreDisplay.textContent = `Score : ${this.score}`;
					} else {
						console.error("GAME OVER"); // , this.currentTest
						this.showFinalScreen();
					}
				}
			}
		});
	},

	playGame() {
		// Logique de démarrage du jeu
		this.currentArrow = "";
		this.gameData = this.levelGenerator(this.level);
		this.gameBoard.innerHTML = "";

		this.playButton.classList.add("hidden");
		this.score = 0;
		this.scoreDisplay.textContent = "Score : 0";
		this.currentIndex = 0;

		this.playNext();
	},

	playNext() {
		// Logique pour jouer la prochaine note
		if (this.currentIndex >= this.gameData.length) {
			this.showFinalScreen();
			return;
		}
		const startTime = Date.now();

		const countdownInterval = setInterval(() => {
			const currentTime = Date.now();
			const elapsedTime = currentTime - startTime;
			const remainingTime = currentItem.duration - elapsedTime;

			if (remainingTime <= 0) {
				clearInterval(countdownInterval);
				this.timerDisplay.textContent = "0 ms";
			} else {
				this.timerDisplay.textContent = `${remainingTime.toFixed(0)} ms`;
			}
		}, 10);

		const currentItem = this.gameData[this.currentIndex];
		this.createGameCase(currentItem);
		this.currentArrow = currentItem.direction;

		this.next = setTimeout(() => {
			this.currentIndex++;
			this.timerDisplay.textContent = "0 ms";
			this.playNext();
		}, currentItem.duration);
	},

	createGameCase(item) {
		// Création d'un élément de jeu
		var gameCases = document.querySelectorAll(".game-case");
		gameCases.forEach((element) => {
			element.classList.add("minified");
		});

		const gameCase = document.createElement("div");
		gameCase.className = "game-case";
		gameCase.style.backgroundImage = `url(https://tribu.lh.family/assets/img/${item.direction}.png)`;

		const progressBar = this.createProgressBar(item.duration);
		progressBar.id = "moldyPeachesWereGood";
		gameCase.appendChild(progressBar);

		// gameBoard.innerHTML = "";
		this.gameBoard.appendChild(gameCase);
		this.melody(Math.round(Math.random() * 6));
	},

	showFinalScreen() {
		// Ecran de score
		clearTimeout(this.next);
		this.currentArrow = "";
		this.gameBoard.innerHTML = "";
		this.scoreDisplay.textContent = "";
		this.timerDisplay.textContent = "";
		this.highScoreCass = "";

		if (this.score > this.highScore) {
			this.highScore = this.score;
			this.highScoreCass = "color:yellow";

			const storedHighscore = localStorage.getItem("highscore");
			if (storedHighscore === null || this.score > parseInt(storedHighscore)) {
				localStorage.setItem("highscore", this.score);
			}
		}
		this.gameBoard.innerHTML = `<big>GAME<br>OVER</big><small style="font-size:83%">Your Score:</small><big>${this.score}</big><small style="font-size:72%; ${this.highScoreCass}">HIGHSCORE ${this.highScore}</small>`;
		this.playButton.classList.remove("hidden");
		this.currentArrow = "play";
	},

	getRandomDirection() {
		// Génération aléatoire de la direction
		const directions = ["up", "down", "left", "right"];
		const randomIndex = Math.floor(Math.random() * directions.length);
		return directions[randomIndex];
	},

	getRandomDuration() {
		// Génération aléatoire de la durée
		return Math.floor(Math.random() * (1000 / this.level)) + 500;
	},

	levelGenerator(level) {
		// Génération du niveau
		const numberOfNotes = 30 + 3 * level;
		const generatedGameData = [];

		for (let i = 0; i < numberOfNotes; i++) {
			const note = {
				type: "note",
				direction: this.getRandomDirection(),
				duration: this.getRandomDuration()
			};
			generatedGameData.push(note);
		}

		return generatedGameData;
	},

	createProgressBar(duration) {
		this.currentDuration = duration;

		const progressBar = document.createElement("div");
		progressBar.className = "progress-bar";

		const cubesContainer = document.createElement("div");
		cubesContainer.className = "cubes-container";

		const numCubes = 10;
		for (let i = 0; i < numCubes; i++) {
			const cube = document.createElement("div");
			cube.className = "progress-cube";
			cubesContainer.appendChild(cube);
		}

		progressBar.appendChild(cubesContainer);

		const startTime = performance.now();
		const interval = setInterval(() => {
			const currentTime = performance.now();
			const elapsedTime = currentTime - startTime;
			const percentage = (elapsedTime / duration) * 100;
			const numVisibleCubes = Math.floor((percentage / 100) * numCubes);

			cubesContainer.childNodes.forEach((cube, index) => {
				if (index < numVisibleCubes) {
					cube.classList.add("visible");
				} else {
					cube.classList.remove("visible");
				}
			});

			if (elapsedTime >= duration) {
				clearInterval(interval);
			}
		}, 10);

		return progressBar;
	},

	melody(noteIndex) {
		// Génération de la mélodie
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const duration = 0.3;
		const baseFrequency = 216;
		const noteOffset = this.pentatonicBlues[noteIndex]; // Indice de note de la gamme pentatonique

		// Vérifier si la fréquence calculée est valide
		if (noteOffset !== undefined) {
			const frequency = baseFrequency * Math.pow(2, noteOffset / 12);
			const oscillator = audioContext.createOscillator();
			oscillator.type = "sine";
			oscillator.frequency.value = frequency;

			const gainNode = audioContext.createGain();
			const attackTime = 0.01;
			const releaseTime = 0.1;

			gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(
				1,
				audioContext.currentTime + attackTime
			);
			gainNode.gain.linearRampToValueAtTime(
				0,
				audioContext.currentTime + duration - releaseTime
			);

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.start();
			oscillator.stop(audioContext.currentTime + duration);
		}
	},

	getRandomPentatonicOffset() {
		return Math.floor(Math.random() * this.pentatonicBlues.length);
	},

	generateRandomPentatonicMelody() {
		// Génération aléatoire de la mélodie pentatonique
		const melodyMaker = [this.dominanteIndex]; // La première note est la dominante

		for (let i = 1; i < this.numNotes; i++) {
			const previousNoteIndex = melodyMaker[i - 1];
			const pentatonicOffset = this.getRandomPentatonicOffset();
			const noteIndex =
				(previousNoteIndex + pentatonicOffset) % this.pentatonicBlues.length;
			melodyMaker.push(noteIndex);
		}

		this.pentatonicMelody = melodyMaker;
	},

	createPixel(whereis) {
		const pixel = document.createElement("div");
		pixel.className = "pixel";
		pixel.style.left = Math.random() * window.innerWidth + "px";
		pixel.style.top = Math.random() * window.innerHeight + "px";
		pixel.style.animationDuration = Math.random() * 2 + 1 + "s";

		if (whereis.backgroundDisplay) {
			whereis.backgroundDisplay.appendChild(pixel);
			whereis.pixels.push(pixel);

			if (whereis.pixels.length > whereis.maxPixels) {
				whereis.backgroundDisplay.removeChild(whereis.pixels.shift());
			}
		} else {
			console.log("No more pixel");
		}
	},
	generatePixels(numPixels) {
		for (let i = 0; i < this.maxPixels; i++) {
			this.createPixel(this);
		}
	}
};

// Initialisation du jeu
game.run();
