<template>
  <div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    comments: {
    },
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
    },
    methods: {
      onLoad(page, params = {}) {

      }
    }
  };
</script>

<style>
</style>
