import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  TextField,
  Persona,
  PersonaSize,
  Text,
} from 'office-ui-fabric-react';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { setActiveItem, hideAddingAction, showActions } from '../actions/localActions';
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

import { isBlank } from '../../utils/tool';

const classNames = mergeStyleSets({
  dialog: {
    minWidth: 1000,
  },
  body: {
    display: 'flex',
    verticalAlign: 'middle',
    height: 72,
    flexDirection: 'column',
  },
});

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newActionTitle: null,
      noOwnerError: null,
      noTitleError: null,
      pickedOwners: [],
    };
  }

  onChangeNewActionTitle(evt) {
    this.setState({
      newActionTitle: evt.target.value,
      noTitleError: null,
    });
  }

  async onClickAddActionButton(item) {
    this.props.setActiveItem(item);
  }

  async onSaveAction(item) {
    const { newActionTitle, pickedOwners } = this.state;

    if (isBlank(newActionTitle)) {
      this.setState({ noTitleError: 'Action title cannot be empty.' });
      return;
    }

    if (isBlank(pickedOwners)) {
      this.setState({ noOwnerError: 'Action owner cannot be empty.' });
      return;
    }

    pickedOwners.map(async owner => {
      const newAction = {
        title: newActionTitle.capitalize(),
        itemID: item.id,
        ownerID: owner.id,
        groupID: this.props.group.id,
        boardID: this.props.board.id,
      };
      await this.props.postAction(newAction);
    });

    this.props.showActions(item.id);
    this.props.hideAddingAction();
    this.setState({
      newActionTitle: '',
      pickedOwners: [],
    });
  }

  onToggleOwner(member) {
    if (this.state.pickedOwners.filter(owner => owner.id === member.id).length > 0) {
      this.setState(state => ({
        pickedOwners: state.pickedOwners.filter(owner => {
          return member.id !== owner.id;
        }),
        noOwnerError: null,
      }));
    } else {
      this.setState(state => ({
        pickedOwners: [...state.pickedOwners, member],
        noOwnerError: null,
      }));
    }
  }

  onDismissAddingAction() {
    this.props.hideAddingAction();
  }

  render() {
    const { activeItem, group, addingAction } = this.props;
    const { pickedOwners, noTitleError, noOwnerError } = this.state;

    const isOwner = (member) => {
      const owner = pickedOwners.filter(o => o.id === member.id).length > 0;
      return owner ? PersonaSize.size32 : PersonaSize.size24;
    };

    return (
      <Dialog
          isDarkOverlay
          hidden={!addingAction}
          dialogContentProps={{ title: 'New Action' }}
          minWidth={480}
          className={classNames.dialog}
      >
        <div className={classNames.body}>
          <div style={{ width: '100%', minHeight: 42, marginRight: 8, marginBottom: 4 }}>
            <TextField
                validateOnFocusOut
                validateOnLoad={false}
                errorMessage={noTitleError}
                onChange={this.onChangeNewActionTitle.bind(this)}
            />
          </div>
          <div style={{ marginLeft: 4, marginTop: 8, display: 'flex', flexDirection: 'row' }}>
            {group.members.map(member => (
              <div style={{ minWidth: 36 }}>
                <Persona
                    hidePersonaDetails
                    text={`${member.firstName} ${member.lastName}`}
                    size={isOwner(member)}
                    onClick={this.onToggleOwner.bind(this, member)}
                />
              </div>
            ))}
            {noOwnerError &&
              <Text style={{ color: 'red' }}>{noOwnerError}</Text>
            }
          </div>
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
  showActions: (id) => dispatch(showActions(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Action);
