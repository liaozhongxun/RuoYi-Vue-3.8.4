<template>
  <div class="app-container home">
    <div class="content">
      <img src="../assets/images/bg.jpg" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {};
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  display:flex;
  justify-content: center;
  align-items: center;
  height:80vh;
  .content{
    width: 78vw;
  }
  img{
    width: 78vw;
  }
}
</style>
