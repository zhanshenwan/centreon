import React from 'react'
import { withStyles } from 'material-ui/styles'
import { Bar } from 'react-chartjs-2'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import { CircularProgress } from 'material-ui/Progress'

const styles = theme => ({
  statisticsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  statisticsHeader: {
    display: 'flex',
    flex: '0',
    flexDirection: 'row'
  },
  chartContainer: {
    position: 'relative',
    flex: 1,
    height: '85vh',
    width: '95%'
  },
  title: {
    flex: 1,
  },
  searchField: {
    paddingRight: '100px'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
  },

})

const PluginPacks = ({ classes, slug, loading, options, data, searchValue, handleClick, handleSearch }) => (
  <div className={classes.statisticsContainer}>
    <div className={classes.statisticsHeader}>
      <Typography type='display1' align='center' className={classes.title}>
        {data.title}
      </Typography>
      {loading &&
        <CircularProgress className={classes.progress} size={50}/>
      }
      {!slug &&
        <TextField
          id="searchPP"
          label="Search"
          className={classes.searchField}
          value={searchValue}
          onChange={handleSearch}
          margin="normal"
        />
      }
    </div>
    <div className={classes.chartContainer}>
      <Bar
        //height={600}
        data={data}
        getElementAtEvent={handleClick}
        options={options}
      />
    </div>
  </div>
)

export default withStyles(styles)(PluginPacks)