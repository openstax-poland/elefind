import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jobs: [
      {
        id: 0,
        start_date: new Date(),
        end_date: new Date(),
        status: 'active',
        book_id: 'book id',
        book_name: 'Algebra',
        elements: ['footnotes', 'tables', '.os-example', '.logclassnamewichforcescroll']
      },
      {
        id: 1,
        start_date: new Date(),
        end_date: new Date(),
        status: 'done',
        book_id: 'book id',
        book_name: 'Biology 2e',
        elements: ['span.title']
      },
      {
        id: 2,
        start_date: new Date(),
        end_date: new Date(),
        status: 'pending',
        book_id: 'book id',
        book_name: 'Biology',
        elements: ['[data-type="warning"]']
      },
      {
        id: 3,
        start_date: new Date(),
        end_date: new Date(),
        status: 'pending',
        book_id: 'book id',
        book_name: 'Chemistry',
        elements: ['[data-type="note"]']
      },
      {
        id: 4,
        start_date: new Date(),
        end_date: new Date(),
        status: 'done',
        book_id: 'book id',
        book_name: 'University Physics Volume 2',
        elements: ['.solution']
      },
      {
        id: 5,
        start_date: new Date(),
        end_date: new Date(),
        status: 'pending',
        book_id: 'book id',
        book_name: 'Fizyka dla szkół wyższych Tom 1',
        elements: ['footnotes']
      },
      {
        id: 6,
        start_date: new Date(),
        end_date: new Date(),
        status: 'done',
        book_id: 'book id',
        book_name: 'The AP Physics Collection',
        elements: ['.os-table']
      }
    ]
  },
  getters: {
    getJobs (state) {
      return state.jobs
    },
    getJobsInQueue (state) {
      return state.jobs.filter(job => {
        if (job.status === 'pending' || job.status === 'active') {
          return job
        }
      })
    },
    getDoneJobs (state) {
      return state.jobs.filter(job => {
        if (job.status === 'done') {
          return job
        }
      })
    }
  },
  mutations: {
    addNewJob (state, payload) {
      console.log('add new job')
      const newJob = {
        id: state.jobs.length,
        start_date: new Date(),
        end_date: new Date(),
        status: 'pending',
        ...payload
      }
      console.log(newJob)
      state.jobs.push(newJob)
    }
  },
  actions: {
    postNewJob ({commit}, payload) {
      // API POST
      commit('addNewJob', payload)
    },
    getJobResults ({commit}, jobId) {
      // API GET
      return {
        id: 0,
        book_id: 'book id',
        book_name: 'Algebra',
        status: 'done',
        elements: ['footnotes', 'tables', '.os-example'],
        results: [
          {
            element: 'footnote',
            module: 'Module 1',
            link: 'https://cnx.org/contents/kluwbu24ibvSEG34SCsv5'
          },
          {
            element: 'footnote',
            module: 'Module 3',
            link: 'https://cnx.org/contents/9836unfkvj24ibvSEG34SCsw435'
          },
          {
            element: 'footnote',
            module: 'Module 6',
            link: 'https://cnx.org/contents/gfbh09675bhbu24ib64nbv'
          },
          {
            element: 'tables',
            module: 'Module 1',
            link: 'https://cnx.org/contents/zxcbv24ibert5'
          },
          {
            element: 'tables',
            module: 'Module 1',
            link: 'https://cnx.org/contents/kwetrbu24ibvSEG34Srtyryuryury'
          },
          {
            element: 'tables',
            module: 'Module 2',
            link: 'https://cnx.org/contents/689hj24ibvSEG34SCsrtu5'
          },
          {
            element: 'tables',
            module: 'Module 8',
            link: 'https://cnx.org/contents/GHsdfmcJretvvuxiZD'
          },
          {
            element: 'tables',
            module: 'Module 9',
            link: 'https://cnx.org/contents/c2i3herkjnfdg5e6767'
          },
          {
            element: '.os-example',
            module: 'Module 2',
            link: 'https://cnx.org/contents/jkdshf8740hgfmlDFB%N&vdzy'
          },
          {
            element: '.os-example',
            module: 'Module 12',
            link: 'https://cnx.org/contents/klvfdps090546njdsfg'
          },
          {
            element: '.os-example',
            module: 'Module 16',
            link: 'https://cnx.org/contents/dsafgkbuiq34ter87vjfhdnv'
          },
          {
            element: '.os-example',
            module: 'Module 17',
            link: 'https://cnx.org/contents/fkdlnu3ynvfbd'
          },
          {
            element: '.os-example',
            module: 'Module 1d',
            link: 'https://cnx.org/contents/jvcbxopwoigfs'
          },
        ]
      }
    }
  }
})
