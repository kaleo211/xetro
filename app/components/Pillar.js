import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { List, ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import { Done, Add, DeleteOutline, PlayArrowRounded, ThumbUpOutlined } from '@material-ui/icons';
import { DocumentCard, DocumentCardTitle, DefaultButton, ActionButton, ProgressIndicator } from 'office-ui-fabric-react';
import { mergeStyleSets, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { IconButton } from 'office-ui-fabric-react';

import { setActiveItem } from '../actions/localActions';
import { postItem, deleteItem, likeItem, finishItem, startItem, patchItem } from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import Utils from './Utils';

registerIcons({
  icons: {
    'thumbsup-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 -2 24 24">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
        <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z"/>
      </svg>
    ),
    'delete-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/></svg>
    ),
    'timer-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M14 1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1zm-2 13c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm7.03-6.61l.75-.75c.38-.38.39-1.01 0-1.4l-.01-.01c-.39-.39-1.01-.38-1.4 0l-.75.75C16.07 4.74 14.12 4 12 4c-4.8 0-8.88 3.96-9 8.76C2.87 17.84 6.94 22 12 22c4.98 0 9-4.03 9-9 0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
    ),
    'done-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"/>
      </svg>
    ),
    'action-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z"/></svg>
    ),
  },
});


const classNames = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  iconButton: {
    marginTop: 12,
  },
});

const styles = theme => ({
  item: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  itemDone: {
    textDecoration: 'line-through',
  },
  title: {
    fontSize: 22,
  },
  summaryGrid: {
    marginRight: -theme.spacing.unit * 5,
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
  owner: {
    width: 40,
    height: 40,
  },
  action: {
    margin: 0,
  },
});

class Pillar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerAnchorEl: {},
      newActionTitle: '',
      switcher: false,
    };
  }

  handleAddActionOwner(item, owner) {
    this.handleOwerListClose(item.id);
    this.props.patchItem({ ...item, ownerID: owner.id, boardID: this.props.board.id });
  }

  handleActivateItem(item) {
    this.props.setActiveItem(item);
    if (this.props.activeItem.id === item.id && this.state.switcher) {
      this.setState({ switcher: false });
    } else {
      this.setState({ switcher: true });
    }
  }

  handleOwerListClose(itemID) {
    this.setOwnerAnchorEL(itemID, null);
  }

  handleOwerListOpen(itemID, evt) {
    this.setOwnerAnchorEL(itemID, evt.currentTarget);
  }

  setOwnerAnchorEL(itemID, value) {
    this.setState(state => ({
      ownerAnchorEl: {
        ...state.ownerAnchorEl,
        [`${itemID}`]: value,
      },
    }));
  }

  handleNewActionChange(evt) {
    this.setState({
      newActionTitle: evt.target.value,
    });
  }

  handleDeleteItem(item) {
    this.props.deleteItem({ ...item, boardID: this.props.board.id });
  }

  handleStartItem(item, evt) {
    evt.stopPropagation();
    this.props.startItem({ ...item, boardID: this.props.board.id });
    this.setState({ switcher: true });
  }

  handleSaveAction(item, evt) {
    const { newActionTitle } = this.state;
    if (evt && evt.key === 'Enter' && newActionTitle !== '') {
      const newAction = {
        title: newActionTitle.capitalize(),
        itemID: item.id,
        type: 'action',
        pillarID: item.pillarID,
        groupID: this.props.group.id,
        boardID: this.props.board.id,
      };

      this.props.postItem(newAction);
      this.setState({ newActionTitle: '' });
    }
  }

  handleLikeItem(item, evt) {
    evt.stopPropagation();
    this.props.likeItem({ ...item, boardID: this.props.board.id });
  }

  handleFinishItem(item) {
    this.props.finishItem({ ...item, boardID: this.props.board.id });
  }

  render() {
    const { activeItem, itemProgress, pillar, group, board, classes } = this.props;
    const { newActionTitle, ownerAnchorEl, switcher } = this.state;

    const members = group.members;
    const items = pillar.items.sort(Utils.createdAt());

    const disabled = (item) => board.locked || board.stage === 'archived' || item.stage === 'done';

    return items.map(item => (item.type === 'item' &&
      <DocumentCard className={classNames.card}>
        <div className={classNames.title}>
          <DocumentCardTitle
              title={item.title}
              className={item.stage !== 'done' ? classNames.titleText : null}
          />
          <div className={classNames.actions}>
            {!board.locked &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'delete-svg' }}
                  onClick={this.handleDeleteItem.bind(this, item)}
              />
            }
            {!board.locked &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'thumbsup-svg' }}
                  onClick={this.handleLikeItem.bind(this, item)}
              />
            }
            {board.locked && board.stage === 'active' && item.stage === 'created' &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'timer-svg' }}
                  onClick={this.handleStartItem.bind(this, item)}
              />
            }
            {board.locked && board.stage === 'active' && item.stage === 'active' &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'done-svg' }}
                  onClick={this.handleFinishItem.bind(this, item)}
              />
            }
          </div>
        </div>
        {board.locked && item.id === activeItem.id && item.stage === 'active' &&
          <ProgressIndicator percentComplete={1 - itemProgress} />
        }
      </DocumentCard>
      // <ExpansionPanel
      //   key={`item-${item.id}`}
      //   expanded={switcher && activeItem.id === item.id}
      //   onChange={this.handleActivateItem.bind(this, item)}
      // >
      //   <ExpansionPanelSummary className={classes.panelSummay}>
      //     <Grid
      //       container
      //       justify="space-between"
      //       alignItems="center"
      //       spacing={0}
      //     >
      //       <Grid item xs={10} sm={11}>
      //         <TextField
      //           fullWidth
      //           value={item.title}
      //           InputProps={{ disableUnderline: true, readOnly: true, classes: { input: classes.title } }}
      //           className={item.stage === 'done' ? classes.itemDone : null}
      //         />
      //       </Grid>
      //       <Grid item className={classes.summaryGrid}>
      //         <IconButton
      //           onClick={this.handleLikeItem.bind(this, item)}
      //           disabled={disabled(item)}
      //         >
      //           <Badge badgeContent={item.likes} color="primary" invisible={item.likes === 0} classes={{ badge: classes.badge }}>
      //             <ThumbUpOutlined />
      //           </Badge>
      //         </IconButton>
      //       </Grid>
      //     </Grid>
      //   </ExpansionPanelSummary>
      //   <ExpansionPanelDetails className={classes.panelDetail}>
      //     <Grid container direction="column">
      //       <Grid item>
      //         {board.stage === 'active' &&
      //           <TextField
      //             fullWidth
      //             label="Action Item"
      //             value={newActionTitle}
      //             onChange={this.handleNewActionChange.bind(this)}
      //             onKeyPress={this.handleSaveAction.bind(this, item)}
      //           />
      //         }
      //       </Grid>
      //       <Grid item>
      //         <List>
      //           {item.actions.map(i => (
      //             <ListItem divider key={`action-${i.id}`} className={classes.item}>
      //               <ListItemText primary={i.title} />
      //               {i.ownerID && <Avatar className={classes.owner}>{i.ownerID}</Avatar>}
      //               {!i.ownerID && <div>
      //                 <IconButton onClick={this.handleOwerListOpen.bind(this, i.id)}>
      //                   <Add fontSize="inherit" />
      //                 </IconButton>
      //                 <Menu
      //                   anchorEl={ownerAnchorEl[i.id]}
      //                   open={Boolean(ownerAnchorEl[i.id])}
      //                   onClose={this.handleOwerListClose.bind(this, i.id)}
      //                 >
      //                   {members && members.map(member => (
      //                     <MenuItem
      //                       style={{ paddingTop: 20, paddingBottom: 20 }}
      //                       key={`owner-${member.userID}`}
      //                       onClick={this.handleAddActionOwner.bind(this, i, member)}
      //                     >
      //                       <ListItemIcon><Avatar>{member.firstName}</Avatar></ListItemIcon>
      //                       <Typography variant="h5">
      //                         {`${member.firstName} ${member.lastName}`}
      //                       </Typography>
      //                     </MenuItem>
      //                   ))}
      //                 </Menu>
      //               </div>}
      //             </ListItem>
      //           ))}
      //         </List>
      //       </Grid>
      //     </Grid>
      //   </ExpansionPanelDetails>
      //   <ExpansionPanelActions className={classes.panelAction}>
      //     <Grid container direction="column" className={classes.action}>
      //       <Grid container justify="flex-end">
      //         {board.stage !== 'archived' && item.stage !== 'done' &&
      //           <Grid item>
      //             {board.locked && item.stage === 'created' &&
      //               <IconButton onClick={this.handleStartItem.bind(this, item)}>
      //                 <PlayArrowRounded />
      //               </IconButton>
      //             }
      //             {item.stage === 'active' &&
      //               <IconButton onClick={this.handleFinishItem.bind(this, item)}>
      //                 <Done />
      //               </IconButton>
      //             }
      //             {!board.locked && item.stage === 'created' && (item.actions == null || item.actions.length === 0) && (
      //               <IconButton onClick={this.handleDeleteItem.bind(this, item)}>
      //                 <DeleteOutline />
      //               </IconButton>
      //             )}
      //           </Grid>
      //         }
      //       </Grid>
      //       <Grid>
      //         {board.locked && item.stage === 'active' &&
      //           <LinearProgress color="secondary" variant="determinate" value={this.props.itemProgress} />
      //         }
      //       </Grid>
      //     </Grid>
      //   </ExpansionPanelActions>
      // </ExpansionPanel>
    ));
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
});

const mapDispatchToProps = (dispatch) => ({
  postItem: (i, item, boardID) => dispatch(postItem(i, item, boardID)),
  deleteItem: (item) => dispatch(deleteItem(item)),
  setBoard: (id) => dispatch(setBoard(id)),
  setActiveItem: (item) => dispatch(setActiveItem(item)),
  setGroup: (id) => dispatch(setGroup(id)),
  likeItem: (id) => dispatch(likeItem(id)),
  finishItem: (id) => dispatch(finishItem(id)),
  startItem: (item) => dispatch(startItem(item)),
  patchItem: (item) => dispatch(patchItem(item)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Pillar);
