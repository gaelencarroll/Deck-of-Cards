import React, { useEffect, useState, useRef } from "react";
import './Deck.css';
import Card from '../Card/Card';
import axios from 'axios';

const deckURL = "http://deckofcardsapi.com/api/deck";


function Deck(){
    const [deck, setDeck] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);
    
    useEffect( () => {
        async function getData(){
            let newDeck = await axios.get(`${deckURL}/new/shuffle`);
            setDeck(newDeck.data);
        }
        getData();
    }, [setDeck])

    useEffect( () => {
        async function grabCard() {
            let {deck_id} = deck;

            try{
                let grabbedCard = await axios.get(`${deckURL}/${deck_id}/draw/`)

                if (grabbedCard.data.remaining === 0){
                    setAutoDraw(false);
                    throw new Error('no cards left!')
                }

                const card = grabbedCard.data.cards[0]; 

                setDrawnCards( deck => [...deck, {
                    id: card.code,
                    image: card.image,
                }])
            }catch(err) {
                alert(err)
            }
            
        }
        if(autoDraw && !timerRef.current){
            timerRef.current = setInterval(async () => {
                await grabCard();
            },1000)
        }
        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [autoDraw,setAutoDraw,deck])

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto)
    }

    const allCards = drawnCards.map(card => (
        <Card image={card.image} key={card.key}></Card>
    ))

    return(
        <section>
            { deck ? 
            (
                <button className='autoDrawBtn' onClick={toggleAutoDraw}>{autoDraw ? "Stop" : "Keep"} Drawing!</button>
            ) 
            : null }
            <section className="deck">{allCards}</section>
        </section>
    )

}

export default Deck;