import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import MeetingRoomOutlined from '@material-ui/icons/MeetingRoomOutlined';

const styles = theme => ({
});

class ActiveBoardList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleBoardSelect(board) {
    this.props.updateSelectedBoard(board.id);
  }

  render() {
    const { boards } = this.props;
    return (
      <Grid container justify="center" alignItems="center"  >
        <Grid item xs={12} md={4} >
          <List>
            {boards && boards.map(board => (
              <ListItem key={"activeBoard" + board.id} dense button >
                <Avatar>{board.team.name}</Avatar>
                <ListItemText primary={board.name} />
                <ListItemSecondaryAction onClick={this.handleBoardSelect.bind(this, board)}>
                  <IconButton>
                    <MeetingRoomOutlined />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

ActiveBoardList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ActiveBoardList);
