import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { CheckRounded } from '@material-ui/icons';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Paper, Avatar, Grid } from '@material-ui/core';

import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Facepile, IFacepilePersona, IFacepileProps } from 'office-ui-fabric-react/lib/Facepile';
import { List } from 'office-ui-fabric-react/lib/List';

import { fetchGroupActiveBoard } from '../actions/boardActions';
import BoardList from './BoardList';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  facilitator: {
    width: 60,
    height: 60,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    await this.props.fetchGroupActiveBoard(this.props.group.id);
  }

  getDate() {
    const now = new Date();
    const numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { group, activeBoard, classes } = this.props;

    const facilitator = activeBoard && activeBoard.facilitator;
    const members = group.members.map(member => {
      return {
        ...member,
        imageInitials: member.initials,
        text: member.name,
        secondaryText: member.title,
        tertiaryText: 'In a meeting',
      };
    });

    const membersWithActions = members.filter(m => {
      return m.actions && m.actions.filter(a => !a.finished && a.groupID === group.id).length > 0
    });

    return (
      <div>
        <Label>Members</Label>
        <Stack.Item horizontal>
          <Facepile personas={members} />
        </Stack.Item>

        <Label>Actions</Label>
        {members.map(member => (
          <div>
            <Persona {...member} />
            <List items={member.actions} />
          </div>
        ))}

        {/* <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="center">
            <Grid item md={2}>
              <Typography variant="h6">Group Actions</Typography>
            </Grid>
            <Grid item md={10} container justify="space-between">
              {membersWithActions.map(member => (
                <Grid item xs={12} md={6} lg={4} key={`action${member.id}`}>
                  <List>
                    {member.actions && member.actions.map(action => (!action.finished && action.groupID === group.id &&
                      <ListItem divider key={`actionToCheck${action.id}`} dense button>
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
              <Typography variant="h6">Archived Boards</Typography>
            </Grid>
            <Grid item md={3}>
              <BoardList />
            </Grid>
          </Grid>
        </Paper> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  activeBoard: state.groups.activeBoard,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  fetchGroupActiveBoard: id => dispatch(fetchGroupActiveBoard(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Group);
