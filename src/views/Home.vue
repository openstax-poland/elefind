<template>
  <section class="home">
    <div class="container">
      <h1 class="title">Content Finder</h1>
      <div class="row">
        <settings
          @showJobs="showJobsHandler"/>
        <jobs 
          v-if="!showResults" 
          @showResults="showResultsHandler" 
          @showJobs="showJobsHandler"/>
        <results 
          v-if="showResults" 
          @closeJobResults="closeJobResultsHandler" 
          :data="data"/>
      </div>
    </div>
  </section>
</template>

<script>
import Settings from '@/components/Settings/Settings'
import Jobs from '@/components/Jobs/Jobs'
import Results from '@/components/Results/Results'

export default {
  data() {
    return {
      showResults: true,
      data: {},
    }
  },
  methods: {
    showJobsHandler () {
      if (this.showResults === true) {
        this.showResults = false
      }
    },
    showResultsHandler (jobId) {
      this.$store.dispatch('getJobResults', jobId)
        .then(res => {
          this.data = res
          this.showResults = true
        })
    },
    closeJobResultsHandler () {
      this.showResults = false
    },
  },
  components: { 
    Jobs,
    Settings,
    Results,
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: left;
}

.row {
  display: flex;
  align-items: flex-start;
  .settings {
    margin-right: 40px;
  }
}

.container {
  max-width: 1200px;
  margin: 50px auto;
}
</style>

