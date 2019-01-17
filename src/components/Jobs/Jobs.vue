<template>
  <div class="jobs">
    <h2 class="title">Jobs</h2>
    <div class="navigation">
      <div class="top-bar">
        <span
          @click="showResultsForJob = false"
          :class="{active: !showResultsForJob}"
        >
          Queue
        </span>
        <span
          @click="showResultsForJob = true"
          :class="{active: showResultsForJob}"
        >
          Results
        </span>
      </div>
      <div
        v-if="!showResultsForJob"
        class="legend"
      >
        <span class="legend-name">Legend:</span>
        <span class="legend-name">Pending: </span>
        <status-icon status="pending"/>
        <span class="legend-name">Done: </span>
        <status-icon status="ok"/>
        <span class="legend-name">Error: </span>
        <status-icon status="error"/>
      </div>
    </div>
    <jobs-list
      v-if="!showResultsForJob"
      :jobs="jobsInQueue"
      @showResults="showResultsHandler"
    />
    <results
      v-if="showResultsForJob"
    />
  </div>
</template>

<script>
import JobsList from './JobsList/JobsList'
import StatusIcon from './StatusIcon/StatusIcon'
import Results from '../Results/Results'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      showResultsForJob: false,
    }
  },
  computed: {
    ...mapGetters({
      'jobsInQueue': 'getJobsInQueue',
    })
  },
  methods: {
    showResultsHandler (jobId) {
      this.$store.commit('setResultsByJobId', jobId)
      this.showResultsForJob = true
    },
  },
  components: {
    JobsList,
    StatusIcon,
    Results,
  },
}
</script>

<style lang="scss" scoped>
.jobs {
  width: 100%;
  .title {
    text-align: left;
  }
  .navigation {
    display: flex;
    justify-content: space-between;
    .top-bar {
      span {
        display: inline-block;
        cursor: pointer;
        border: none;
        padding: 20px;
        background-color: transparent;
        &.active {
          font-weight: bold;
          background-color: #f2f2f2;
        }
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
    .legend {
      display: flex;
      align-items: center;
      .legend-name {
        margin-right: 5px;
      }
      .status-icon {
        margin-right: 10px;
        width: 15px;
      }
    }
  }
  .tab {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    border-top-left-radius: 0;
    height: 300px;
    overflow: auto;
  }
}
</style>


