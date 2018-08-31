import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { CheckRounded, ArrowUpwardRounded, ArrowDownwardRounded, TransitEnterexitRounded } from '@material-ui/icons';
import { Badge } from '@material-ui/core';

const styles = {
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function getSteps() {
  return [
    'Pick time the retro meeting should end',
    'Check finished action items',
    'Pick facilitator'
  ];
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      activeStep: 0,
      members: [],
      facilitator: null,
      board: null,
      boards: [],
      endTime: "17:00",
    };
  }

  componentWillMount() {
    fetch("http://localhost:8080/api/members")
      .then(resp => resp.json())
      .then(data => {
        let members = data._embedded.members;
        if (members.length > 0) {
          this.setState({
            members,
          });
        }
      });

    fetch('http://localhost:8080/api/boards')
      .then(resp => resp.json())
      .then(data => {
        let boards = data._embedded.boards;
        let board = boards[0];
        this.setState({ boards, board });
      });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNextStep = () => {
    if (this.state.activeStep === 0) {
      console.log("time stap", this.state.endTime);
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleRandomFacilitator() {
    let upLimit = this.state.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.setState({
      facilitator: this.state.members[randomIndex],
    })
  }

  handlePickFacilitator(idx, event) {
    this.setState({
      facilitator: this.state.members[idx],
    });
  }

  handleChangeEndTime(event) {
    this.setState({
      endTime: event.target.value,
    });
  }

  handleStartBoard() {
    let board = {
      member: this.state.facilitator._links.self.href,
      started: true,
      // endTime: this.state.endTime,
    }
    if (this.state.board) {
      fetch(this.state.board._links.self.href, {
        method: 'PATCH',
        body: JSON.stringify(board),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          console.log("failed to start board")
        }
      }).then(data => {
        this.handleClose();
        this.setState({
          board: data,
        })

      });
    }
  }

  getStepContent(step, members) {
    switch (step) {
      case 0:
        return (
          <form noValidate>
            <TextField id="endTime" type="time"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 900 }}
              value={this.state.endTime}
              onChange={this.handleChangeEndTime.bind(this)}
            />
          </form>);
      case 1:
        return (
          <Grid style={{ paddingTop: 20 }} container justify="space-between" spacing={32}>
            {members.map(member => (member.actionCount > 0 && (
              <Grid item xs={4} key={"action" + member.userID}>
                <List>
                  {member.actions.map((action, idx) => (
                    <ListItem divider key={"action" + action.title} dense button >
                      <Avatar style={{ marginLeft: -15 }}>
                        {idx === 0 && member.userID}
                      </Avatar>
                      <ListItemText primary={action.title} />
                      <ListItemSecondaryAction>
                        <Checkbox />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>)
            ))}
          </Grid>
        );
      case 2:
        return (
          <div>
            <div>
              <Button variant="contained" color="primary"
                onClick={this.handleRandomFacilitator.bind(this)}
              >Random</Button>
            </div>
            <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            <Grid justify="flex-start" style={{}} container spacing={16}>
              {members.map((member, idx) => (
                <Grid key={"facilitator" + member.userID} item>
                  <IconButton onClick={this.handlePickFacilitator.bind(this, idx)} >
                    {this.state.facilitator && this.state.facilitator.userID === member.userID ? (
                      <Badge badgeContent={<TransitEnterexitRounded />}>
                        <Avatar>{member.userID}</Avatar>
                      </Badge>
                    ) : (<Avatar>{member.userID}</Avatar>)}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </div >
        );
      default:
        return 'Unknown step';
    }
  }

  render() {
    const { activeStep, members, facilitator, board } = this.state;
    const steps = getSteps();
    return (
      <div>
        <Board members={members} selectedMember={facilitator} board={board} />

        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: 'relative', }}>
            <Toolbar>
              <Typography variant="title" color="inherit" style={{ flex: 1 }} >
                New Retro Board
              </Typography>
              <Button color="inherit" onClick={this.handleClose} >
                Skip
              </Button>
            </Toolbar>
          </AppBar>

          <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                      <StepContent>
                        {this.getStepContent(index, members)}
                        <div style={{ paddingTop: 20 }} >
                          <IconButton disabled={activeStep === 0} onClick={this.handleBack}>
                            <ArrowUpwardRounded />
                          </IconButton>
                          {(activeStep === steps.length - 1) ? (
                            <IconButton disabled={facilitator === null} variant="contained" color="primary" onClick={this.handleStartBoard.bind(this)}>
                              <CheckRounded />
                            </IconButton>
                          ) : (
                              <IconButton variant="contained" color="primary" onClick={this.handleNextStep}>
                                <ArrowDownwardRounded />
                              </IconButton>
                            )}
                        </div>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
