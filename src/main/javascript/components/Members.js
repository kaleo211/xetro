import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Typography } from '@material-ui/core';

export default class Members extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      members: null,
    }

    // fetch("http://localhost:8080/api/member")
    //   .then(resp => resp.json())
    //   .then(data => {
    //     console.log("members:", data._embedded);
    //     this.setState({ members: data._embedded })
    //   });
  }

  render() {
    return (
      <List>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <Typography>
            {/* {this.state.members} */}
          </Typography>
        </ListItem>
      </List>
    )
  }
}
