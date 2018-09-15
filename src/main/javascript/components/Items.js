import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { PlusOne, Done, Add, DeleteOutline, PlayArrowRounded } from '@material-ui/icons';

import Likes from './Likes';
import { selectItem } from '../actions/localActions';
import { patchItem, deleteItem, postAction, patchAction } from '../actions/itemActions';
import { selectBoard } from '../actions/boardActions';
import { selectTeam } from '../actions/teamActions';

const styles = theme => ({
  item: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 1,
  },
  itemDone: {
    textDecoration: "line-through",
  },
});

class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerAnchorEl: {},
      newAction: "",
      progressTimer: null,
      itemProgress: 0,
      secondsPerItem: 300,
      switcher: false,
    }
  }

  // Timer
  componentDidMount() {
    this.progressTimer = setInterval(this.updateItemProgress, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.progressTimer);
  }

  updateItemProgress = () => {
    let item = this.props.selectedItem;
    if (item && item.startTime) {
      let seconds = Math.floor((new Date().getTime() - new Date(item.startTime).getTime()) / 1000);
      if (seconds > this.state.secondsPerItem) {
        this.setState({ itemProgress: 0 });
      } else {
        this.setState({
          itemProgress: Math.floor((this.state.secondsPerItem - seconds) * 100 / this.state.secondsPerItem),
        });
      }
    }
  };

  // Item
  handleItemDone(item) {
    if (this.state.newAction !== "") {
      this.saveAction(item);
    }
    this.props.patchItem(item, { checked: true })
      .then(() => {
        this.props.selectBoard(this.props.board.id);
      });
  }

  handleItemDelete(itemID) {
    this.props.deleteItem(itemID).then(() => {
      this.props.selectBoard(this.props.board.id);
    });
  }

  handleStartItem(item, evt) {
    evt.stopPropagation();
    let updatedItem = {
      started: true,
      startTime: new Date(),
    };

    this.props.patchItem(item, updatedItem)
      .then((item) => {
        this.setState({ switcher: true });

        this.props.selectBoard(this.props.board.id);
        this.props.selectItem(item);
      });
  }

  // Owner
  handleActionOwnerAdd(item, owner) {
    this.handleOwerListClose(item.id)

    let action = item.action;
    if (action && action._links) {
      this.props.patchAction("actions/" + action.id, { member: owner._links.self.href, })
        .then(() => {
          this.props.selectBoard(this.props.board.id);
          this.props.selectTeam(this.props.team.id);
        });
    }
  }

  handleOwerListClose(itemID) {
    let ownerAnchorEl = this.state.ownerAnchorEl;
    ownerAnchorEl[itemID] = null;
    this.setState({ ownerAnchorEl })
  }

  handleOwerListOpen(itemID, event) {
    let ownerAnchorEl = this.state.ownerAnchorEl;
    ownerAnchorEl[itemID] = event.currentTarget;
    this.setState({ ownerAnchorEl });
  }

  // Like
  handleNewLikeSave(item, event) {
    event.stopPropagation();
    this.props.patchItem(item, { likes: item.likes + 1, }).then(() => {
      this.props.selectBoard(this.props.board.id);
    });
  }

  // Action
  saveAction(item) {
    let newAction = {
      title: this.state.newAction.capitalize(),
      item: item._links.self.href,
      team: this.props.board.team._links.self.href,
    }

    this.props.postAction(newAction)
      .then(() => {
        this.props.selectBoard(this.props.board.id);
        this.setState({ newAction: "" });
      })
  }

  handleNewActionSave(item, event) {
    if (event && event.key === 'Enter' && this.state.newAction !== "") {
      this.saveAction(item);
    }
  }

  handleNewActionChange(event) {
    this.setState({
      newAction: event.target.value,
    });
  }

  handleItemSelect(item) {
    this.props.selectItem(item);

    if (this.props.selectedItem.id === item.id && this.state.switcher) {
      this.setState({ switcher: false })
    } else {
      this.setState({ switcher: true })
    }
  }

  render() {
    const { selectedItem, pillar, board, members, classes } = this.props;
    const { newAction, ownerAnchorEl, switcher } = this.state;
    return (board && pillar && pillar.items && pillar.items.map(item => (
      <ExpansionPanel
        key={"item-" + item.id}
        expanded={switcher && selectedItem.id === item.id}
        onChange={this.handleItemSelect.bind(this, item)}>
        <ExpansionPanelSummary>
          <Grid container>
            {item.likes > 0 && <Grid item><Likes item={item} /></Grid>}
            <Grid item>
              <Typography noWrap variant="headline" className={item.checked ? classes.itemDone : null}>
                {item.title}
              </Typography>
            </Grid>
          </Grid>

          <div style={{ marginTop: -5, marginBottom: -20, marginRight: -48 }}>
            {board && !board.locked && !item.checked && !item.started && !item.action && (
              <IconButton onClick={this.handleNewLikeSave.bind(this, item)}>
                <PlusOne />
              </IconButton>
            )}
            {board && board.locked && !item.checked && !item.started && !item.action && (
              <IconButton onClick={this.handleStartItem.bind(this, item)}>
                <PlayArrowRounded />
              </IconButton>
            )}
            {item.action && item.action.member && (<Avatar>{item.action.member.userID}</Avatar>)}
            {board.locked && selectedItem.id === item.id && !item.checked && item.started && !item.action && (
              <CircularProgress variant="static" value={this.state.itemProgress} />
            )}
          </div>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <TextField
            label="Action item"
            fullWidth
            disabled={item.action !== null}
            value={item.action ? item.action.title : newAction}
            onChange={this.handleNewActionChange.bind(this)}
            onKeyPress={this.handleNewActionSave.bind(this, item)}
          />
          {item.action && item.action.title !== "" && (
            <div style={{ marginRight: -17, marginTop: 10 }}>
              {!item.action.member && (<div>
                <IconButton onClick={this.handleOwerListOpen.bind(this, item.id)}>
                  <Add fontSize='inherit' />
                </IconButton>
                <Menu
                  anchorEl={ownerAnchorEl[item.id]}
                  open={Boolean(ownerAnchorEl[item.id])}
                  onClose={this.handleOwerListClose.bind(this, item.id)}
                >
                  {members && members.map(member => (
                    <MenuItem
                      style={{ paddingTop: 20, paddingBottom: 20 }}
                      key={"owner" + member.userID}
                      onClick={this.handleActionOwnerAdd.bind(this, item, member)}
                    >
                      <Avatar>{member.userID}</Avatar>
                    </MenuItem>
                  ))}
                </Menu>
              </div>)}
            </div>
          )}
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          <Grid container direction="column">
            <Grid item>
              <Grid container justify="flex-end">
                {!item.action && !item.checked && (
                  <Grid item>
                    <IconButton disabled={item.checked} onClick={this.handleItemDone.bind(this, item)}>
                      <Done />
                    </IconButton>
                    {board && !board.locked && (
                      <IconButton onClick={this.handleItemDelete.bind(this, item.id)}>
                        <DeleteOutline />
                      </IconButton>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelActions>
      </ExpansionPanel >
    )));
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  members: state.teams.members,
  team: state.teams.team,
  selectedItem: state.local.selectedItem,
});

Items.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  patchItem,
  deleteItem,
  postAction,
  selectBoard,
  patchAction,
  selectItem,
  selectTeam,
})(withStyles(styles)(Items));
