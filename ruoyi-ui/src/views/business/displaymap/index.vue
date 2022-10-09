<template>
  <div>
    <div id="container" :style="{ height: innerHeight + 'px' }"></div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      innerHeight: window.innerHeight - 85,
    };
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "265d1f10919c205f3d5ad493dfc643a9", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 14, //初始化地图级别
            center:"", //初始化地图中心点位置
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.initMap();
    // var map = new AMap.Map("container");
  },
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100px;
}
</style>
