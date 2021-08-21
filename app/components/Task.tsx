import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { DefaultButton, Dialog, DialogFooter, PrimaryButton, TextField, Persona, PersonaSize, Text } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

import { setActiveItem, hideAddingTask, showTasks } from '../store/local/action';
import { postTask } from '../store/item/action';
import { ItemI, BoardI, GroupI, TaskI, UserI } from '../../types/models';
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
  addingTask: boolean;

  hideAddingTask(): void;
  postTask(item: TaskI): void;
  setActiveItem(item: ItemI): void;
  showTasks(id: string): void;
}

interface StateI {
  newTaskTitle: string;
  noOwnerError: string;
  noTitleError: string;
  pickedOwners: UserI[];
}

class Task extends React.Component<PropsI, StateI> {
  constructor(props: any) {
    super(props);

    this.state = {
      newTaskTitle: '',
      noOwnerError: null,
      noTitleError: null,
      pickedOwners: [],
    };
  }

  onChangeNewTaskTitle(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      newTaskTitle: evt.target.value,
      noTitleError: null,
    });
  }

  async onClickAddTaskButton(item:ItemI) {
    this.props.setActiveItem(item);
  }

  async onSaveTask(item:ItemI) {
    const { newTaskTitle, pickedOwners } = this.state;

    if (newTaskTitle === '') {
      this.setState({ noTitleError: 'Task title cannot be empty.' });
      return;
    }

    if (pickedOwners == null) {
      this.setState({ noOwnerError: 'Task owner cannot be empty.' });
      return;
    }

    pickedOwners.map(async owner => {
      const newTask: TaskI = {
        title: newTaskTitle,
        itemID: item.id,
        ownerID: owner.id,
        groupID: this.props.group.id,
        boardID: this.props.board.id,
      };
      await this.props.postTask(newTask);
    });

    this.props.showTasks(item.id);
    this.props.hideAddingTask();
    this.setState({
      newTaskTitle: '',
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

  onDismissAddingTask() {
    this.props.hideAddingTask();
  }

  render() {
    const { activeItem, group, addingTask } = this.props;
    const { pickedOwners, noTitleError, noOwnerError } = this.state;

    const isOwner = (member:UserI) => {
      const owner = pickedOwners.filter(o => o.id === member.id).length > 0;
      return owner ? PersonaSize.size32 : PersonaSize.size24;
    };

    return (
      <Dialog
          isDarkOverlay
          hidden={!addingTask}
          dialogContentProps={{ title: 'New Task' }}
          minWidth={480}
          className={classNames.dialog}
      >
        <div className={classNames.body}>
          <div style={{ width: '100%', minHeight: 42, marginRight: 8, marginBottom: 4 }}>
            <TextField
                validateOnFocusOut
                validateOnLoad={false}
                errorMessage={noTitleError}
                onChange={this.onChangeNewTaskTitle.bind(this)}
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
              onClick={this.onSaveTask.bind(this, activeItem)}
          />
          <DefaultButton
              text="Cancel"
              onClick={this.onDismissAddingTask.bind(this)}
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
  addingTask: state.local.addingTask,
});

const mapDispatchToProps = { hideAddingTask, postTask, setActiveItem, showTasks };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Task);
