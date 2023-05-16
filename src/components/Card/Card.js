import React from "react";
import './Card.css';

function Card({image}){

    return(
        <section>
            <img className='card' src={image}/>
        </section>
    )
}

export default Card;