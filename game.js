export class Game {
  constructor(id,name,type,bids,minXp,roundTime=30) {

    this.id = id;
    this.name = name;
    this.type = type;
    this.bids = bids;
    this.enterPrice = bids.reduce((a, b) => a + b, 0)/2;
    this.minXp = minXp;

    this.roundTime= roundTime;//in seconds, must be odd number

    this.noCardAccept = false;
    this.handDeckSize = 5;//1-10
    this.tableDeckSize = 5;//1-10
    
  }
}

export const GameType = {
  HiddenCards:"HIDDEN",
  OpenCards:"OPEN",
};