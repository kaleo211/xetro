import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListItemText from '@material-ui/core/ListItemText';

export default class Members extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <List>
        {
          this.props.members.map(member => (
            < ListItem key="" button >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={`${member.userID}`} />
            </ListItem>
          ))
        }
      </List>
    )
  }
}
