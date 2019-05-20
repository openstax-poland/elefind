<template>
  <div class="settings">
    <h2 class="title">Settings</h2>
    <div class="form-group">
      <label>Search trough all books</label>
      <multiselect
        v-model="searchAllBooks"
        :options="[{label: 'Yes', value: true}, {label: 'No', value: false}]"
        track-by="label"
        label="label"
        :allow-empty="false"
        :searchable="false"
      />
    </div>
    <div v-if="!searchAllBooks.value" class="form-group">
      <label>Select books</label>
      <multiselect
        v-model="selectedBooks" 
        :options="booksList" 
        placeholder="Pick one or few"
        :customLabel="labelSelectBook"
        track-by="book_name"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
      >
      </multiselect>
    </div>
    <div v-if="!searchAllBooks.value && this.selectedBooks.length <= 1" class="form-group">
      <label>Select element that you need to find</label>
      <multiselect
        v-model="selectedDefaultSelector"
        :options="defaultSelectors"
        placeholder="Pick one"
        :disabled="(selectedBooks.length === 1 && !customSelector) ? false : true">
      </multiselect>
    </div>
    <div class="form-group" :class="{'error': !isValidSelector}">
      <div class="show-tutorial" title="Show tutorial" @click="showTutorial">
        <svg aria-hidden="true" data-prefix="far" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle fa-w-16 fa-3x"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm0-338c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" class=""></path></svg>
      </div>
      <label>or search for custom css selector</label>
      <input type="text" class="custom-input" v-model="customSelector" placeholder='ex: .class-name #id [data-type="note"]'>
      <span class="information">{{ invalidSelectorInformation.message }}</span>
    </div>
    <div class="form-group">
      <button 
        @click="getResults()" 
        class="send" 
        :disabled="!validateForm || isLoading">
        Get results
      </button>
      <transition name="fade" mode="out-in">
        <span v-if="showSuccess" class="success">Success</span>
      </transition>
      <transition name="fade" mode="out-in">
        <span v-if="invalidReason" class="invalid">{{ this.invalidReason }}</span>
      </transition>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers';

export default {
  data () {
    return {
      showSuccess: false,
      invalidReason: '',
      searchAllBooks: {label: 'Yes', value: true},
      selectedBooks: [],
      booksList: [{book_name:"Astronomy"},{book_name:"Biology_for_AP_Courses"},{book_name:"Business_Ethics"},{book_name:"Biology_2e"},{book_name:"Chemistry"},{book_name:"Prealgebra"},{book_name:"Principles_of_Macroeconomics_for_AP_Courses 2e"},{book_name:"Principles_of_Economics_2e"},{book_name:"Elementary_Algebra"},{book_name:"Intermediate_Algebra"},{book_name:"Introduction_to_Sociology_2e"},{book_name:"Introductory_Business_Statistics"},{book_name:"College_Physics_for_AP_Courses"},{book_name:"Introductory_Statistics"},{book_name:"Introduction_to_Business"},{book_name:"Concepts_of_Biology"},{book_name:"College_Physics"},{book_name:"University_Physics_Volume_1"},{book_name:"Fizyka_dla_szkol_wyzszych_Tom_1"},{book_name:"Chemistry"},{book_name:"American_Government"},{book_name:"Psychology"},{book_name:"College_Algebra"},{book_name:"Calculus_Volume_1"},{book_name:"Microbiology"},{book_name:"US_History"},{book_name:"Applied_Finite_Mathematics"},{book_name:"Algonquin_College_MAT0032"},{book_name:"Labs_For_Collaborative_Statistics_Teegarden"},{book_name:"Collaborative_Statistics_Modified_by_T_Short"},{book_name:"Understanding_Basic_Music_Theory"},{book_name:"English_Home_Language_Grade_5"},{book_name:"Human_Anatomy"},{book_name:"Rationality"},{book_name:"KSU_TM_College_Physics_I"},{book_name:"Project_Management"},{book_name:"Anatomy_and_Physiology"}], // async GET
      avaliableSearchElements: [], // async GET
      defaultSelectors: [],
      selectedDefaultSelector: '',
      customSelector: '',
      isValidSelector: true,
      invalidSelectorInformation: ''
    }
  },
  watch: {
    selectedBooks (books) {
      if (books.length === 1) {
        this.avaliableSearchElements.forEach(el => {
          if (el.book_name === books[0].book_name) {
            this.defaultSelectors = el.elements[0] === null ? [] : el.elements
          }
        })
      }
    },
    customSelector (val) {
      const isValid = this.validateSelector(val)
      if (this.isValidSelector !== isValid) {
        this.isValidSelector = isValid
      }
      if (val === 'pineapple') {
        this.$emit('showEasterEgg')
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
    }),
    validateForm () {
      if (this.isValidSelector && (this.selectedBooks.length || this.searchAllBooks.value) && (this.selectedDefaultSelector || this.customSelector)) {
        return true
      }
      return false
    }
  },
  methods: {
    showTutorial () {
      this.$emit('showTutorial')
    },
    labelSelectBook (book) {
      return book.book_name.replace(/_/g, ' ')
    },
    validateSelector (selector) {
      if (!selector) return true

      const splitAtHas = selector.split(':has')
      if (selector.match(':has')) {
        if (splitAtHas.length > 2) {
          this.invalidSelectorInformation = {message: 'We do not suppot nested :has selectors.'}
          return false
        }
        return true
      }

      try {
        document.querySelector(selector)
        return true
      } catch(e) {
        this.invalidSelectorInformation = e
      }

      return false
    },
    showSuccessMessage () {
      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    },
    showErrorMessage (e) {
      this.showSuccess = false
      if (e.response && e.response.data) {
        this.invalidReason = e.response.data
      } else if (e.response) {
        this.invalidReason = e.response
      } else {
        this.invalidReason = e
      }
      setTimeout(() => {
        this.invalidReason = ''
      }, 8000)
    },
    getResults () {
      if (!this.validateForm) return
      
      if (this.searchAllBooks.value || this.selectedBooks.length > 1) {
        return this.getMultipleResults()
      }

      this.$emit('toggleShowJobs', false)
      this.$store.commit('setLoading', true)

      const book = this.selectedBooks[0]
      const payload = {
        book, 
        element: this.customSelector ? this.customSelector : this.selectedDefaultSelector,
        isCustomSelector: this.customSelector ? true : false,
      }

      this.$router.push(`?book=${payload.book.book_name}&element=${payload.element}`)

      this.$store.dispatch('getResults', payload)
        .then(res => {
          this.$store.commit('setResults', res)
          this.showSuccessMessage()
          this.$store.commit('setLoading', false)
        })
        .catch(e => {
          this.showErrorMessage(e)
          return this.$store.commit('setLoading', false)
        })
    },
    getMultipleResults () {
      if (!this.validateForm) return

      this.$store.commit('clearJobsAndResults')
      this.$emit('toggleShowJobs', true)
      this.$store.commit('setLoading', true)

      const payload = {
        books: this.searchAllBooks.value ? this.booksList : this.selectedBooks,
        element: this.customSelector,
      }

      this.$router.push(`?books=${this.searchAllBooks.value ? 'all' : payload.books.map(b => b.book_name).toString()}&element=${payload.element}`)

      this.$store.dispatch('fetchMultipleResults', payload)
    },
    clearForm () {
      this.selectedBooks = []
      this.selectedDefaultSelector = ''
      this.customSelector = ''
      this.invalidReason = ''
      this.showSuccess = false
    }
  },
  components: {
    Multiselect,
  },
  beforeCreate() {
    const config = {
      responseType: 'json'
    }

    axios.get('https://content-finder.herokuapp.com/BooksAvaliable', config)
      .then(res => {
        return this.booksList = res.data.Books
      })
      .catch(e => {
        return e
      })

    axios.get('https://content-finder.herokuapp.com/API/AvaliableSearchElements', config)
      .then(res => {
        return this.avaliableSearchElements = res.data.Elements
      })
      .catch(e => {
        return e
      })
  },
  created() {
    const book = this.$route.query.book
    const books = this.$route.query.books
    const element = this.$route.query.element

    if (element) {
      this.customSelector = element
    }
    if (book) {
      this.searchAllBooks = {label: 'No', value: false}
      this.selectedBooks = [{book_name: book}]
    } else if (books) {
      if (books === 'all') {
        this.searchAllBooks = {label: 'Yes', value: true}
        this.selectedBooks = []
      } else {
        this.searchAllBooks = {label: 'No', value: false}
        this.selectedBooks = books.split(',').map(bName => { 
          return { book_name: bName }
        })
      }
    }
    this.getResults()
  }
}
</script>

<style lang="scss">
.settings {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    text-align: left;
  }

  .form-group {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
    width: 300px;
    margin-bottom: 30px;
    label {
      font-size: 18px;
      margin-bottom: 10px;
    }
    input.custom-input {
      box-sizing: content-box;
      display: block;
      position: relative;
      width: 100%;
      max-width: 282px;
      text-align: left;
      color: #35495e;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      padding: 11px 8px;
      font-size: 14px;
    }
    .information {
      opacity: 0;
      margin-top: 10px;
      font-size: 14px;
      color: #e53f3f;
      transition: 0.3s opacity ease-in-out;
    }
    &.error {
      .information {
        opacity: 1;
      }
    }
  }

  button.send {
    cursor: pointer;
    color: #fff;
    background-color: #28a745;
    border: none;
    border-radius: 5px;
    padding: 12px 0;
    transition: 0.3s all ease-in-out;
    &:hover {
      background-color: #218838;
    }
    &:disabled {
      cursor: not-allowed;
      color: #333;
      background-color: #e8e8e8;
    }
  }

  .success {
    margin-top: 5px;
    font-size: 14px;
    color: #218838;
  }

  .invalid {
    margin-top: 5px;
    font-size: 14px;
    color: #e53f3f;
  }

  .show-tutorial {
    width: 25px;
    position: absolute;
    top: 40px;
    left: -31px;
    cursor: pointer;
    color: #bebcbc;
  }

  .multiselect__element .multiselect__option {
    white-space: normal;
    word-wrap: break-word;
  }
}
</style>
