import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { FlightTakeoffOutlined, NearMeRounded, MoodRounded, CasinoOutlined, CheckRounded } from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { Paper, Avatar, Grid, Stepper, StepButton, Step, StepConnector, Badge, TextField } from '@material-ui/core';

import { setGroup } from '../actions/groupActions';
import { setBoard, postBoard, fetchGroupActiveBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import BoardList from './BoardList';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  divider: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
  iconButton: {
    padding: 0,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newBoard: {},
      timer: 60,
      facilitator: null,
      happy: false,
    };
  }

  async componentDidMount() {
    await this.props.fetchGroupActiveBoard(this.props.group.id);

    let activeBoard = this.props.activeBoard;
    console.log("active board:", activeBoard);
    if (activeBoard) {
      this.setState({
        facilitator: activeBoard.facilitator,
        timer: activeBoard.timer,
      });
    }
  }

  handleJoinBoard() {
    this.props.setBoard(this.props.activeBoard.id);
    this.props.setPage('board');
  }

  handleCreateBoard() {
    let now = new Date();
    let boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;

    let newBoard = this.state.newBoard;
    newBoard.stage = 'active';
    newBoard.groupId = this.props.group.id;
    newBoard.name = boardName;
    newBoard.timer = this.state.timer;
    newBoard.facilitatorId = this.state.facilitator.id;

    this.props.postBoard(newBoard);
    this.props.setPage('board');
  }

  handleSetTimer(evt) {
    this.setState({
      timer: evt.target.value,
    })
  }

  handleRandomSelectFacilitator() {
    let upLimit = this.props.group.members.length;
    let randomIndex = Math.floor(Math.random() * (upLimit));
    this.setState({
      facilitator: this.props.group.members[randomIndex],
    })
  }

  handleSetFacilitator(member) {
    this.setState({
      facilitator: member,
    })
  }

  getDate() {
    let now = new Date();
    let numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleThroughActions() {
    this.setState({ happy: true });
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { group, activeBoard, classes } = this.props;
    const { facilitator, happy, timer } = this.state;

    const members = group.members;
    let readyToTakeOff = timer && facilitator && happy;

    console.log('members:', members);

    return (
      <div>
        <Paper className={classes.paper}>
          {activeBoard ?
            <Grid container direction="row" alignItems="center">
              <Grid item md={2}>
                <Typography variant="h6">Join Ongoing Board</Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={this.handleJoinBoard.bind(this)}>
                  <FlightTakeoffOutlined />
                </IconButton>
              </Grid>
            </Grid> :
            <Grid container direction="row" alignItems="center">
              <Grid item md={2}>
                <Typography variant="h6">Create New Board</Typography>
              </Grid>
              <Grid item>
                <Stepper nonLinear connector={<StepConnector />}>
                  <Step>
                    <StepButton completed={true} onClick={this.handleSetTimer}>
                      Set Timer
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton completed={facilitator != null} onClick={this.handleRandomSelectFacilitator.bind(this)}>
                      Select Facilitator
                    </StepButton>
                  </Step>
                  <Step>
                    <StepButton completed={happy} onClick={this.handleThroughActions.bind(this)}>
                      Go Through Action Items
                    </StepButton>
                  </Step>
                </Stepper>
              </Grid>
              <Grid>
                <IconButton disabled={!readyToTakeOff} onClick={this.handleCreateBoard.bind(this)}>
                  <FlightTakeoffOutlined />
                </IconButton>
              </Grid>
            </Grid>
          }
        </Paper>
        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">Timer</Typography>
            </Grid>
            <Grid item md={1}>
              <TextField
                value={this.state.timer}
                onChange={this.handleSetTimer.bind(this)}
                type="number"
                inputProps={{ step: 5 }}
              />
              <Typography>Minutes</Typography>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">Members</Typography>
            </Grid>
            <Grid item md={10} container justify="space-between">
              {members.map(member =>
                <Badge badgeContent={facilitator && member.id === facilitator.id && <NearMeRounded />}                  >
                  <IconButton onClick={this.handleSetFacilitator.bind(this, member)}>
                    <Avatar>{member.firstName.charAt(0) + member.lastName.charAt(0)}</Avatar>
                  </IconButton>
                </Badge>
              )}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">Actions</Typography>
            </Grid>
            <Grid item md={10} container justify="space-between">
              {members.filter(m => m.actions && m.actions.filter(a => !a.finished).length > 0).map(member => (
                <Grid item xs={12} md={6} lg={4} key={"action" + member.id}>
                  <List>
                    {member.actions && member.actions.map((action) => (!action.finished &&
                      <ListItem divider key={"actionToCheck" + action.id} dense button >
                        <Avatar style={{ marginLeft: -15 }}>
                          {member.initial}
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
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">Boards</Typography>
            </Grid>
            <Grid item md={2}>
              <BoardList />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  };
};

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  board: state.boards.board,
  me: state.users.me,
  activeBoard: state.boards.activeBoard,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (id) => dispatch(setGroup(id)),
    setBoard: (id) => dispatch(setBoard(id)),
    setPage: (page) => dispatch(setPage(page)),
    postBoard: (board) => dispatch(postBoard(board)),
    fetchGroupActiveBoard: (id) => dispatch(fetchGroupActiveBoard(id)),
  };
};

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Group);
