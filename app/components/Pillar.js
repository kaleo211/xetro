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
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { List, ListItem, ListItemText, ListItemIcon, Typography } from '@material-ui/core';
import { Done, Add, DeleteOutline, PlayArrowRounded, ThumbUpOutlined } from '@material-ui/icons';
import { DocumentCard, DocumentCardTitle } from 'office-ui-fabric-react';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { setActiveItem } from '../actions/localActions';
import { postItem, deleteItem, likeItem, finishItem, startItem, patchItem } from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import Utils from './Utils';


const classNames = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
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
    const { activeItem, pillar, group, board, classes } = this.props;
    const { newActionTitle, ownerAnchorEl, switcher } = this.state;

    const members = group.members;
    const items = pillar.items.sort(Utils.createdAt());

    const disabled = (item) => board.locked || board.stage === 'archived' || item.stage === 'done';

    return items.map(item => (item.type === 'item' &&
      <DocumentCard className={classNames.card}>
        <DocumentCardTitle title={item.title} shouldTruncate />
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
