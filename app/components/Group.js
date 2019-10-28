import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Label } from 'office-ui-fabric-react/lib/Label';
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Facepile } from 'office-ui-fabric-react/lib/Facepile';
import { List } from 'office-ui-fabric-react/lib/List';
import { mergeStyleSets, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack, DocumentCard, DocumentCardTitle, DocumentCardActivity, DocumentCardDetails } from 'office-ui-fabric-react';

import { fetchGroupActiveBoard } from '../actions/boardActions';
import BoardList from './BoardList';

const theme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  group: {
    marginTop: 8,
    marginRight: 8,
    width: 320,
    // height: 50,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    await this.props.fetchGroupActiveBoard(this.props.group.id);
  }

  getDate() {
    const now = new Date();
    const numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { group, activeBoard } = this.props;

    console.log(group);
    const facilitator = activeBoard && activeBoard.facilitator;
    const members = group.members.map(member => {
      return {
        ...member,
        imageInitials: member.initials,
        text: member.name,
        secondaryText: member.title,
        tertiaryText: 'In a meeting',
      };
    });
    const actions = group.items;
    const membersWithActions = members.filter(m => {
      return m.actions && m.actions.filter(a => !a.finished && a.groupID === group.id).length > 0;
    });

    return (
      <div>
        <Label>Members</Label>
        <Stack.Item horizontal>
          <Facepile personas={members} />
        </Stack.Item>

        <Label>Actions</Label>
        <Stack horizontal wrap>
          {actions && actions.map(action => (
            <Stack.Item align="auto">
              <DocumentCard className={classNames.group}>
                <DocumentCardDetails>
                  <DocumentCardTitle title={action.title} />
                  <DocumentCardActivity activity="Oct 13 2019" people={[action.owner]} />
                </DocumentCardDetails>
              </DocumentCard>
            </Stack.Item>
          ))}
        </Stack>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  activeBoard: state.groups.activeBoard,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  fetchGroupActiveBoard: id => dispatch(fetchGroupActiveBoard(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
