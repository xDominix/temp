import { Card, Color, Figure } from "./cards";

export class HandDeck //ex. [card, card, null, null, card]
{
  constructor(size,color,handDeck)//tego nie uzywamy
  {
    this.cards = !handDeck ? getRandomHandCards(size,color) : handDeck.getCards();
  }

  static New(size,color){
    return new HandDeck(size,color,null);
  }

  static Copy(handdeck){
    return new HandDeck(null,null,handdeck);
  }

  //cards
  getCard(id){return this.cards[id];}
  getCards(){return this.cards;}
  isCard(card){return this.cards.filter(a=>a.equal(card)).length !== 0}
  takeOffCardByIndex(index){
    this.cards[index]= null;
    return this;
  }
  isEmpty(){
    return this.cards.filter(a=>a===null).length === this.cards.length;
  }

}

export class TableDeck
{
  constructor(size,handDeck1,handDeck2,tableDeck)
  {
    this.cards = !tableDeck ? getRandomTableCards(size,handDeck1,handDeck2) : this.cards = tableDeck.toArray();
}

  static New(size,handDeck1,handDeck2){
    return new TableDeck(size,handDeck1,handDeck2,null);
  }

  static Copy(tableDeck){
    return new TableDeck(null,null,null,tableDeck);
  }

  getCard(id){return this.cards[id];}
  getCards(){return this.cards;}
}

//local

var getRandomHandCards = function(size,color)
{
  if(size>= Figure.length * Color.length) {console.log("size too high");return [];}

  let res = [];
  let temp;
  while(res.length !== size)
  {
    temp = new Card(getRandomColor(color),getRandomFigure());
    if(res.filter(card=>card.equal(temp)).length===0) res.push(temp);
  }
  return res;
}

var getRandomTableCards = function(size,handDeck1,handDeck2)
{
  if(size>= Figure.length * Color.length) {console.log("size too high");return [];}

  let res = [];
  let prevFigure;
  let temp;
  while(res.length !== size)
  {
    temp = new Card(getRandomColor(c),getRandomFigure(),prevFigure);
    if(res.filter(card=>card.equal(temp)).length===0 && !handDeck1.isCard(temp) && !handDeck2.isCard(temp)) 
    {
      res.push(temp);
      prev = temp.figure;
    }
  }
  return res;
}

//local of local

var getRandomFigure = function () {
  var keys = Object.keys(Figure);
  return Figure[keys[ keys.length * Math.random() << 0]];
};

var getRandomColor = function (color=null) {//red or black colors
  var keys = [Object.keys(Color).filter(key=>color? Color[key]===color:true)];
  return Color[keys[ keys.length * Math.random() << 0]];
};


/* OLD CLASS DECK - maybe willlll be usefull

export class Deck {
    constructor(redDeck,blackDeck) {//custom initialize deck | Deck = FullDeck - deck1 - deck2
      this.cards = [];

      let card;
      for (const color of Object.keys(Color))
      {
        if(color === "Red")
        {
          for (const figure of Object.keys(Figure)) 
          {
            card=new Card(color,figure);
            if(!redDeck.includes(card)) this.cards.push(card);
          }
        }
        else
        {
          for (const figure of Object.keys(Figure)) 
          {
            card=new Card(color,figure);
            if(!blackDeck.includes(card)) this.cards.push(card);
          }
        }
      }
      shuffleArray(this.cards);
    }

    getOneCard()
    {
      return this.cards.pop();
    }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
*/