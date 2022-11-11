export class Card {
    constructor(color,figure,prevFigure=null) { 
      this.color = color;
      this.figure = figure;
      this.flipSign = numberToFlipSign(figure - prevFigure);//"","=","^","v"
    }

    equal(card){
      return this.color===card.color && this.figure === card.figure;
    }

    isGreater(card,domColor)
    {
      if(this.figure > card.figure) return true;
      else if(this.figure === card.figure) return this.color===domColor;
      return false;
    }

    toString()
    {
      return figureToString(this.figure) +" of "+ colorToString(this.color);
    }

    toStringColor() { return colorToString(this.color); }
    toStringFigure() { return figureToString(this.figure); }
    toStringFlipSign(){return flipSignToString(this.flipSign);}
}

//rzutowanie - porownaniowo latwe
export const Color = {
    Hearts:"Red",
    Tiles:"Red",
    Clovers:"Black",
    Pikes:"Black",
}

//rzutowanie - porownaniowo latwe
export const Figure = {
    2:2,
    3:3,
    4:4,
    5:5,
    6:6,
    7:7,
    8:8,
    9:9,
    10:10,
    J:11,
    Q:12,
    K:13,
    A:14,
}

//local utilities

const numberToFlipSign =(number)=>{
  if(!number) return "";
  if(number>0)return "^";
  if(number===0)return "=";
  else return "v";
}

const figureToString = (fig)=>{
  switch(fig)
  {
      case Figure[2]: return "2";
      case Figure[3]: return "3";
      case Figure[4]: return "4";
      case Figure[5]: return "5";
      case Figure[6]: return "6";
      case Figure[7]: return "7";
      case Figure[8]: return "8";
      case Figure[9]: return "9";
      case Figure[10]: return "10";
      case Figure.J: return "Jack";
      case Figure.Q: return "Queen";
      case Figure.K: return "King";
      case Figure.A: return "A";
  }
}

const colorToString = (col)=>{
  switch(col)
  {
      case Color.Hearts: return "Hearts";
      case Color.Tiles: return "Tiles";
      case Color.Pikes: return "Pikes";
      case Color.Clovers:return "Clovers";
  }
}

const flipSignToString =(flipSign)=>
{
    switch(flipSign)
    {
        case "^":   return "Up";
        case "=":   return "Eq";
        case "v":   return "Down";
        case "":    return "Flipped";
    }
}
