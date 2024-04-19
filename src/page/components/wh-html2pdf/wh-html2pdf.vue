<template>
  <div class="vue-html2pdf">
    <section
      class="layout-container"
      :class="{
        'show-layout': showLayout,
        'unset-all': !floatLayout
      }"
    >
      <section
        ref="pdfContent"
        :class="['content-wrapper', contentClass]"
        :style="{ width: pdfContentWidth, margin: '0 auto' }"
      >
        <slot name="pdf-content" />
      </section>
    </section>

    <transition name="transition-anim">
      <section v-if="pdfFile" class="pdf-preview">
        <button @click.self="closePreview()">&times;</button>
        <iframe :src="pdfFile" width="100%" height="100%" />
      </section>
    </transition>
  </div>
</template>
<script>
import html2pdf from 'html2pdf.js'
export default {
  props: {
    pageBreaks: {
      type: Object,
      default: () => {
        return { mode: ['avoid-all', 'css', 'legacy']}
      }
    },
    contentClass: {
      type: String,
      default: ''
    },
    showLayout: {
      type: Boolean,
      default: false
    },
    floatLayout: {
      type: Boolean,
      default: true
    },
    enableDownload: {
      type: Boolean,
      default: true
    },
    previewModal: {
      type: Boolean,
      default: false
    },
    filename: {
      type: String,
      default: `${new Date().getTime()}`
    },
    pdfQuality: {
      type: Number,
      default: 1
    },
    pdfFormat: {
      default: 'a4'
    },
    pdfOrientation: {
      type: String,
      default: 'portrait'
    },
    pdfContentWidth: {
      default: '554px'
    },
    htmlToPdfOptions: {
      type: Object
    },
    manualPagination: {
      type: Boolean,
      default: false
    },
    modfiyPdf: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      hasAlreadyParsed: false,
      progress: 0,
      pdfWindow: null,
      pdfFile: null
    }
  },
  watch: {
    progress(val) {
      this.$emit('progress', val)
    }
  },
  methods: {
    generatePdf() {
      this.$emit('startPagination')
      this.progress = 0
      this.paginationOfElements()
    },
    paginationOfElements() {
      this.progress = 25
      /*
        When this props is true,
        the props paginate-elements-by-height will not be used.
        Instead the pagination process will rely on the elements with a class "html2pdf__page-break"
        to know where to page break, which is automatically done by html2pdf.js
      */
      if (this.manualPagination) {
        this.progress = 70
        this.$emit('hasPaginated')
        this.downloadPdf()
        return
      }
      this.$emit('hasPaginated')
      this.downloadPdf()
    },
    async downloadPdf() {
      // Set Element and Html2pdf.js Options
      const pdfContent = this.$refs.pdfContent
      let options = this.setOptions()
      this.$emit('beforeDownload', { html2pdf, options, pdfContent })
      const html2PdfSetup = html2pdf().set(options).from(pdfContent)
      let pdfBlobUrl = null
      const pdf = await this.modfiyPdf(html2PdfSetup)
      if (this.previewModal) {
        this.pdfFile = await pdf.output('bloburl')
        pdfBlobUrl = this.pdfFile
      }
      if (this.enableDownload) {
        pdfBlobUrl = await pdf.save(this.filename).output('bloburl')
      }
      if (pdfBlobUrl) {
        const res = await fetch(pdfBlobUrl)
        const blobFile = await res.blob()
        this.$emit('hasDownloaded', blobFile)
      }
      this.progress = 100
    },
    setOptions() {
      if (this.htmlToPdfOptions !== undefined && this.htmlToPdfOptions !== null) {
        return this.htmlToPdfOptions
      }
      return {
        pagebreak: this.pageBreaks,
        margin: [72, 0, 72, 0],
        filename: `${this.filename}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        enableLinks: false,
        html2canvas: {
          useCORS: true,
          scale: this.pdfQuality,
          scrollY: 0,
          dpi: 96,
        },
        jsPDF: {
          unit: 'pt',
          format: this.pdfFormat,
          orientation: this.pdfOrientation,
          compress: true
        }
      }
    },
    closePreview() {
      this.pdfFile = null
    }
  }
}
</script>

<style lang="scss" scoped>
.vue-html2pdf {
  .layout-container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: -100vw;
    top: 0;
    z-index: -9999;
    //background: rgba(95, 95, 95, 0.8);
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    &.show-layout {
      left: 0vw;
      z-index: 9999;
    }
    &.unset-all {
      all: unset;
      width: auto;
      height: auto;
    }
  }
  .pdf-preview {
    position: fixed;
    width: 65%;
    min-width: 600px;
    height: 80vh;
    top: 100px;
    z-index: 9999999;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    box-shadow: 0px 0px 10px #00000048;
    button {
      position: absolute;
      top: -20px;
      left: -15px;
      width: 35px;
      height: 35px;
      background: #555;
      border: 0;
      box-shadow: 0px 0px 10px #00000048;
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
    }
    iframe {
      border: 0;
    }
  }
  .transition-anim-enter-active,
  .transition-anim-leave-active {
    transition: opacity 0.3s ease-in;
  }
  .transition-anim-enter,
  .transition-anim-leave-to {
    opacity: 0;
  }
}
</style>
