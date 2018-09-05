import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Utils from './Utils';
import Items from './Items';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
});

class Pillars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newItems: {},
    }
  }

  handleNewItemSave(pillar, event) {
    let newItems = this.state.newItems;

    if (event && event.key === 'Enter' && newItems[pillar] !== "") {
      console.log("board in new item save:", this.props.board);
      let newItem = {
        title: newItems[pillar].capitalize(),
        pillar: pillar,
        onwer: this.props.board._links.facilitator.href.replace('{?projection}', ''),
      };

      Utils.postResource("items", newItem, (() => {
        this.props.updatePillars();
        newItems[pillar] = "";
        this.setState({ newItems });
      }));
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);
  }

  render() {
    const { pillars, members, board } = this.props;
    const { newItems } = this.state;

    console.log("render in pillars:", pillars)

    return (
      <Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch"
      >
        {board && board.facilitator && pillars.map((pillar) => (
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
                  label={pillar.intro}
                  disabled={board && board.locked}
                  name={pillar._links.self.href}
                  value={newItems[pillar._links.self.href]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar._links.self.href)}
                />
              </CardContent>

              <Items
                board={board}
                pillar={pillar}
                members={members}
                updatePillars={this.props.updatePillars}
              />
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
