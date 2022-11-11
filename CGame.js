import React  from 'react';
import { useLocation } from 'react-router';
import { HandDeck, TableDeck} from '../models/decks';
import Vs from '../mini-components/vs';
import { useState } from 'react';
import { useContext } from 'react';
import { GameSetContext } from '../context/GameSetContext';
import { useEffect } from 'react';
import GameStatus from '../mini-components/gamestatus';
import { CHand, CMyHand, CTable } from '../components/CHand';
import {Flop} from '../models/flops'
import { GameType } from '../models/game';
import {Timer} from '../mini-components/timer'

const CGame = () => {

    //phases: ready-startround-accept-endround
    
    const {state} = useLocation();
    const {getGame} = useContext(GameSetContext);
    const {chargeBalance} = useContext(AccountContext);
    //
    const { gameId, myColor,playersDelta } = state;
    const game = getGame(gameId);
    //
    const [myHandDeck,setMyHandDeck] = useState(null);
    const [opHandDeck,setOpHandDeck] = useState(null);
    const [tableDeck,setTableDeck] = useState(null);
    const [myFlop,setMyFlop] = useState(null);//useless troche ale no.
    const [opFlop,setOpFlop] = useState(null);
    const [tableFlop,setTableFlop] = useState(null);

    const [isAcceptable,setIsAcceptable] = useState(false);
    var myAcceptedIndex = null;
    var opAcceptedIndex = null;
    var myAccept = false;
    var opAccept = false;
    var opSimulation;

    const [isTimerActive,setIsTimerActive] = useState(false);
    const [maxTimerTime,setMaxTimerTime] = useState(null);  
    var handleTimerEnd;//function

    const [gameStatus,setGameStatus]=useState([]);//true -myWin, false, opWin
    const [tableHands,setTableHands]=useState([]);
    
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setIsAcceptable(true);//op player join

            const timeout2 = setTimeout(()=>{OpReady()},1000*(3+getRandom(3)));//op player ready (3-5s)
            return ()=>clearTimeout(timeout2);

        },1000*getWaitingTime(playersDelta));
        return ()=>clearTimeout(timeout);
    },[]);

    const IReady = ()=>{ 
        setMyHandDeck(HandDeck.New(game.handDeckSize,myColor)); 
        setMyFlop(Flop.New(game.handDeckSize,true));
        TryAllReady();
    }
    const OpReady = ()=>{
        setOpHandDeck(HandDeck.New(game.handDeckSize,myColor==="red"?"black":"red")); 
        setOpFlop(Flop.New(game.handDeckSize,game.type===GameType.OpenCards));
        TryAllReady();
    }
    const TryAllReady = ()=>{
        if(myHandDeck && opHandDeck)
        {
            setTableDeck(TableDeck.New(game.tableDeckSize,myHandDeck,opHandDeck)); 
            setTableFlop(Flop.New(game.tableDeckSize,true));
    
            chargeBalance(-game.enterPrice);//ACCOUNT
    
            startRound();
        }
    };

    const handleOnAccept=(index)=>{
        if(!myHandDeck) IReady();
        else 
        {
            myAcceptedIndex = index;
            myAccept = true;
            tryEndRound();
        }

        setIsAcceptable(false);
    }

    const startRound =()=>{
        simulateOp();
        setIsAcceptable(true);
        restartTimer(()=>{
            setIsTimerActive(false);
            clearInterval(opSimulation);
            tryEndRound(true);
        }, game.roundTime );
    }
    const tryEndRound = (force=false)=>{

        if((myAccept && opAccept) || force)
        {
            restartTimer(()=>{

                //wymusza akceptujace karty
                if(!game.noCardAccept)
                {
                    if(!myAcceptedIndex)myAcceptedIndex = getMyAcceptedIndexRandom();
                    if(!opAcceptedIndex)opAcceptedIndex = getOpAcceptedIndexRandom(noCardAccept);
                }

                //pokazuje karte oponenta
                if(opAcceptedIndex) setOpFlop(Flop.Copy(opFlop).show(opAcceptedIndex))
                
                //dodaje do tableHands

                //dodaje do gameStatus

                //calculate results

                //zerowanko
                myAcceptedIndex = null;
                opAcceptedIndex = null;
                myAccept = false;
                opAccept = false;

                //jesli to byla ostatnia to...
            },5);
        }
        else
        {
            setMaxTimerTime(game.roundTime/2);
        }
    }

    const simulateOp = ()=>{
        opSimulation = setInterval(()=>{
            if((myAccept && getRandom(3)===1) || getRandom(game.roundTime/5)===1)// przez 5 bo 5 sekund
            {
                opAcceptedIndex = getOpAcceptedIndexRandom(game.noCardAccept);
                opAccept=true;
                tryEndRound() === //to jakos dziwnie wyglada, czemu oponent sie pyta ze zakonczyc, to gra powinna robic automatycznie, staty trzeba rozwazyc
            }
        },5);
    }

    const restartTimer = (handler,time)=>{
        setIsTimerActive(false);
        setMaxTimerTime(time);
        setIsTimerActive(true);
        handleTimerEnd = handler;
    }

    const getMyAcceptedIndexRandom=(nullable=false)=>{
        //todo
    }

    const getOpAcceptedIndexRandom=(nullable)=>{
        //todo
    }

    return ( 
        <div className='fade' style={{display:"flex"}}>
            <div>
                <h2>{game.name}</h2>
                <GameStatus bids={game.bids} gameStatus={gameStatus}/>
                <Vs setUp={isOpPresent?true:false} setDown />
                <Timer maxtime={maxTimerTime} isActive={isTimerActive} onEnd={handleTimerEnd}/>
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
                <CHand initSize={game.handDeckSize} handDeck={opHandDeck} flop={opFlop}/>
                <CTable initSize={game.tableDeckSize} tableDeck={tableDeck} flop={tableFlop} tableHands={tableHands}/>
                <CMyHand initSize={game.handDeckSize} handDeck={myHandDeck} flop={myFlop} isAcceptable={isAcceptable} noCardAccept={game.noCardAccept} onAccept={(index)=> handleOnAccept(index)}/>
            </div>
        </div>
        
     );
}

export default CGame;

//local

const getWaitingTime= (playersDelta)=>{ //in seconds

    if(playersDelta>=0)return 3+getRandom(3);//3-5s
    
    if(playersDelta>=-10)return 6+getRandom(5);//6-10s

    if(playersDelta>=-20)return 10+getRandom(6);//10-15s

    return 15+getRandom(6);//15s-20s

}

const getRandom =(range)=>{//return number between 0 - (range-1)
    return Math.floor(Math.random()*range);
}