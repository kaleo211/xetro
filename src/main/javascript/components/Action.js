import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ListItemAvatar, Avatar, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
});

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }

  }

  render() {
    const { classes, members, item } = this.props;
    return (

    );
  }
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Action);
