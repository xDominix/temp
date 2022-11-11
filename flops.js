export class Flop //ex. [true,false,true,true,false]
{
  constructor(size,isFlip,flop)//tego nie uzywamy
  {
    this.flips = !flop ? new Array(size).fill(isFlip) : flop.getFlips();
  }

  static New(size,isFlip){
    return new Flop(size,isFlip,null);
  }

  static Copy(flop){
    return new Flop(null,null,flop);
  }

  getFlips(){return this.flips;}
  getFlip(index){return this.flips[index]}
  show(index){this.flips[index]=false;return this;}
  showNext(){
    let id = 0;
    while(this.flips[id]===false && this.flips.length!==id)id++;
    if(this.flips.length!==id) this.flips[id]=false;
    return this;
  }
}
