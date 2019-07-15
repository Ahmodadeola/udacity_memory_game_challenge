//model object of the mvc arch
let data = {
    cards: ["kiwi-bird", "dice", "gem", "keyboard", "coffee", "child", "bus", "bug"],
    movesNo: 0,
    gameTime: 0,
    currentCard: null,
    openedCards: 0,
    // bestTime: localStorage.bestTime || 0,
    // bestMoves: localStorage.bestMoves || 0
};

//controller object of the mvc arch
let alpha = {
    loadCards(){
        let deck = {size: 0}, cardElmContent = [], content, idx;
        let cardsElm = [...view.cards];
        data.cards.forEach(card => deck[card] = 0);
        while(deck.size <= 15){
            idx = Math.random() * 8 >> 0;   //gets a random number between 0 and 6
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
        if(!data.currentCard){
            data.currentCard = elm;
            data.movesNo++;
        }else{
            if(data.currentCard.firstChild.dataset.content === elm.firstChild.dataset.content){
                data.openedCards++;
                elm.style.backgroundColor = "#f06";
                data.currentCard.style.backgroundColor = "#f06";

                data.currentCard.classList.add("match");
                elm.classList.add("match");
                data.currentCard = null;
                data.movesNo++;
                data.openedCards += 2;
            }else{
                elm.classList.add("mismatch");
                data.currentCard.classList.add("mismatch");

                elm.style.backgroundColor = "red";
                data.currentCard.style.backgroundColor = "red";
                data.movesNo++;
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
                alert(`You have won in ${data.movesNo} moves`);
                if (data.bestMoves > data.movesNo) localStorage.bestMoves = data.movesNo;
                if (data.bestTime > data.gameTime) localStorage.bestTime = data.gameTime;

            }            
        }
    },

    resetGame(){
        data.gameTime = 0;
        data.movesNo = 0;
        data.openedCards = 0;
        data.currentCard = null;

        this.loadCards();
    },

    gameMsg(){
        this.msgElm.innerHTML = `You have won in ${data.movesNo} after ${data.gameTime} seconds`;
    },

    updateMovesCount(){

    },
    
    init(){
        view.init();
    }
};

//view object of the mvc arch
let view = {
    init(){
        this.cards = document.querySelectorAll(".card");
        this.msgElm = document.querySelector("p.msg");
        let resetBtn = document.querySelector("i.reset");

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