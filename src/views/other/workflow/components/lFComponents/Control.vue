<template>
  <div>
    <el-button-group>
      <el-button plain size="small" @click="$_zoomIn">放大</el-button>
      <el-button plain size="small" @click="$_zoomOut">缩小</el-button>
      <el-button plain size="small" @click="$_zoomReset">大小适应</el-button>
      <el-button plain size="small" @click="$_translateRest">
        定位还原
      </el-button>
      <el-button plain size="small" @click="$_reset">还原(大小&定位)</el-button>
      <el-button :disabled="undoDisable" plain size="small" @click="$_undo">
        上一步(ctrl+z)
      </el-button>
      <el-button :disabled="redoDisable" plain size="small" @click="$_redo">
        下一步(ctrl+y)
      </el-button>
      <el-button plain size="small" @click="$_download">下载图片</el-button>
      <el-button plain size="small" @click="$_catData">查看数据</el-button>
    </el-button-group>
  </div>
</template>

<script>
  export default defineComponent({
    name: 'Control',
    props: {
      lf: {
        type: Object || String,
        default: () => {},
      },
    },
    emits: ['cat-data'],
    data() {
      return {
        undoDisable: true,
        redoDisable: true,
        graphData: null,
        dataVisible: false,
      }
    },
    mounted() {
      this.$props.lf.on(
        'history:change',
        ({ data: { undoAble, redoAble } }) => {
          this.$data.undoDisable = !undoAble
          this.$data.redoDisable = !redoAble
        }
      )
    },
    methods: {
      $_zoomIn() {
        this.$props.lf.zoom(true)
      },
      $_zoomOut() {
        this.$props.lf.zoom(false)
      },
      $_zoomReset() {
        this.$props.lf.resetZoom()
      },
      $_translateRest() {
        this.$props.lf.resetTranslate()
      },
      $_reset() {
        this.$props.lf.resetZoom()
        this.$props.lf.resetTranslate()
      },
      $_undo() {
        this.$props.lf.undo()
      },
      $_redo() {
        this.$props.lf.redo()
      },
      $_download() {
        this.$props.lf.getSnapshot()
      },
      $_catData() {
        this.$emit('cat-data')
      },
    },
  })
</script>
<style scoped></style>
