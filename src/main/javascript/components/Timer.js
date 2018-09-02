import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';


import {
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  FilterNone,
} from '@material-ui/icons';

const styles = theme => ({
});

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      minuteFirst: 0,
      minuteSecond: 0,
    }
  }

  updateTimer() {
    if (this.props.board) {
      let board = this.props.board;
      let minutes = Math.floor((new Date(board.endTime).getTime() - new Date().getTime()) / 60000);
      if (minutes > 0) {
        let first = minutes % 10;
        let second = Math.floor(minutes / 10) % 10;
        this.setState({
          minuteFirst: first,
          minuteSecond: second,
        });
      } else {
        this.setState({
          minuteFirst: 0,
          minuteSecond: 9,
        });
      }
    }
  };

  componentDidMount() {
    this.timer = setInterval(this.updateTimer.bind(this), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


  dynamicIcons = {
    1: Filter1,
    2: Filter2,
    3: Filter3,
    4: Filter4,
    5: Filter5,
    6: Filter6,
    7: Filter7,
    8: Filter8,
    9: Filter9,
    0: FilterNone,
  }

  render() {
    const { } = this.props;

    const MinuteFirstIcon = this.dynamicIcons[this.state.minuteFirst];
    const MinuteSecondIcon = this.dynamicIcons[this.state.minuteSecond];

    return (
      <Button color="inherit" >
        <MinuteSecondIcon />
        <MinuteFirstIcon />
      </Button>
    );
  }
}

Timer.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Timer);
