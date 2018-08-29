import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

export default class Members extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members } = this.props;
    return (
      <List>
        {members.map(member => (
          <ListItem key={member.userID} button >
            <ListItemAvatar style={{ marginLeft: -8 }}>
              <Avatar>{member.userID}</Avatar>
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
    )
  }
}
