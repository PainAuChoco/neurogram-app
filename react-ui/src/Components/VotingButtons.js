import '../App.css';
import React from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export default function VotingButtons({ callbackClick }) {

    const handleClick = (vote) => {
        callbackClick(vote)
    }

    return (
        <div id="votingButtons" className="mt-2">
            <ButtonGroup size="small">
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Anger")} value="Anger">Anger</Button>
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Fear")} value="Fear">Fear</Button>
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Sad")} value="Sad">Sad</Button>
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Calm")} value="Calm">Calm</Button>
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Optimism")} value="Optimism">Optimism</Button>
                <Button className="voteBtn noOutline" variant="contained" color="primary" onClick={() => handleClick("Happiness")} value="Happiness">Happiness</Button>
            </ButtonGroup>
        </div>
    )
}