import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import { Forum } from '@material-ui/icons';

import { selectBoard } from '../../actions/boardActions';

const styles = theme => ({
});

class ActiveBoardList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleBoardSelect(boardID) {
    this.props.selectBoard(boardID);
  }

  render() {
    const { boards } = this.props;
    return (
      <Grid container justify="center" alignItems="center"  >
        <Grid item xs={12} md={4} >
          <List>
            {boards && boards.map(board => (
              <ListItem key={"activeBoard" + board.id} dense divider button >
                <Avatar>{board.team.name || "Unknow"}</Avatar>
                <ListItemText primary={board.name} />
                <ListItemSecondaryAction onClick={this.handleBoardSelect.bind(this, board.id)}>
                  <IconButton>
                    <Forum />
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

const mapStateToProps = state => ({
  boards: state.boards.boards,
});

ActiveBoardList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  selectBoard,
})(withStyles(styles)(ActiveBoardList));
