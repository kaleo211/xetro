import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
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
import { List, ListItem, ListItemText } from '@material-ui/core';
import { Done, Add, DeleteOutline, PlayArrowRounded, ThumbUpOutlined } from '@material-ui/icons';

import { setItem } from '../actions/localActions';
import { postItem, deleteItem, likeItem, finishItem, startItem, patchItem } from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';

const styles = theme => ({
  item: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  itemDone: {
    textDecoration: "line-through",
  },
  title: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  summaryGrid: {
    marginRight: - theme.spacing.unit * 5,
  },
  panelSummay: {
    height: theme.spacing.unit * 6,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 1,
  },
  panelDetail: {
    paddingBottom: 0,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 0.5,
  },
  panelAction: {
    padding: 0,
  },
  badge: {
    top: '10%',
    right: '10%',
    border: `2px solid ${theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]}`,
  },
});

class Pillar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerAnchorEl: {},
      newAction: '',
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

  handleAddActionOwner(item, owner) {
    this.handleOwerListClose(item.id)
    item.ownerId = owner.id;
    item.boardId = this.props.board.id;
    this.props.patchItem(item);
  }

  handleActivateItem(item) {
    this.props.setItem(item);
    if (this.props.activeItem.id === item.id && this.state.switcher) {
      this.setState({ switcher: false })
    } else {
      this.setState({ switcher: true })
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

  handleNewActionChange(event) {
    this.setState({
      newAction: event.target.value,
    });
  }

  handleDeleteItem(item) {
    item.boardId = this.props.board.id;
    this.props.deleteItem(item);
  };

  handleStartItem(item, evt) {
    evt.stopPropagation();
    item.boardId = this.props.board.id;
    this.props.startItem(item);
    this.setState({ switcher: true });
  }

  handleSaveAction(item, event) {
    if (event && event.key === 'Enter' && this.state.newAction !== '') {
      let newAction = {
        title: this.state.newAction.capitalize(),
        itemId: item.id,
        type: 'action',
        pillarId: item.pillarId,
        groupId: this.props.group.id,
        boardId: this.props.board.id,
      };

      this.props.postItem(newAction);
      this.setState({ newAction: '' });
    }
  }

  handleLikeItem(item, event) {
    event.stopPropagation();
    item.boardId = this.props.board.id;
    this.props.likeItem(item);
  }

  handleFinishItem(item) {
    item.boardId = this.props.board.id;
    this.props.finishItem(item);
  }

  render() {
    const { activeItem, pillar, group, board, classes } = this.props;
    const { newAction, ownerAnchorEl, switcher } = this.state;

    const members = group.members;

    return (board && pillar && pillar.items ? pillar.items.map(item => (item.type === 'item' &&
      <ExpansionPanel
        key={"item-" + item.id}
        expanded={switcher && activeItem.id === item.id}
        onChange={this.handleActivateItem.bind(this, item)}
      >
        <ExpansionPanelSummary className={classes.panelSummay}>
          <Grid container
            justify="space-between"
            alignItems="center"
            spacing="0"
          >
            <Grid item xs="10" sm="11">
              <TextField fullWidth
                value={item.title}
                InputProps={{ disableUnderline: true, readOnly: true }}
                className={item.stage === 'done' ? classes.itemDone : classes.title}
              />
            </Grid>
            <Grid item className={classes.summaryGrid}>
              {!board.locked && item.stage !== 'done' && !item.started && !item.action && (
                <IconButton onClick={this.handleLikeItem.bind(this, item)}>
                  <Badge badgeContent={item.likes} color="primary" invisible={item.likes === 0} classes={{ badge: classes.badge }}>
                    <ThumbUpOutlined />
                  </Badge>
                </IconButton>
              )}
              {board.locked && item.stage !== 'done' && !item.started && !item.action && (
                <IconButton onClick={this.handleStartItem.bind(this, item)}>
                  <PlayArrowRounded />
                </IconButton>
              )}
              {item.action && item.action.member && (<Avatar>{item.action.member.userId}</Avatar>)}
              {board.locked && activeItem.id === item.id && item.stage !== 'done' && item.started && !item.action && (
                <CircularProgress variant="static" value={this.state.itemProgress} />
              )}
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.panelDetail}>
          <Grid container direction="column">
            <Grid item>
              <TextField fullWidth
                label='Action Item'
                disabled={item.stage === 'done'}
                value={item.action ? item.action.title : newAction}
                onChange={this.handleNewActionChange.bind(this)}
                onKeyPress={this.handleSaveAction.bind(this, item)}
              />
            </Grid>
            <Grid item>
              <List>
                {pillar.items.map(i => i.itemId === item.id &&
                  <ListItem key={'action' + i.id} className={classes.item}>
                    <ListItemText primary={i.title} />

                    {!i.ownerId && (<div>
                      <IconButton onClick={this.handleOwerListOpen.bind(this, i.id)}>
                        <Add fontSize='inherit' />
                      </IconButton>
                      <Menu
                        anchorEl={ownerAnchorEl[i.id]}
                        open={Boolean(ownerAnchorEl[i.id])}
                        onClose={this.handleOwerListClose.bind(this, i.id)}
                      >
                        {members && members.map(member => (
                          <MenuItem
                            style={{ paddingTop: 20, paddingBottom: 20 }}
                            key={"owner" + member.userId}
                            onClick={this.handleAddActionOwner.bind(this, i, member)}
                          >
                            <Avatar>{member.firstName}</Avatar>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>)}
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>

        <ExpansionPanelActions className={classes.panelAction}>
          <Grid container justify="flex-end" >
            {!item.action && item.stage !== 'done' && (
              <Grid item>
                <IconButton disabled={item.stage === 'done'} onClick={this.handleFinishItem.bind(this, item)}>
                  <Done />
                </IconButton>
                {!board.locked && (
                  <IconButton onClick={this.handleDeleteItem.bind(this, item)}>
                    <DeleteOutline />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>

        </ExpansionPanelActions >
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
    postItem: (i, item, bId) => dispatch(postItem(i, item, bId)),
    deleteItem: (item) => dispatch(deleteItem(item)),
    setBoard: (id) => dispatch(setBoard(id)),
    setItem: (item) => dispatch(setItem(item)),
    setGroup: (id) => dispatch(setGroup(id)),
    likeItem: (id) => dispatch(likeItem(id)),
    finishItem: (id) => dispatch(finishItem(id)),
    startItem: (item) => dispatch(startItem(item)),
    patchItem: (item) => dispatch(patchItem(item)),
  };
};

Pillar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Pillar);
