import '../App.css';
import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        backgroundColor: "#282c34"
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        outline: "none !important"
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

function getSteps() {
    return ['Our Project', 'Our team', 'How you can help us'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return (
                <div>
                    <p>
                        Neurogram is an ambitious art project which started in September 2020.
                        It's linking our brain and emotions to artwork creation using of Artificial Intelligence.
                    </p>
                    Our vision is to firstly <b>record brain activity</b> with dry electrode electroencephalogram (EEG)
                    and <b>classify emotions</b> through a Brain-Computer interface.
                    The second challenge consists in using a Generative Adversarial Network (GAN)
                    to <b>generate original artworks</b> corresponding to the appropriate feelings.
                </div>
            );
        case 1:
            return (
                <div>
                    <p>
                        We are a team of 7 young engineers specialized either in <b>Big Data&AI</b> or in <b>Health&Neurosciences</b>.
                    </p>
                    Our goal is to build a unique experience by bringing together the latest technologies from these fields.
                    <p>
                        We are also mentored by 3 teachers of our school, respectively experts in neurosciences, mathematics and signal processing.
                    </p>
                    Finally, we are helped by the artist collective <a target="_blank" href="https://obvious-art.com/">Obvious Art</a>, one of the pioneer in linking AI with artistic creation.
                </div>
            );
        case 2:
            return (
                <div>
                    <p>
                        The key factor in any AI-oriented project is the amount of exploitable data to train the various algorithms.
                    </p>
                    <p>
                        Our generative network needs to be trained on the biggest amount of existing artwork to produce quality results.
                        We currently use the open-source database WikiArt which contains over 100,000 paintings ! Shoud be enough right ?
                    </p>
                    <p>
                        Unfortunately, as we are working with feelings, we have to link artworks with a range of emotion to train our
                        neural network to produce coherent pieces.
                    </p>
                    <h5 style={{color: "#007bff"}}>That's why we need you !</h5>
                    <p>
                        By choosing between 3 ranges of emotions (negative, neutral and positive) on a few existing paintings,
                        you are playing a crucial role in the making of Neurogram ! From the votes of many people, we'll be able to be
                        even more precise and objective.
                    </p>
                    <p>Thank you for your interest and your participation !</p>
                </div>
            );
    }
}

export default function About({ returnToMenu }) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === steps.length - 1) returnToMenu()
    };

    const handleClick = (index) => {
        console.log(index)
        setActiveStep(index);
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical" style={{ backgroundColor: "#282c34" }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel onClick={() => handleClick(index)}>{label}</StepLabel>
                        <StepContent>
                            <Typography style={{ color: "white" }}>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Home' : 'Next'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}