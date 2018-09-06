import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
});

class ActiveBoardList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { boards } = this.props;
    return (
      <List>
        {boards && boards.map(board => (
          <ListItem>
            <Avatar>{board.team.name}</Avatar>
            <ListItemText primary={board.name} secondary="created time" />
          </ListItem>
        ))}
      </List>
    );
  }
}

ActiveBoardList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ActiveBoardList);
