import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import { TimerOutlined } from '@material-ui/icons';
import { Select, MenuItem, TextField, InputAdornment } from '@material-ui/core';

import { setBoard, setBoards, archiveBoard, lockBoard, unlockBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { openSnackBar, setPage } from '../actions/localActions';
import { finishItem } from '../actions/itemActions';

const styles = theme => ({
  timer: {
    color: 'white',
  },
});

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: 60,
    };
  }

  render() {
    const { board, classes } = this.props;
    const { timer } = this.state;

    return (
      <div>
        <TextField
          value={timer}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimerOutlined style={{ color: 'white' }} />
              </InputAdornment>
            ),
            className: classes.timer,
            disableUnderline: true,
          }}
          onChange={}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  page: state.local.page,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: id => dispatch(setBoard(id)),
    setBoards: () => dispatch(setBoards()),
    setGroup: id => dispatch(setGroup(id)),
    openSnackBar: message => dispatch(openSnackBar(message)),
    setPage: page => dispatch(setPage(page)),
    archiveBoard: id => dispatch(archiveBoard(id)),
    lockBoard: id => dispatch(lockBoard(id)),
    unlockBoard: id => dispatch(unlockBoard(id)),
    finishItem: item => dispatch(finishItem(item)),
  };
};

Timer.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Timer);
