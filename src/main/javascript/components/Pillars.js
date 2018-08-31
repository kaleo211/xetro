import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { PlusOne, Done, Add, DeleteOutline } from '@material-ui/icons';

import Likes from './Likes';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
  item: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 1,
  },
  itemDone: {
    textDecoration: "line-through",
  },
});

class Pillars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaveButtonDisabled: [],
      newItems: {},
      expandedItem: "",
      ownerAnchorEl: {},
      newAction: "",
    }

  }

  componentWillReceiveProps(props) {
    let pillars = props.pillars;
    let isSaveButtonDisabled = [];

    if (pillars) {
      console.log("pillars in pillars:", pillars);
      let newItems = {};
      for (let idx = 0; idx < pillars.length; idx++) {
        let pillar = pillars[idx];
        let pillarHref = pillar._links.self.href;
        newItems[pillarHref] = "";
        isSaveButtonDisabled[pillarHref] = true;
      }
      this.setState({ newItems, isSaveButtonDisabled });
    }
  }

  handleNewLikeSave(item, event) {
    event.stopPropagation();

    let updatedItem = {
      title: item.title,
      likes: item.likes + 1,
    }
    console.log("item to add like", JSON.stringify(item));
    console.log("item patch link:", item._links.self.href.replace('{?projection}', ''));
    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'PATCH',
      body: JSON.stringify(updatedItem),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
      } else {
        console.log("failed to post new like")
      }
    })
  }

  handleItemDone(item, event) {
    item.checked = true;
    console.log("item done link:", item);
    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'PATCH',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
      } else {
        console.log("failed to update item resp:", resp);
      }
    })
  }

  handleActionOwnerAdd(item, owner) {
    this.handleOwerListClose(item._links.self.href)
    let action = item.action;

    console.log("i am here")
    if (action && action._links) {
      let updatedAction = {
        member: owner._links.self.href,
      }
      console.log("action link", action);
      console.log("ower link", owner);

      fetch(action._links.self.href.replace('{?projection}', ''), {
        method: 'PATCH',
        body: JSON.stringify(updatedAction),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(resp => {
        if (resp.ok) {
          this.props.updatePillars();
        } else {
          console.log("failed to add owner to action");
        }
      })
    }
  }

  handleNewItemSave(pillar, event) {
    if (event && event.key === 'Enter' && this.state.newItems[pillar] !== "") {
      console.log("i am here")
      let newItem = {
        title: this.state.newItems[pillar],
        pillar: pillar,
      }

      fetch("http://localhost:8080/api/items", {
        method: 'post',
        body: JSON.stringify(newItem),
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }).then(resp => {
        if (resp.ok) {
          this.props.updatePillars();
          this.state.newItems[pillar] = "";
        } else {
          throw new Error('failed to post new item');
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }

  handleItemDelete(item, event) {
    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
      } else {
        console.log("failed to delete item resp:", resp);
      }
    });
  }

  handleItemExpandToggle(item, event) {
    let expandedItem = this.state.expandedItem;
    if (expandedItem && expandedItem === item._links.self.href) {
      this.setState({
        expandedItem: "",
      })
    } else {
      this.setState({ expandedItem: item._links.self.href });
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);
  }

  handleOwerListClose(item) {
    console.log("i am here11")

    let ownerAnchorEl = this.state.ownerAnchorEl;
    ownerAnchorEl[item] = null;
    this.setState({
      ownerAnchorEl,
    })
  }

  handleOwerListOpen(item, event) {
    let ownerAnchorEl = this.state.ownerAnchorEl;
    ownerAnchorEl[item] = event.currentTarget;
    this.setState({
      ownerAnchorEl,
    });
  }

  handleNewActionSave(item, event) {
    if (event && event.key === 'Enter' && this.state.newAction !== "") {
      let newAction = {
        title: this.state.newAction,
        item: item._links.self.href,
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
          this.handleItemDone(item);
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
    const { classes, pillars, members, board } = this.props;

    return (
      < Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch" >
        {pillars.map((pillar) => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillar.title}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              <CardContent>
                <TextField
                  id="createNewItem"
                  fullWidth
                  key={pillar._links.self.href}
                  label="New item"
                  disabled={board && board.locked}
                  name={pillar._links.self.href}
                  value={this.state.newItems[pillar._links.self.href]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar._links.self.href)}
                />
              </CardContent>

              {pillar.items && pillar.items.map(item => (
                <ExpansionPanel
                  key={item._links.self.href}
                  expanded={this.state.expandedItem === item._links.self.href}
                  onChange={this.handleItemExpandToggle.bind(this, item)}
                >
                  <ExpansionPanelSummary>
                    <LinearProgress variant="determinate" value={70} />
                    <Typography noWrap variant="headline" className={item.checked ? classes.itemDone : null}>
                      {item.title}
                    </Typography>
                    <Likes item={item} />
                    <Typography style={{ flexGrow: 1 }}></Typography>
                    <div style={{ marginTop: -5, marginBottom: -20, marginRight: -48 }}>
                      {board && !board.locked && !item.checked && (
                        <IconButton onClick={this.handleNewLikeSave.bind(this, item)}>
                          <PlusOne />
                        </IconButton>
                      )}
                      {item.action && item.action.member && (<Avatar>{item.action.member.userID}</Avatar>)}
                    </div>
                  </ExpansionPanelSummary>

                  <ExpansionPanelDetails>
                    <TextField
                      id="createNewActionItem"
                      label="Action item"
                      fullWidth
                      name={item._links.self.href}
                      disabled={item.action !== null}
                      value={item.action ? item.action.title : this.state.newAction}
                      onChange={this.handleNewActionChange.bind(this)}
                      onKeyPress={this.handleNewActionSave.bind(this, item)}
                    />
                    {item.action && item.action.title !== "" && (
                      <div style={{ marginRight: -17, marginTop: 10 }}>
                        {!item.action.member && (
                          <div>
                            <IconButton onClick={this.handleOwerListOpen.bind(this, item._links.self.href)}>
                              <Add fontSize='inherit' />
                            </IconButton>
                            <Menu
                              anchorEl={this.state.ownerAnchorEl[item._links.self.href]}
                              open={Boolean(this.state.ownerAnchorEl[item._links.self.href])}
                              onClose={this.handleOwerListClose.bind(this, item._links.self.href)}
                            >
                              {members && members.map(member => (
                                <MenuItem
                                  style={{ paddingTop: 20, paddingBottom: 20 }}
                                  key={"owner" + member.userID}
                                  onClick={this.handleActionOwnerAdd.bind(this, item, member)}
                                >
                                  <Avatar>{member.userID}</Avatar>
                                </MenuItem>
                              ))}
                            </Menu>
                          </div>
                        )}
                      </div>
                    )}

                  </ExpansionPanelDetails>

                  <ExpansionPanelActions >


                    {!item.action && !item.checked && (
                      <div>
                        <IconButton disabled={item.checked} onClick={this.handleItemDone.bind(this, item)}>
                          <Done />
                        </IconButton>
                        {board && !board.locked && (
                          <IconButton onClick={this.handleItemDelete.bind(this, item)}>
                            <DeleteOutline />
                          </IconButton>
                        )}
                      </div>
                    )}
                  </ExpansionPanelActions>
                </ExpansionPanel>
              ))}
            </Card>
          </Grid>
        ))}
      </Grid >
    )
  }
}

Pillars.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Pillars);
