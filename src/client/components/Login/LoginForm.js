import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

const styles = {
  root: {
    position: 'relative'
  },
  loginButton: {
    background: 'linear-gradient(-45deg, #009fdf 30%, #0072ce 90%)',
    width: '100%',
    borderRadius: 3,
    border: 1,
    color: 'white',
    height: 42,
    marginTop: '30px',
    padding: '0 30px',
  },
  errorContainer: {
    position: 'absolute',
    top: '0'
  },
  errorText: {
    color: '#E00B2D',
    margin: '0px 14px'
  },
  loginTitle: {
    marginTop: '4rem'
  },
  card: {
    maxWidth: 345,
    boxShadow: 'none',
    backgroundColor: 'transparent'
  }
};

/**
 * Login Form Component
 */
class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {
        username: this.props.user.username,
        password: this.props.user.password
      }
    }
  }

  onChange = (event) => {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value

    this.setState({
      user
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.user)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Paper className={classes.errorContainer} >
        </Paper>
        <Typography type="headline" align="center">
          SIGN IN
        </Typography>
          <form onSubmit={this.onSubmit} >
            <TextField
              fullWidth
              placeholder="Your Centreon username"
              id="username"
              name="username"
              label="username"
              value={this.state.user.username}
              onChange={this.onChange}
              margin="normal"
            />
            <TextField
              fullWidth
              placeholder="Your Centreon password"
              id="password"
              label="Password"
              name="password"
              type="password"
              value={this.state.user.password}
              onChange={this.onChange}
              autoComplete="current-password"
              margin="normal"
            />
            <Button raised color="primary" type="submit" className={classes.loginButton}>Log in </Button>
          </form>
      </div>
    )
  }
}

/**
 * Login Form Prototypes
 */
LoginForm.propTypes = {
  /**
   * LoginForm css classes
   * @param {Object} classes
   */
  classes: PropTypes.object.isRequired,
  /**
   * Centreon LDAP User credentials
   *
   */
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }),
  /**
   * Authenticate with credentials
   */
  onSubmit: PropTypes.func.isRequired
}

LoginForm.defaultProps = {
  user: {
    username: '',
    password: ''
  }
}

export default withStyles(styles)(LoginForm)
