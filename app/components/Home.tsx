import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { DefaultButton, DocumentCard, DocumentCardTitle, Stack, Text } from '@fluentui/react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

import { setGroup, searchGroups, addUserToGroup, postGroup } from '../store/group/action';
import { showGroupPage } from '../store/local/action';
import { GroupI, UserI } from '../../types/models';
import { Keyable } from '../../types/common';
import { ApplicationState } from '../store/types';

const classNames = mergeStyleSets({
  group: {
    marginTop: 8,
    marginRight: 8,
    width: 320,
    height: 198,
  },
});

interface PropsI {
  me: UserI;
  groups: GroupI[];

  addUserToGroup(userID: string, groupID: string): Promise<void>;
  postGroup(group: GroupI): Promise<void>;
  searchGroups(query: Keyable): Promise<void>;
  setGroup(groupID: string): void;
  showGroupPage(): void;
}

interface StateI {
  newGroupName: string,
}

class Group extends React.Component<PropsI, StateI> {
  constructor(props:any) {
    super(props);
    this.state = {
      newGroupName: '',
    };
  }

  async onSetGroup(group:GroupI) {
    const isMember = group.members.filter(member => member.id === this.props.me.id).length !== 0;
    if (!isMember) {
      await this.props.addUserToGroup(this.props.me.id, group.id);
    }
    this.props.setGroup(group.id);
    this.props.showGroupPage();
  }

  async onSearchGroup(evt:React.ChangeEvent<HTMLInputElement>) {
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
                  {/* <DocumentCardActivity people={g.members} /> */}
                  <DocumentCardTitle title="No ongoing meeting" showAsSecondaryTitle />
                </DocumentCard>
              </TooltipHost>
            </Stack.Item>
          ))}
          {groups && groups.length === 0 &&
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

const mapStateToProps = (state:ApplicationState) => ({
  group: state.group.group,
  groups: state.group.groups,
  me: state.user.me,
});
const mapDispatchToProps = { addUserToGroup, postGroup, searchGroups, setGroup, showGroupPage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
