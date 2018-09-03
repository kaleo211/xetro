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
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

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
    'Pick a team',
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
      teams: [],
      team: null,
      endTime: "17:00",
    };
  }

  componentWillMount() {
    console.log("fetching members");
    Utils.fetchResource("members", (body => {
      let members = body._embedded.members;
      if (members.length > 0) {
        console.log("updated members:", members);
        this.setState({ members });
      }
    }));

    console.log("fetching boards");
    Utils.fetchResource("boards", (body => {
      let boards = body._embedded.boards;
      if (boards.length > 0) {
        let board = boards[0];
        let team = board.team;
        this.setState({ boards, board, team });
      }
    }));

    Utils.fetchResource("teams", (body => {
      let teams = body._embedded.teams;
      if (teams.length > 0) {
        console.log("updated teams:", teams);
        this.setState({ teams });
      }
    }));
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
    });
  }

  handleFacilitatorPick(idx) {
    this.setState({
      facilitator: this.state.members[idx],
    });
  }

  handleTeamPick(idx) {
    this.setState({
      team: this.state.teams[idx],
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
        team: this.state.team._links.self.href,
        endTime: this.getDate(),
      };

      Utils.patchResource(this.state.board, board, (body => {
        console.log("starting board", body);
        let board = Utils.reformBoard(body);
        this.setState({ board });
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

  getStepContent(step, members, teams) {
    switch (step) {
      case 0:
        return (
          <Grid container justify="flex-start" spacing={16}>
            <Grid item>
              <List>
                {teams.map((team, idx) => (
                  <ListItem divider dense button
                    key={"team" + team.name}
                    onClick={this.handleTeamPick.bind(this, idx)}
                  >
                    {this.state.team && this.state.team.name === team.name ? (
                      <Badge badgeContent={<TransitEnterexitRounded />}>
                        <Avatar>{team.name}</Avatar>
                      </Badge>
                    ) : (<Avatar>{team.name}</Avatar>)}
                    <ListItemText primary={team.name} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        )
      case 1:
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
      case 2:
        return (
          <Grid style={{ paddingTop: 20 }} container justify="flex-start" spacing={32}>
            {members.filter(m => m.actions.filter(a => !a.finished).length > 0).map(member => (
              <Grid item xs={12} md={6} lg={4} key={"action" + member.userID}>
                <List>
                  {member.actions.map((action) => (!action.finished &&
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
      case 3:
        return (
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
        );
      default:
        return 'Unknown step';
    }
  }

  render() {
    const { activeStep, members, facilitator, board, teams } = this.state;
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
                        {this.getStepContent(index, members, teams)}
                        <div style={{ paddingTop: 20 }} >
                          <IconButton disabled={activeStep === 0} onClick={this.handleStepBack}>
                            <ArrowUpwardRounded />
                          </IconButton>
                          {(activeStep === 0) && (
                            <IconButton disabled={this.state.team === null} variant="contained" color="primary" onClick={this.handleStepNext}>
                              <ArrowDownwardRounded />
                            </IconButton>
                          )}
                          {(activeStep === 1 || activeStep === 2) && (
                            <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
                              <ArrowDownwardRounded />
                            </IconButton>
                          )}
                          {(activeStep === 3) && (
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
