import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  stepper: {
      paddingLeft: "10px",
      paddingRight: "10px"
  }
}));

export default function VerticalStepper(props) {
    const classes = useStyles();
    
    const getSteps = () => {
        return props.steps;
    }
    
    const steps = getSteps();

    const getStepContent = (step) => {
        if(props.getStepContent) {
            return props.getStepContent(step);
        }
        return "Pending";
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={props.activeStep} orientation="vertical" className={classes.stepper}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        { getStepContent(index) && 
                            <StepContent>
                                <Typography>{getStepContent(index)}</Typography>
                            </StepContent>
                        }
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}
