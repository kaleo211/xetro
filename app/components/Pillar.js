import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

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
import { patchItem, deleteItem, postAction, patchAction, likeItem, finishItem } from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';

const styles = theme => ({
  item: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 1,
  },
  itemDone: {
    textDecoration: "line-through",
  },
});

class Pillar extends React.Component {
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

  componentDidMount() {
    this.progressTimer = setInterval(this.updateItemProgress, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.progressTimer);
  }

  updateItemProgress = () => {
    let item = this.props.activeItem;
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

  handleItemDelete(itemID) {
    this.props.deleteItem(itemID).then(() => {
      this.props.setBoard(this.props.board.id);
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

        this.props.setBoard(this.props.board.id);
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
          this.props.setBoard(this.props.board.id);
          this.props.setGroup(this.props.group.id);
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

  // Action
  saveAction(item) {
    let newAction = {
      title: this.state.newAction.capitalize(),
      item: item._links.self.href,
      group: this.props.board.group._links.self.href,
    }

    this.props.postAction(newAction)
      .then(() => {
        this.props.setBoard(this.props.board.id);
        this.setState({ newAction: '' });
      })
  }

  handleNewActionSave(item, event) {
    if (event && event.key === 'Enter' && this.state.newAction !== '') {
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

    if (this.props.activeItem.id === item.id && this.state.switcher) {
      this.setState({ switcher: false })
    } else {
      this.setState({ switcher: true })
    }
  }


  handleLikeItem(item, event) {
    event.stopPropagation();
    item.boardId = this.props.board.id;
    this.props.likeItem(item);
  }

  handleFinishItem(item) {
    if (this.state.newAction !== "") {
      this.saveAction(item);
    }
    item.boardId = this.props.board.id;
    this.props.finishItem(item);
  }

  render() {
    const { activeItem, pillar, group, board, classes } = this.props;
    const { newAction, ownerAnchorEl, switcher } = this.state;

    const members = group.members;

    return (board && pillar && pillar.items ? pillar.items.map(item => (
      <ExpansionPanel
        key={"item-" + item.id}
        expanded={switcher && activeItem.id === item.id}
        onChange={this.handleItemSelect.bind(this, item)}>
        <ExpansionPanelSummary>
          <Grid container>
            {item.likes > 0 && <Grid item><Likes item={item} /></Grid>}
            <Grid item>
              <Typography noWrap variant="headline" className={item.done ? classes.itemDone : null}>
                {item.title}
              </Typography>
            </Grid>
          </Grid>

          <div style={{ marginTop: -5, marginBottom: -20, marginRight: -48 }}>
            {!board.locked && !item.done && !item.started && !item.action && (
              <IconButton onClick={this.handleLikeItem.bind(this, item)}>
                <PlusOne />
              </IconButton>
            )}
            {board.locked && !item.done && !item.started && !item.action && (
              <IconButton onClick={this.handleStartItem.bind(this, item)}>
                <PlayArrowRounded />
              </IconButton>
            )}
            {item.action && item.action.member && (<Avatar>{item.action.member.userId}</Avatar>)}
            {board.locked && activeItem.id === item.id && !item.done && item.started && !item.action && (
              <CircularProgress variant="static" value={this.state.itemProgress} />
            )}
          </div>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <TextField fullWidth
            label='Action item'
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
                      key={"owner" + member.userId}
                      onClick={this.handleActionOwnerAdd.bind(this, item, member)}
                    >
                      <Avatar>{member.userId}</Avatar>
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
                {!item.action && !item.done && (
                  <Grid item>
                    <IconButton disabled={item.done} onClick={this.handleFinishItem.bind(this, item)}>
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
    )) : <div></div>);
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
});

const mapDispatchToProps = (dispatch) => {
  return {
    patchItem: (i, item, bID) => dispatch(patchItem(i, item, bID)),
    deleteItem: (id) => dispatch(deleteItem(id)),
    postAction: (action) => dispatch(postAction(action)),
    setBoard: (id) => dispatch(setBoard(id)),
    patchAction: (action) => dispatch(patchAction(action)),
    selectItem: (item) => dispatch(selectItem(item)),
    setGroup: (id) => dispatch(setGroup(id)),
    likeItem: (id) => dispatch(likeItem(id)),
    finishItem: (id) => dispatch(finishItem(id)),
  };
};

Pillar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Pillar);
