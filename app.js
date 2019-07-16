//model object stores all data for app
let data = {
    cards: ["kiwi-bird", "dice", "gem", "keyboard", "coffee", "child", "bus", "bug"],
    movesNo: 0,
    gameTime: 0,
    currentCard: null,
    openedCards: 0,
    bestTime: localStorage.bestTime || 0,
    bestMoves: localStorage.bestMoves || 0
};

//alpha is the controller object that acts as the interface between the model and the view
let alpha = {
    loadCards(){
        let deck = {size: 0}, cardElmContent = [], content, idx;
        let cardsElm = [...view.cards];
        data.cards.forEach(card => deck[card] = 0);
        while(deck.size <= 15){
            idx = Math.random() * 8 >> 0;   //gets a random number between 0 and 8
            content = data.cards[idx];      //content is set to data card at index at random number
            deck[content]++;                //increments the number of times the particular card has been generated
            if(deck[content] > 2) continue; //continue while-loop if the generated card has been generated up to 2 times already
            cardElmContent = `<i data-content="${content}" class="fa fa-${content} fa-2x"></i>`;
            cardsElm[deck.size].innerHTML = cardElmContent;     //sets inner html of elm to be the card element that has been generated
            view.closeCard(cardsElm[deck.size]);
            deck.size++;    //increments the deck size property
        }
    },

    cardClick(elm){
        view.openCard(elm);
        if(data.currentCard == elm) return;
        data.movesNo++;
        this.updateMovesCount();
        if(!data.currentCard){
            data.currentCard = elm;
        }else{
            if(data.currentCard.firstChild.dataset.content === elm.firstChild.dataset.content){
                elm.style.backgroundColor = "#f06";
                data.currentCard.style.backgroundColor = "#f06";

                data.currentCard.classList.add("match");
                elm.classList.add("match");
                data.currentCard = null;
                data.openedCards += 2;
                
            }else{
                elm.classList.add("mismatch");
                data.currentCard.classList.add("mismatch");

                elm.style.backgroundColor = "red";
                data.currentCard.style.backgroundColor = "red";
                new Promise(resolve => {
                    setTimeout(() => {
                        elm.classList.remove("mismatch");
                        data.currentCard.classList.remove("mismatch");
                        resolve();
                    }, 350)
                })
                .then(() => {
                    data.currentCard.style.backgroundColor = "rgb(40, 226, 40)";
                    view.closeCard(elm);
                });
            }
            if(data.openedCards == 16){
                    this.gameMsg();
                    if (!localStorage.bestMoves || localStorage.bestMoves > data.movesNo)      localStorage.bestMoves = data.movesNo;
                    if (!localStorage.bestTime || data.bestTime == 0 || localStorage.bestTime > data.gameTime)      localStorage.bestTime = data.gameTime;
                    this.resetGame();
                }
                    
        }
    },

    resetGame(){
        data.gameTime = 0;
        data.movesNo = 0;
        data.openedCards = 0;
        data.currentCard = null;
        this.updateMovesCount();

        this.loadCards();
    },

    gameMsg(){
        view.msgElm.innerHTML = `
        You won in ${data.movesNo} moves after ${data.gameTime} seconds<br>
        best score is ${data.bestMoves} and best time is ${data.bestTime}`;
    },

    updateMovesCount(){
        view.movesElm.innerHTML = `${data.movesNo} Moves`;
    },
    
    init(){
        let gameTime = setInterval(() => {
            data.gameTime++;
            console.log(data.gameTime);
        }, 1000);
        view.init();
    }
};

//view object handles the DOM elements initialization and manipulation 
let view = {
    //Intializes DOM elements required and sets up cards 
    init(){
        this.cards = document.querySelectorAll(".card");
        this.msgElm = document.querySelector("p.msg");
        let resetBtn = document.querySelector("i.reset");
        this.movesElm = document.querySelector("i.moves");

        alpha.loadCards();
        Array.prototype.slice.call(this.cards).forEach(card => {
            card.addEventListener("click", () => {
                alpha.cardClick(card);
            })
        });

        resetBtn.addEventListener("click", () => {
            alpha.resetGame();
        });

    }, 

    openCard(elm){
        elm.firstChild.classList.remove("hide")
        elm.style.backgroundColor = "rgb(40, 226, 40)";
    },

    closeCard(elm){
        elm.firstChild.classList.add("hide");
        elm.style.backgroundColor = "rgba(42, 64, 126, 0.815)";
    },

   
        
};
alpha.init();