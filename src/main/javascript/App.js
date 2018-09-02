import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CheckRounded,
  TransitEnterexitRounded,
  Casino,
} from '@material-ui/icons';

import Utils from './components/Utils';

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
    console.log("fetching members");
    Utils.fetchResource("members", (data => {
      let members = data._embedded.members;
      if (members.length > 0) {
        console.log("updated members:", members);
        this.setState({ members });
      }
    }))

    console.log("fetching boards");
    Utils.fetchResource("boards", (data => {
      let boards = data._embedded.boards;
      if (boards.length > 0) {
        let board = boards[0];
        this.setState({ boards, board });
      }
    }))
  }

  handleSetupPageClose = () => {
    this.setState({ open: false });
  };

  handleStepNext = () => {
    if (this.state.activeStep === 0) {
      console.log("time stap", this.state.endTime);
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleStepBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleFacilitatorRandomPick() {
    let upLimit = this.state.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.setState({
      facilitator: this.state.members[randomIndex],
    })
  }

  handleFacilitatorPick(idx) {
    this.setState({
      facilitator: this.state.members[idx],
    });
  }

  handleBoardEndTimeChange(event) {
    console.log("updated end time:", event.target.value);
    this.setState({
      endTime: event.target.value,
    });
  }

  getDate() {
    let now = new Date();
    let numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleBoardStart() {
    if (this.state.board) {
      let link = this.state.facilitator._links.self.href;
      let board = {
        facilitator: link,
        selected: link,
        started: true,
        endTime: this.getDate(),
      };

      console.log("starting board");
      Utils.patchResource(this.state.board, board, (body => {
        this.setState({
          board: body,
        });
        this.handleSetupPageClose();
      }));
    }
  }

  handleActionCheck(action) {
    let updatedAction = { finished: true }
    Utils.patchResource(action, updatedAction, (() => {
      Utils.fetchResource("members", (body => {
        console.log("updated members:", body);
        this.setState({ members: body._embedded.members });
      }));
    }));
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
              onChange={this.handleBoardEndTimeChange.bind(this)}
            />
          </form>
        );
      case 1:
        return (
          <Grid style={{ paddingTop: 20 }} container justify="space-between" spacing={32}>
            {members.filter(m => m.actions.filter(a => !a.finished).length > 0).map(member => (
              <Grid item xs={12} md={6} lg={4} key={"action" + member.userID}>
                <List>
                  {member.actions.map((action, idx) => (!action.finished &&
                    <ListItem divider key={"action" + action._links.self.href} dense button >
                      <Avatar style={{ marginLeft: -15 }}>
                        {member.userID}
                      </Avatar>
                      <ListItemText primary={action.title} />
                      <ListItemSecondaryAction onClick={this.handleActionCheck.bind(this, action)}>
                        <IconButton><CheckRounded /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <div>
            <Grid container justify="flex-start" spacing={16}>
              <Grid item style={{ paddingTop: 12, paddingLeft: 24 }}>
                <Tooltip title="Random pick" placement="left">
                  <Button mini variant="fab" color="primary" onClick={this.handleFacilitatorRandomPick.bind(this)}>
                    <Casino />
                  </Button>
                </Tooltip>
              </Grid>

              {members.map((member, idx) => (
                <Grid item key={"facilitator" + member.userID} >
                  <IconButton onClick={this.handleFacilitatorPick.bind(this, idx)} >
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
        <Board members={members} board={board} />

        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleSetupPageClose}
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: 'relative', }}>
            <Toolbar>
              <Typography variant="title" color="inherit" style={{ flex: 1 }} >
                New Retro Board
              </Typography>
              <Button color="inherit" onClick={this.handleSetupPageClose} >
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
                          <IconButton disabled={activeStep === 0} onClick={this.handleStepBack}>
                            <ArrowUpwardRounded />
                          </IconButton>
                          {(activeStep === 0) && (
                            <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
                              <ArrowDownwardRounded />
                            </IconButton>
                          )}
                          {(activeStep === 1) && (
                            <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
                              <ArrowDownwardRounded />
                            </IconButton>
                          )}
                          {(activeStep === 2) && (
                            <IconButton disabled={facilitator === null} variant="contained" color="primary"
                              onClick={this.handleBoardStart.bind(this)}>
                              <CheckRounded />
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
