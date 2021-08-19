import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { DefaultButton, Dialog, DialogFooter, PrimaryButton, TextField, Persona, PersonaSize, Text } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

import { setActiveItem, hideAddingAction, showActions } from '../store/local/action';
import { postAction } from '../store/item/action';
import { ItemI, BoardI, GroupI, ActionI, UserI } from '../../types/models';
import { ApplicationState } from '../store/types';

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


interface PropsI {
  group: GroupI;
  board: BoardI;
  activeItem: ItemI;
  addingAction: boolean;

  hideAddingAction(): void;
  setActiveItem(item: ItemI): void;
  showActions(id: string): void;
  postAction(item: ActionI): void;
}

interface StateI {
  newActionTitle: string;
  noOwnerError: string;
  noTitleError: string;
  pickedOwners: UserI[];
}

class Action extends React.Component<PropsI, StateI> {
  constructor(props: any) {
    super(props);

    this.state = {
      newActionTitle: '',
      noOwnerError: null,
      noTitleError: null,
      pickedOwners: [],
    };
  }

  onChangeNewActionTitle(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newActionTitle: evt.target.value,
      noTitleError: null,
    });
  }

  async onClickAddActionButton(item:ItemI) {
    this.props.setActiveItem(item);
  }

  async onSaveAction(item:ItemI) {
    const { newActionTitle, pickedOwners } = this.state;

    if (newActionTitle === '') {
      this.setState({ noTitleError: 'Action title cannot be empty.' });
      return;
    }

    if (pickedOwners == null) {
      this.setState({ noOwnerError: 'Action owner cannot be empty.' });
      return;
    }

    pickedOwners.map(async owner => {
      const newAction: ActionI = {
        title: newActionTitle,
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

  onToggleOwner(member:UserI) {
    if (this.state.pickedOwners.filter(owner => owner.id === member.id).length > 0) {
      this.setState(state => ({
        pickedOwners: state.pickedOwners.filter(owner => {
          return member.id !== owner.id;
        }),
        noOwnerError: '',
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

    const isOwner = (member:UserI) => {
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
              <div key={member.id} style={{ minWidth: 36 }}>
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

const mapStateToProps = (state:ApplicationState) => ({
  board: state.board.board,
  group: state.group.group,
  activeItem: state.local.activeItem,
  addingAction: state.local.addingAction,
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  hideAddingAction: () => dispatch(hideAddingAction()),
  postAction: (action:ActionI) => dispatch(postAction(action)),
  setActiveItem: (item:ItemI) => dispatch(setActiveItem(item)),
  showActions: (id:string) => dispatch(showActions(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Action);
