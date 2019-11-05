import React from 'react';
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
import { List, ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import {
  ActionButton,
  DefaultButton,
  DocumentCard,
  DocumentCardTitle,
  IconButton,
  ProgressIndicator,
  TextField,
  Dropdown,
} from 'office-ui-fabric-react';
import { mergeStyleSets, registerIcons } from 'office-ui-fabric-react/lib/Styling';

import { setActiveItem } from '../actions/localActions';
import {
  postItem,
  deleteItem,
  likeItem,
  finishItem,
  startItem,
  patchItem,
  postAction,
} from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';

registerIcons({
  icons: {
    'thumbsup-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 -2 24 24">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
        <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
      </svg>
    ),
    'delete-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" />
      </svg>
    ),
    'timer-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M14 1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1zm-2 13c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm7.03-6.61l.75-.75c.38-.38.39-1.01 0-1.4l-.01-.01c-.39-.39-1.01-.38-1.4 0l-.75.75C16.07 4.74 14.12 4 12 4c-4.8 0-8.88 3.96-9 8.76C2.87 17.84 6.94 22 12 22c4.98 0 9-4.03 9-9 0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    ),
    'done-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" />
      </svg>
    ),
    // 'action-svg': (
    //   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    //     <path fill="none" d="M0 0h24v24H0V0z" />
    //     <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z" />
    //   </svg>
    // ),
    'assign-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.22 0 .41.1.55.25.12.13.2.31.2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.19.08-.37.2-.5.14-.15.33-.25.55-.25zM19 19H5V5h14v14zM12 6c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6 6.47V18h12v-1.53c0-2.5-3.97-3.58-6-3.58s-6 1.07-6 3.58zM8.31 16c.69-.56 2.38-1.12 3.69-1.12s3.01.56 3.69 1.12H8.31z" />
      </svg>
    ),
    'add-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z" />
      </svg>
    ),
    'action-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
      </svg>
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
  newAction: {
    width: '100%',
  },
});

class Pillar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newActionTitle: '',
      isAddingAction: false,
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

  async onAddAction(item) {
    this.setState({ isAddingAction: true });
    this.props.setActiveItem(item);
    await this.handleFinishItem(item);
  }

  onAddedAction() {
    this.setState({ isAddingAction: false });
  }

  async onSaveActionEnterKey(item, evt) {
    const { newActionTitle } = this.state;
    if (evt && evt.key === 'Enter' && newActionTitle !== '') {
      await this.onSaveAction(item);
    }
  }

  async onSaveAction(item) {
    const { newActionTitle } = this.state;
    const newAction = {
      title: newActionTitle.capitalize(),
      itemID: item.id,
      groupID: this.props.group.id,
      boardID: this.props.board.id,
    };

    await this.props.postAction(newAction);
    this.setState({ newActionTitle: '' });
  }

  handleLikeItem(item, evt) {
    evt.stopPropagation();
    this.props.likeItem({ ...item, boardID: this.props.board.id });
  }

  async handleFinishItem(item) {
    await this.props.finishItem({ ...item, boardID: this.props.board.id });
  }

  render() {
    const { activeItem, itemProgress, pillar, group, board } = this.props;
    const { newActionTitle, isAddingAction } = this.state;

    const members = group.members.map(member => {
      return {
        ...member,
        text: member.name,
        onClick: (action) => this.handleAddActionOwner.bind(this, action, member),
      };
    });
    const items = pillar.items;

    const showTimer = (item) => {
      return board.locked && board.stage === 'active' && item.stage === 'created';
    };
    const showFinishButton = (item) => {
      return board.locked && board.stage === 'active' && item.stage === 'active';
    };
    const showActionButton = (item) => {
      return board.locked && board.stage === 'active' && item.stage !== 'created';
    };

    console.log('active item:', activeItem);

    const showAddAction = (item) => {
      return board.locked && board.stage === 'active' && item.id === activeItem.id && isAddingAction;
    };

    return items.map(item => (
      <DocumentCard key={item.id} className={classNames.card}>
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
            {showTimer(item) &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'timer-svg' }}
                  onClick={this.handleStartItem.bind(this, item)}
              />
            }
            {showFinishButton(item) &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'done-svg' }}
                  onClick={this.handleFinishItem.bind(this, item)}
              />
            }
            {showActionButton(item) &&
              <IconButton
                  primary
                  className={classNames.iconButton}
                  iconProps={{ iconName: 'action-svg' }}
                  onClick={this.onAddAction.bind(this, item)}
              />
            }
          </div>
        </div>
        {showAddAction(item) &&
          <div style={{ display: 'flex', verticalAlign: 'middle' }}>
            <div style={{ width: '100%' }}>
              <TextField
                  underlined
                  style={{ width: '100%' }}
                  onChange={this.handleNewActionChange.bind(this)}
                  onKeyPress={this.onSaveActionEnterKey.bind(this, item)}
                  onBlur={this.onSaveAction.bind(this, item)}
              />
            </div>
            <IconButton
                primary
                iconProps={{ iconName: 'assign-svg' }}
                onClick={this.onAddAction.bind(this, item)}
                menuProps={{
                  shouldFocusOnMount: true,
                  items: members,
                }}
            />
            <IconButton
                primary
                iconProps={{ iconName: 'add-svg' }}
                onClick={this.onAddAction.bind(this, item)}
            />
          </div>
        }
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
      //             onKeyPress={this.onSaveActionEnterKey.bind(this, item)}
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
  postAction: (action) => dispatch(postAction(action)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Pillar);
