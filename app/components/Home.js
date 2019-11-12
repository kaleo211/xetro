import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  DefaultButton,
  DocumentCard,
  DocumentCardActivity,
  DocumentCardTitle,
  Stack,
  Text,
} from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { setGroup, searchGroups, addUserToGroup, postGroup } from '../actions/groupActions';
import { showGroupPage } from '../actions/localActions';

const classNames = mergeStyleSets({
  group: {
    marginTop: 8,
    marginRight: 8,
    width: 320,
    height: 198,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroupName: '',
    };
  }

  onSetGroup(group) {
    const isMember = group.members.filter(member => member.id === this.props.me.id).length !== 0;
    if (!isMember) {
      this.props.addUserToGroup(this.props.me.id, group.id);
    }
    this.props.setGroup(group.id);
    this.props.showGroupPage();
  }

  async onSearchGroup(evt) {
    const name = evt.target.value;
    this.setState({ newGroupName: name });
    await this.props.searchGroups({ name });
  }

  async onCreateGroup() {
    const newGroup = {
      name: this.state.newGroupName,
    };
    await this.props.postGroup(newGroup);
  }

  render() {
    const { me, groups } = this.props;
    const { newGroupName } = this.state;

    return (me &&
      <div>
        <SearchBox
            placeholder="Search Group"
            onChange={this.onSearchGroup.bind(this)}
        />
        <Stack horizontal wrap>
          {groups && groups.map(g => (
            <Stack.Item key={g.id} align="auto">
              <TooltipHost content="Click to Join Group">
                <DocumentCard
                    className={classNames.group}
                    onClick={this.onSetGroup.bind(this, g)}
                >
                  <DocumentCardTitle title={g.name} />
                  <DocumentCardActivity people={g.members} />
                  <DocumentCardTitle title="No ongoing meeting" showAsSecondaryTitle />
                </DocumentCard>
              </TooltipHost>
            </Stack.Item>
          ))}
          {groups.length === 0 &&
            <Stack.Item align="auto">
              <DocumentCard className={classNames.group}>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 56 }}>
                  <div style={{ marginRight: 24, display: 'flex', justifyContent: 'center', minHeight: 84 }}>
                    <Text variant="xLarge">{newGroupName}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 24 }}>
                    <DefaultButton
                        primary
                        text="Create Group"
                        onClick={this.onCreateGroup.bind(this)}
                    />
                  </div>
                </div>
              </DocumentCard>
            </Stack.Item>
          }
        </Stack>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  groups: state.groups.groups,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  addUserToGroup: (userID, groupID) => dispatch(addUserToGroup(userID, groupID)),
  postGroup: (group) => dispatch(postGroup(group)),
  searchGroups: (query) => dispatch(searchGroups(query)),
  setGroup: (id) => dispatch(setGroup(id)),
  showGroupPage: () => dispatch(showGroupPage()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
