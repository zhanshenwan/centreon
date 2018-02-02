import React from 'react'
import { withStyles } from 'material-ui/styles'
import { LoginForm } from 'Components/Login'
import Grid from 'material-ui/Grid'
import loginBg from '../static/images/hub-login-bg.png'
import cardBg from '../static/images/card-bg.png'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { Notification } from 'Components/Notification'

const styles = theme => ({
  root: {
    margin: 0,
    width: '100%',
    '&:before': {
      content: '""',
      height: '100%',
      width: '100%',
      position: 'absolute',
      background: 'url(' + loginBg + ') no-repeat left top 100%',
      backgroundSize: 'cover',
      zIndex: '-1'
    }
  },
  card: {
    background: 'url(' + cardBg + ') no-repeat left top 50% #FFF',
    maxWidth: '50%',
    flexBasis: '100%',
    padding: '64px'
  },
  title: {
    backgroundColor: '#FFF'
  },
  content: {
    flex: '1 0 auto'
  }
})

const LoginPage = ({ classes }) => {
  return (
    <Grid
      container
      className={classes.root}
      direction='row'
      alignItems='center'
      justify='center'
    >
      <Paper className={classes.card}>
        <Grid
          container
          spacing={24}
          alignItems='center'
          justify='center'
          >
          <Grid item xs={6} >
            <Typography type='display1' className={classes.title}>
            Centreon Hub UI
          </Typography>
          </Grid>
          <Grid item xs={6}>
            <LoginForm />
          </Grid>
        </Grid>
      </Paper>
      <Notification />
    </Grid>
  )
}

export default withStyles(styles)(LoginPage)
