import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const timeout = (ms) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {resolve()}, ms)
  })
}

export default new Vuex.Store({
  state: {
    isLoading: false,
    results: {},
    jobs: [],
  },
  getters: {
    isLoading (state) {
      return state.isLoading
    },
    results (state) {
      let instances = 0

      if (state.results.results) {
        state.results.results.forEach(el => {
          if (el.instances) {
            instances += Number(el.instances)
          } else {
            instances++
          }
        })
      }

      return {
        instances,
        ...state.results
      }
    },
    getJobs (state) {
      return state.jobs
    },
    getJobsInQueue (state) {
      return state.jobs
    },
  },
  mutations: {
    clearJobsAndResults (state) {
      state.results = {}
      state.jobs = []
    },
    setResults (state, payload) {
      state.results = payload
    },
    setResultsByJobId (state, jobId) {
      const job = state.jobs.find(job => {
        if (job.id === jobId) {
          return true
        }
        return false
      })
      
      if (job) {
        state.results = job.results
      } else {
        state.results = {}
      }
    },
    addNewJob (state, payload) {
      const newJob = {
        id: payload.id,
        book_name: payload.book_name,
        element: payload.element,
        start_date: new Date(),
        status: 'pending',
      }
      state.jobs.push(newJob)
    },
    restartJob (state, payload) {
      const jobIndex = state.jobs.findIndex(job => job.id === payload.id)

      if (jobIndex > -1) {
        state.jobs[jobIndex] = {
          id: payload.id,
          book_name: payload.book_name,
          element: payload.element,
          start_date: new Date(),
          status: 'pending',
        }
      }
    },
    updateJob (state, {jobId, results, err}) {
      state.jobs = state.jobs.map(job => {
        if (job.id === jobId) {
          if (err) {
            let errMsg = ''
            if (err.response && err.response.data) {
              errMsg = err.response.data
            } else if (err.response) {
              errMsg = err.response
            } else {
              errMsg = err
            }
            return {
              ...job,
              end_date: new Date(),
              status: 'error',
              error: errMsg,
            }
          }

          let instances = 0
          if (results.results) {
            results.results.forEach(el => {
              if (el.instances) {
                instances += Number(el.instances)
              } else {
                instances++
              }
            })
          }

          let updateJob = {
            ...job,
            end_date: new Date(),
            status: 'ok',
            results: {
              instances,
              ...results,
            },
          }
          return updateJob
        }
        return job
      })
    },
    setLoading (state, status) {
      state.isLoading = status
    }
  },
  actions: {
    async fetchMultipleResults ({commit, dispatch}, {books, element}) {
      for (const book of books) {
        const jobId = book.book_name + new Date().toISOString()
        const jobData = {
          id: jobId,
          book_name: book.book_name,
          element,
        }
        commit('addNewJob', jobData)
        await timeout(300)
        let err = null
        const results = await dispatch('getResults', {book, element, isCustomSelector: true})
          .then(res => res)
          .catch(e => {
            err = e
          })
        commit('updateJob', {jobId, results, err})
      }
      commit('setLoading', false)
    },
    getResults (_, { book, element, isCustomSelector = true }) {
      return new Promise((resolve, reject) => {
        const payload = {
          config: {
            responseType: 'json'
          },
          params: {
            bookName: book.book_name,
            element: element
          }
        }
  
        const customElementsEndpoint = process.env.NODE_ENV === 'development' ?
        'http://localhost:3000/elements' :
        'https://elefind.naukosfera.com/elements'
  
        const defaultSelectorsEndpoint = 'https://content-finder.herokuapp.com/API/GetElementsNonCustom.do'

        const link = isCustomSelector ? customElementsEndpoint : defaultSelectorsEndpoint

        axios.get(link, payload)
          .then(res => {
            const data = {
              bookName: payload.params.bookName,
              thumbnail: book.book_thumbnail,
              element: payload.params.element,
              results: res.data.Results,
              baked: typeof res.data.baked === 'boolean' ? res.data.baked : 'undefined',
              contentFetchedAt: res.data.contentFetchedAt ? res.data.contentFetchedAt : 'undefined',
              contentFetchedFrom: res.data.contentFetchedFrom ? res.data.contentFetchedFrom : 'undefined',
            }
            resolve(data)
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    async refreshJob ({commit, dispatch}, job) {
      if (!job) {
        throw new Error('You have to provide job.')
      }

      commit('restartJob', job)
      let err = null
      const payload = {
        book: {book_name: job.book_name},
        element: job.element,
        isCustomSelector: true,
      }
      const results = await dispatch('getResults', payload)
        .then(res => res)
        .catch(e => {
          err = e
        })
      commit('updateJob', {jobId: job.id, results, err})
    }
  }
})
