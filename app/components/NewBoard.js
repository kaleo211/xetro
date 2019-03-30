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
import Fab from '@material-ui/core/Fab';

import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CheckRounded,
  Casino,
} from '@material-ui/icons';


import { postBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import { setGroup } from '../actions/groupActions';
import { Paper } from '@material-ui/core';


const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
});

function getSteps() {
  return [
    'Set End Time of Xetro Meeting',
    'Check Finished Action Items',
    'Choose a Facilitator'
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
      endTime: "17:00",
    };
  }

  handleStepNext = () => {
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
    let upLimit = this.props.group.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.setState({
      facilitator: this.props.group.members[randomIndex],
    })
  }

  handleSetFacilitator(idx) {
    this.setState({
      facilitator: this.props.group.members[idx],
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

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  handleCreateBoard() {
    let now = new Date();
    let boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;

    let newBoard = this.state.newBoard;
    newBoard.endTime = this.getDate();
    newBoard.stage = 'active';
    newBoard.groupId = this.props.group.id;
    newBoard.name = boardName;
    newBoard.facilitatorId = this.state.facilitator.id;

    this.props.postBoard(newBoard);
    this.props.setPage('board');
  }

  getStepContent(step, members, facilitator) {
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
          <Grid style={{ paddingTop: 20 }} container justify="flex-start" spacing={32}>
            {members.filter(m => m.actions && m.actions.filter(a => !a.finished).length > 0).map(member => (
              <Grid item xs={12} md={6} lg={4} key={"action" + member.userId}>
                <List>
                  {member.actions && member.actions.map((action) => (!action.finished &&
                    <ListItem divider key={"actionToCheck" + action.id} dense button >
                      <Avatar style={{ marginLeft: -15 }}>
                        {member.userId}
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
          <Grid container justify="flex-start" spacing={16}>
            <Grid item style={{ paddingTop: 12, paddingLeft: 24 }}>
              <Tooltip title="Random pick" placement="left">
                <Fab size="small" color="primary" onClick={this.handleFacilitatorRandomPick.bind(this)}>
                  <Casino />
                </Fab>
              </Tooltip>
            </Grid>
            {members.map((member, idx) => (
              <Grid item key={"facilitator" + member.userId} >
                <Fab size="small" onClick={this.handleSetFacilitator.bind(this, idx)} >
                  <Avatar>{member.firstName}</Avatar>
                </Fab>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  }

  getStepButton(step, facilitator) {
    return (<div>
      <IconButton disabled={step === 0} onClick={this.handleStepBack}>
        <ArrowUpwardRounded />
      </IconButton>
      {(step === 0 || step === 1) && (
        <IconButton variant="contained" color="primary" onClick={this.handleStepNext}>
          <ArrowDownwardRounded />
        </IconButton>
      )}
      {(step === 2) && (
        <IconButton disabled={facilitator === null} variant="contained" color="primary"
          onClick={this.handleCreateBoard.bind(this)}>
          <CheckRounded />
        </IconButton>
      )}
    </div>)
  }

  render() {
    const { group, classes } = this.props;
    const { activeStep, facilitator } = this.state;
    const steps = getSteps();

    return (group &&
      <Paper>
        <Grid container justify="flex-end" className={classes.root}>
          <Grid item xs={11}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => {
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {this.getStepContent(index, group.members, facilitator)}
                      <div style={{ paddingTop: 20 }} >
                        {this.getStepButton(index, facilitator)}
                      </div>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  group: state.groups.group
});
const mapDispatchToProps = (dispatch) => {
  return {
    postBoard: (board) => dispatch(postBoard(board)),
    setGroup: (id) => dispatch(setGroup(id)),
    setPage: (page) => dispatch(setPage(page)),
    finishItem: (item) => dispatch(finishItem(item)),
  };
};

NewBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(NewBoard);
