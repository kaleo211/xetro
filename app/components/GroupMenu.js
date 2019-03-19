import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Divider } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { showPage } from '../actions/localActions';
import { compose } from 'redux';

const styles = theme => ({
});

class GroupMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClick(evt) {
    this.setState({ anchorEl: evt.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleGroupSelect(groupID) {
    this.props.setGroup(groupID);
    if (groupID === null) {
      this.props.setBoard(null);
      this.props.showPage("");
    }
    this.handleMenuClose();
  }

  handleGroupCreate() {
    this.props.showPage("groupCreate");
    this.handleMenuClose();
  }

  render() {
    const { group, groups } = this.props;
    const { anchorEl } = this.state;

    return (<div>
      <Button fullWidth variant="text" style={{ color: "white" }}
        onClick={this.handleClick.bind(this)} >
        {group ? group.name : "GROUPS"}
      </Button>
      <Menu anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}>
        <MenuItem onClick={this.handleGroupSelect.bind(this, null)}>
          {'GROUPS'}
        </MenuItem>
        <Divider />
        {groups.map(t => (
          <MenuItem key={t.id} onClick={this.handleGroupSelect.bind(this, t.id)}>
            {t.name}
          </MenuItem>
        ))}
        <MenuItem onClick={this.handleGroupCreate.bind(this)}>
          <Add />
        </MenuItem>
      </Menu>
    </div>)
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  groups: state.groups.groups,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (id) => dispatch(setGroup(id)),
    setBoard: (id) => dispatch(setBoard(id)),
    fetchGroupActiveBoards: (id) => dispatch(fetchGroupActiveBoards(id)),
    showPage: (page) => dispatch(showPage(page)),
  };
};

GroupMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(GroupMenu);
