import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
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

import Utils from '../Utils';


const styles = theme => ({
});

function getSteps() {
  return [
    'Pick a team',
    'Pick time the retro meeting should end',
    'Check finished action items',
    'Pick facilitator'
  ];
}

class NewBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      activeStep: 0,
      members: [],
      facilitator: null,
      newBoard: {},
      boards: [],
      teams: [],
      team: null,
      endTime: "17:00",
    };
  }

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


  updateFacilitator(idx) {
    let newBoard = this.state.newBoard;
    newBoard.facilitator = this.props.members[idx]._links.self.href;
    this.setState({ newBoard });
  }

  handleFacilitatorRandomPick() {
    let upLimit = this.props.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.updateFacilitator(randomIndex);
  }

  handleFacilitatorPick(idx) {
    this.updateFacilitator(idx);
  }

  handleTeamPick(idx) {
    let newBoard = this.state.newBoard;
    newBoard.team = this.props.teams[idx]._links.self.href;
    this.setState({ newBoard });
  }

  getDate() {
    let now = new Date();
    let numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleBoardEndTimeChange(event) {
    console.log("updated end time:", event.target.value);
    this.setState({
      endTime: event.target.value,
    });
  }

  handleBoardStart() {
    let newBoard = this.state.newBoard;
    newBoard.endTime = this.getDate();
    newBoard.started = true;

    Utils.postResource("boards", newBoard, (body => {
      console.log("posted board", body);
      this.props.updateSelectedBoard();
    }));
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

  getStepContent(step, members, teams, newBoard) {
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
                    {newBoard.team && newBoard.team === team._links.self.href ? (
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
                    <ListItem divider key={"actionToCheck" + action.id} dense button >
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
                  {newBoard.facilitator && newBoard.facilitator === member._links.self.href ? (
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
    const { members, teams } = this.props;
    const { activeStep, newBoard } = this.state;
    const steps = getSteps();

    return (<div>{members && teams && (
      <div>
        <AppBar style={{ position: 'relative', }}>
          <Toolbar>
            <Typography variant="title" color="inherit" style={{ flex: 1 }} >
              New Retro Board
            </Typography>
            <Button color="inherit" onClick={this.props.updatePage} >Skip</Button>
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
                      {this.getStepContent(index, members, teams, newBoard)}
                      <div style={{ paddingTop: 20 }} >
                        <IconButton disabled={activeStep === 0} onClick={this.handleStepBack}>
                          <ArrowUpwardRounded />
                        </IconButton>
                        {(activeStep === 0) && (
                          <IconButton disabled={newBoard.team === null} variant="contained" color="primary" onClick={this.handleStepNext}>
                            <ArrowDownwardRounded />
                          </IconButton>
                        )}
                        {(activeStep === 1 || activeStep === 2) && (
                          <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
                            <ArrowDownwardRounded />
                          </IconButton>
                        )}
                        {(activeStep === 3) && (
                          <IconButton disabled={newBoard.facilitator === null} variant="contained" color="primary"
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
      </div>
    )}</div>
    );
  }
}

NewBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(NewBoard);
