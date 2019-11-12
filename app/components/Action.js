import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  Button,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  TextField,
} from 'office-ui-fabric-react';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { setActiveItem, hideAddingAction } from '../actions/localActions';
import {
  deleteItem,
  finishItem,
  likeItem,
  patchItem,
  postAction,
  postItem,
  startItem,
} from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';

const classNames = mergeStyleSets({
  body: {
    display: 'flex',
    verticalAlign: 'middle',
  },
});

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newActionTitle: '',
      newActionOwner: null,
    };
  }

  onChangeNewActionTitle(evt) {
    this.setState({
      newActionTitle: evt.target.value,
    });
  }

  async onClickAddActionButton(item) {
    this.props.setActiveItem(item);
  }

  async onSaveAction(item) {
    const { newActionTitle, newActionOwner } = this.state;
    const newAction = {
      title: newActionTitle.capitalize(),
      itemID: item.id,
      ownerID: newActionOwner.id,
      groupID: this.props.group.id,
      boardID: this.props.board.id,
    };
    await this.props.postAction(newAction);
    this.props.hideAddingAction();

    this.setState({
      newActionTitle: '',
      newActionOwner: null,
    });
  }

  onSetActionOwner(member) {
    this.setState({ newActionOwner: member });
  }

  onDismissAddingAction() {
    this.props.hideAddingAction();
  }

  render() {
    const { activeItem, group, addingAction } = this.props;
    const { newActionOwner } = this.state;

    const members = group.members.map(member => {
      return {
        ...member,
        text: member.name,
        onClick: this.onSetActionOwner.bind(this, member),
      };
    });

    return (
      <Dialog
          hidden={!addingAction}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'New Action',
          }}
      >
        <div className={classNames.body}>
          <div style={{ width: '100%' }}>
            <TextField
                underlined
                style={{ width: '100%' }}
                onChange={this.onChangeNewActionTitle.bind(this)}
            />
          </div>
          {newActionOwner ?
            <Button
                text={newActionOwner.initials}
                menuProps={{
                  shouldFocusOnMount: true,
                  items: members,
                }}
            /> :
            <IconButton
                primary
                iconProps={{ iconName: 'AddFriend' }}
                menuProps={{
                  shouldFocusOnMount: true,
                  items: members,
                }}
            />
          }
        </div>
        <DialogFooter>
          <PrimaryButton
              text="Add"
              onClick={this.onSaveAction.bind(this, activeItem)}
          />
          <DefaultButton
              text="Cancel"
              onClick={this.onDismissAddingAction.bind(this)}
          />
        </DialogFooter>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
  addingAction: state.local.addingAction,
});

const mapDispatchToProps = (dispatch) => ({
  postItem: (i, item, boardID) => dispatch(postItem(i, item, boardID)),
  deleteItem: (item) => dispatch(deleteItem(item)),
  setBoard: (id) => dispatch(setBoard(id)),
  setActiveItem: (item) => dispatch(setActiveItem(item)),
  likeItem: (id) => dispatch(likeItem(id)),
  finishItem: (id) => dispatch(finishItem(id)),
  startItem: (item) => dispatch(startItem(item)),
  patchItem: (item) => dispatch(patchItem(item)),
  postAction: (action) => dispatch(postAction(action)),
  hideAddingAction: () => dispatch(hideAddingAction()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Action);
