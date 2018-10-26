import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

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
import Tooltip from '@material-ui/core/Tooltip';

import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CheckRounded,
  TransitEnterexitRounded,
  Casino,
} from '@material-ui/icons';


import { postBoard } from '../actions/boardActions';
import { showPage } from '../actions/localActions';
import { patchAction } from '../actions/itemActions';
import { selectTeam } from '../actions/teamActions';


const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
});

function getSteps() {
  return [
    'Put a name',
    'Pick time the retro meeting should end',
    'Check finished action items',
    'Pick facilitator'
  ];
}

class NewBoard extends React.Component {
  constructor(props) {
    super(props);

    let now = new Date();
    let boardName = now.getMonth() + "-" + now.getDate() + "-" + now.getFullYear();

    this.state = {
      open: true,
      activeStep: 0,
      members: [],
      facilitator: null,
      newBoard: {},
      boards: [],
      endTime: "17:00",
      name: boardName,
    };
  }

  handleStepNext = () => {
    if (this.state.activeStep === 0) {
      console.log("NewBoard# time stap", this.state.endTime);
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
    let upLimit = this.props.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.setState({
      facilitator: this.props.members[randomIndex],
    })
  }

  handleFacilitatorPick(idx) {
    this.setState({
      facilitator: this.props.members[idx],
    })
  }

  getDate() {
    let now = new Date();
    let numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleBoardEndTimeChange(event) {
    this.setState({
      endTime: event.target.value,
    });
  }

  handleBoardNameChange(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleActionCheck(action) {
    this.props.patchAction("actions/" + action.id, { finished: true })
      .then(() => {
        this.props.selectTeam(this.props.team.id);
      });
  }

  handleBoardCreate() {
    let newBoard = this.state.newBoard;
    newBoard.endTime = this.getDate();
    newBoard.started = true;
    newBoard.team = this.props.team._links.self.href;
    newBoard.name = this.state.name;
    newBoard.facilitator = this.state.facilitator._links.self.href;

    this.props.postBoard(newBoard);
    this.props.showPage("board");
  }

  getStepContent(step, members, facilitator) {
    switch (step) {
      case 0:
        return (
          <TextField
            autoFocus
            value={this.state.name}
            onChange={this.handleBoardNameChange.bind(this)}
          />
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
            {members.filter(m => m.actions && m.actions.filter(a => !a.finished).length > 0).map(member => (
              <Grid item xs={12} md={6} lg={4} key={"action" + member.userID}>
                <List>
                  {member.actions && member.actions.map((action) => (!action.finished &&
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
                  {facilitator && facilitator.id === member.id ? (
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
    const { members, classes } = this.props;
    const { activeStep, facilitator } = this.state;
    const steps = getSteps();

    return (members && (
      <Grid container className={classes.root}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {this.getStepContent(index, members, facilitator)}
                    <div style={{ paddingTop: 20 }} >
                      <IconButton disabled={activeStep === 0} onClick={this.handleStepBack}>
                        <ArrowUpwardRounded />
                      </IconButton>
                      {(activeStep === 0 || activeStep === 1 || activeStep === 2) && (
                        <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
                          <ArrowDownwardRounded />
                        </IconButton>
                      )}
                      {(activeStep === 3) && (
                        <IconButton disabled={facilitator === null} variant="contained" color="primary"
                          onClick={this.handleBoardCreate.bind(this)}>
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
    ));
  }
}

const mapStateToProps = state => ({
  members: state.teams.members,
  team: state.teams.team
});
const mapDispatchToProps = (dispatch) => {
  return {
    postBoard: (board) => dispatch(postBoard(board)),
    patchAction: (a, action) => dispatch(patchAction(a, action)),
    selectTeam: (id) => dispatch(selectTeam(id)),
    showPage: (page) => dispatch(showPage(page)),
  };
};

NewBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(NewBoard);
