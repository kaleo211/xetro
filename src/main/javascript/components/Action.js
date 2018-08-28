import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ListItemAvatar, Avatar, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
});

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      newAction: "",
    }

    this.handleOwerListClose = this.handleOwerListClose.bind(this);
    this.handleOwerListOpen = this.handleOwerListOpen.bind(this);
  }

  componentWillMount() {
  }

  handleOwerListClose() {
    this.setState({
      anchorEl: null,
      newAction: "",
    })
  }

  handleOwerListOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  handleNewActionSave(item, event) {
    if (event && event.key === 'Enter') {
      let newAction = {
        title: this.state.newAction,
        item: item,
      }

      fetch("http://localhost:8080/api/actions", {
        method: 'post',
        body: JSON.stringify(newAction),
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }).then(resp => {
        if (resp.ok) {
          this.props.updatePillars();
          this.setState({
            newAction: "",
          });
        } else {
          throw new Error('failed to post new action');
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }

  handleNewActionChange(event) {
    this.setState({
      newAction: event.target.value,
    });
  }

  render() {
    const { classes, members, item } = this.props;
    return (
      <Grid container>
        <TextField
          id="createNewActionItem"
          label="Action item"
          fullWidth
          name={item._links.self.href}
          disabled={item.action !== null}
          value={item.action ? item.action.title : this.state.newAction}
          onChange={this.handleNewActionChange.bind(this)}
          onKeyPress={this.handleNewActionSave.bind(this, item._links.self.href)}
        />

        <IconButton disabled={!item.action} style={{ marginTop: 10 }} onClick={this.handleOwerListOpen}>
          <Add fontSize='inherit' />
        </IconButton>

        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleOwerListClose}
        >
          {members && members.map(member => (
            <MenuItem key={"owner" + member.id} onClick={this.handleOwerListClose}>
              <ListItemAvatar>
                <Avatar>
                  {member.userID}
                </Avatar>
              </ListItemAvatar>
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    );
  }
}

Action.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Action);
