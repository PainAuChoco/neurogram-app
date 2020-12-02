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
                <div>project</div>
            );
        case 1:
            return (
                <div>team</div>
            );
        case 2:
            return (
                <div>help</div>
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