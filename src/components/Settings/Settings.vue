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
    <div class="form-group" :class="{'error': !isValidSelector}">
      <div class="show-tutorial" title="Show tutorial" @click="showTutorial">
        <svg aria-hidden="true" data-prefix="far" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle fa-w-16 fa-3x"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm0-338c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" class=""></path></svg>
      </div>
      <label>Search for custom css selector</label>
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
      <button
        v-if="isLoading"
        @click="reset()"
        class="reset"
      >
        Cancel and reset
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
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'

export default {
  data () {
    return {
      showSuccess: false,
      invalidReason: '',
      searchAllBooks: { label: 'Yes', value: true },
      selectedBooks: [],
      booksList: [
        { book_name: "Algebra and Trigonometry" },
        { book_name: "American Government" },
        { book_name: "Anatomy and Physiology" },
        { book_name: "Algonquin College MAT0032" },
        { book_name: "Applied Finite Mathematics" },
        { book_name: "College Physics for AP Courses" },
        { book_name: "Astronomy" },
        { book_name: "Biology" },
        { book_name: "Biology for AP Courses" },
        { book_name: "Biology 2e" },
        { book_name: "Business Ethics" },
        { book_name: "Calculus Volume 1" },
        { book_name: "Calculus Volume 2" },
        { book_name: "Calculus Volume 3" },
        { book_name: "Chemistry" },
        { book_name: "Collaborative Statistics Modified by T Short" },
        { book_name: "Labs For Collaborative Statistics Teegarden" },
        { book_name: "College Algebra" },
        { book_name: "College Physics" },
        { book_name: "Concepts of Biology" },
        { book_name: "Elementary Algebra" },
        { book_name: "English Home Language Grade 5" },
        { book_name: "Human Anatomy" },
        { book_name: "KSU TM College Physics I" },
        { book_name: "Microbiology" },
        { book_name: "Intermediate Algebra" },
        { book_name: "Introductory Statistics" },
        { book_name: "Introduction to Business" },
        { book_name: "Introductory Business Statistics" },
        { book_name: "Prealgebra" },
        { book_name: "Precalculus" },
        { book_name: "Principles of Accounting, Volume 1: Financial Accounting" },
        { book_name: "Principles of Economics 2e" },
        { book_name: "Principles of Macroeconomics 2e" },
        { book_name: "Principles of Macroeconomics for AP Courses 2e" },
        { book_name: "Principles of Microeconomics 2e" },
        { book_name: "Principles of Microeconomics for AP Courses 2e" },
        { book_name: "Project Management" },
        { book_name: "Psychology" },
        { book_name: "Fizyka dla szkol wyzszych Tom 1" },
        { book_name: "Rationality" },
        { book_name: "Introduction to Sociology" },
        { book_name: "Introduction to Sociology 2e" },
        { book_name: "Understanding Basic Music Theory" },
        { book_name: "University Physics Volume 1" },
        { book_name: "US History" },
      ],
      customSelector: '',
      isValidSelector: true,
      invalidSelectorInformation: ''
    }
  },
  watch: {
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
      if (
        this.isValidSelector
        && (this.selectedBooks.length || this.searchAllBooks.value)
        && this.customSelector
      ) {
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
      return book.book_name
    },
    validateSelector (selector) {
      if (!selector) return true

      const splitAtHas = selector.split(':has')
      if (selector.match(':has')) {
        if (splitAtHas.length > 2) {
          this.invalidSelectorInformation = { message: 'We do not support nested :has selectors.' }
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
        element: this.customSelector,
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
      this.customSelector = ''
      this.invalidReason = ''
      this.showSuccess = false
    },
    reset () {
      window.location = '/'
    },
  },
  components: {
    Multiselect,
  },
  created() {
    const book = this.$route.query.book
    const books = this.$route.query.books
    const element = this.$route.query.element

    if (element) {
      this.customSelector = element
    }
    if (book) {
      this.searchAllBooks = { label: 'No', value: false }
      this.selectedBooks = [{ book_name: book }]
    } else if (books) {
      if (books === 'all') {
        this.searchAllBooks = { label: 'Yes', value: true }
        this.selectedBooks = []
      } else {
        this.searchAllBooks = { label: 'No', value: false }
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

  button.send, button.reset {
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

  button.reset {
    margin-top: 10px;
    background-color: rgb(15, 42, 78);
    &:hover {
      background-color: rgb(9, 23, 43);
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
