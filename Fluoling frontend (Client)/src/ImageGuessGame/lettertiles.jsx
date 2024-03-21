import React from 'react';

function LetterTile({ letter, isGuessed }) {

    return (

        <div className="letterTile">
            {isGuessed ? letter : ' '}
        </div>

    );

}

export default LetterTile;