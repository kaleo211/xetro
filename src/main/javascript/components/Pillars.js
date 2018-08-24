import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 1,
    },
    item: {
        paddingTop: theme.spacing.unit * 0,
        paddingBottom: theme.spacing.unit * 2,
    },
    newItem: {
        paddingBottom: theme.spacing.unit * 2,
    }
});

class Pillars extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            < Grid
                container
                spacing={24}
                direction="row"
                justify="space-between"
                alignItems="stretch" >
                {
                    this.props.pillars.map(pillar => (
                        <Grid item key={pillar.title} xs={12} sm={12} md={4}>
                            <Card>
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
                                        label="New item"
                                        type="search"
                                        fullWidth={true}
                                        className={classes.newItem}
                                    />

                                    <div className={classes.item}>
                                        <Card className={classes.root} elevation={1}>
                                            <Typography variant="headline" component="h3">
                                                This is a sheet of item.
                                            </Typography>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid >
        )
    }
}

Pillars.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Pillars);
