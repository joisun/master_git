<template>
  <section>
    <vue-html2pdf
      :key="index"
      ref="pdfWrap"
      :show-layout="false"
      :float-layout="true"
      :enable-download="isPreview"
      :preview-modal="true"
      :page-breaks="{ mode: ['css', 'legacy'], avoid: '.html2pdf__avoid-break' }"
      pdf-content-width="700px"
      :filename="getFileName(`附件合同${index + 1}`)"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      :modfiy-pdf="attachModifyPdf"
      content-class="attach-contract-template"
      @hasDownloaded="hasDownloaded"
    >
      <template slot="pdf-content">
        <h1 class="pdf-content-h1">采购订单</h1>
        <el-table
          size="mini"
          class="attach-contract-template"
          :data="computedList"
          border
          style="
            width: 700px;
            margin: 20px 0;
            font-size: 12px;
            overflow: hidden;
            color: #000;
            font-weight: bolder;
          "
          :span-method="arraySpanMethod"
          :fit="true"
        >
          <template v-for="header in headers">
            <el-table-column
              v-if="header.value === 'productName'"
              :key="header.value"
              column-key="productName"
              prop="productName"
              :label="header.name"
              width="60"
            />
            <el-table-column
              v-if="header.value === 'countryCode'"
              :key="header.value"
              column-key="countryCode"
              prop="countryCode"
              :label="header.name"
              width="130"
            >
              <template #default="{ row }">
                <template v-if="row.fake">
                  <span v-html="row.countryCode" />
                </template>
                <template v-else>
                  <!--                  {{ (row.countryCode || []).join() }}-->
                  <div class="html2pdf__avoid-break">
                    <span v-for="(item, index) in row.countryCode || []" :key="item"
                      >{{ item
                      }}<span v-if="index !== (row.countryCode || []).length - 1">,</span></span
                    >
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-if="header.value === 'carrier'"
              :key="header.value"
              column-key="carrier"
              prop="carrier"
              :label="header.name"
              width="60"
            >
              <template #default="{ row }">
                <template v-if="row.fake">
                  <span v-html="row.carrier" />
                </template>
                <template v-else>
                  {{ row.carrier | carrierFilter }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-if="header.value === 'dataPlan'"
              :key="header.value"
              column-key="dataPlan"
              header-align="center"
              align="center"
              prop="dataPlan"
              :label="header.name"
            />
            <el-table-column
                v-if="header.value === 'test'"
                :key="header.value"
                column-key="test"
                prop="silent"
                :label="header.name"
                width="50"
                header-align="center"
                align="center"
            >
              <template #default="{ row }"> {{ row.test }} </template>
            </el-table-column>
            <el-table-column
              v-if="header.value === 'silent'"
              :key="header.value"
              column-key="silent"
              prop="silent"
              :label="header.name"
              width="50"
              header-align="center"
              align="center"
            >
              <template #default="{ row }"> {{ row.silent }} </template>
            </el-table-column>
            <el-table-column
              v-if="header.value === 'purchaseCycle'"
              :key="header.value"
              column-key="purchaseCycle"
              prop="purchaseCycle"
              :label="header.name"
              width="55"
              header-align="center"
              align="center"
            >
              <template #default="{ row }">{{ row.purchaseCycle }}</template>
            </el-table-column>
            <el-table-column
              v-if="header.value === 'custom1'"
              :key="header.value"
              column-key="custom1"
              prop="custom1"
              width="60"
              header-align="center"
              align="center"
              :label="exsistColMaps['custom1']"
            />
            <el-table-column
              v-if="header.value === 'custom2'"
              :key="header.value"
              column-key="custom2"
              prop="custom2"
              width="60"
              header-align="center"
              align="center"
              :label="exsistColMaps['custom2']"
            />
            <el-table-column
              v-if="header.value === 'purchaseNum'"
              :key="header.value"
              column-key="purchaseNum"
              prop="purchaseNum"
              :label="header.name"
              width="60"
              header-align="center"
              align="center"
            />
            <el-table-column
              v-if="header.value === 'unitPrice'"
              :key="header.value"
              column-key="unitPrice"
              prop="unitPrice"
              :label="header.name"
              width="60"
              header-align="center"
              align="center"
            />
            <el-table-column
              v-if="header.value === 'cardFee'"
              :key="header.value"
              column-key="cardFee"
              prop="cardFee"
              :label="header.name"
              width="60"
              header-align="center"
              align="center"
            />
            <el-table-column
              v-if="header.value === 'subTotal'"
              :key="header.value"
              column-key="subTotal"
              width="55"
              prop="subTotal"
              :label="header.name"
              header-align="center"
              align="center"
            />
          </template>
        </el-table>
        <p class="pdf-content-p html2pdf__avoid-break">
          1、根据《中华人民共和国民法典》和有关政策规定，以双方协商一致签定本订单。该采购订单为SIMBOSS物联网卡入网服务协议（合同编号或OA合同审批单号：{{
            allData.spOrder || contractNo
          }}
          ）的附件，与SIMBOSS物联网卡入网服务协议具有同等的法律效力。
        </p>
        <template v-if="isInIntl">
          <p class="pdf-content-p html2pdf__avoid-break">
            2、甲方承诺，购买的物联网卡及物联网通信服务仅使用于甲方【{{
              content.business
            }}】业务中。甲方确认及同意，其将使用国际物联网卡流量服务，因此服务受适用法律及各相关服务区域监管机构可能不时制定的任何指引、规例及/或业务守则（统称惯例）所规限。谨此明确同意：甲方及其用户应确保将发送至指定区域的任何讯息或内容遵守相关惯例;
            及如修改或制定有关惯例以致可能影响提供服务，以及/或在遵守惯例的情况下，乙方可拒发任何讯息或内容，及/或更改、修改或变更服务范围，惟乙方应尽其最大努力以不影响提供服务为前提，在情况允许时尽快以电邮或其他方式即时通知甲方有关拟采取的行动或更改。
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            3、交货方式： {{ content.deliveryMethod }}
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交货地址： {{ allData.deliveryAddress }}
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            4、付款模式：预付费，乙方收到全额货款后发货
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;乙方银行信息：
          </p>

          <p class="pdf-content-p html2pdf__avoid-break">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户名:
            {{ allData.bankAccount ? allData.bankAccount.name : '' }}
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开户行:
            {{ allData.bankAccount ? allData.bankAccount.bank : '' }}
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号:
            {{ allData.bankAccount ? allData.bankAccount.account : '' }}
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            5、本采购订单壹式两份，任何一方都不得擅自变更或解除。因故需要变更或解除时，应经双方协商一致依法另立协议。
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            6、本采购订单未涉及条款，按SIMBOSS物联网卡入网服务协议执行。
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            7、本采购订单自双方盖章之日起生效，双方同意采购订单的原件与复印件具有同等的法律效力。
          </p>
        </template>
        <template v-else>
          <p class="pdf-content-p html2pdf__avoid-break">
            2、本采购订单壹式两份，任何一方都不得擅自变更或解除。因故需要变更或解除时，应经双方协商一致依法另立协议。
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            3、本采购订单未涉及条款，按SIMBOSS物联网卡入网服务协议执行。
          </p>
          <p class="pdf-content-p html2pdf__avoid-break">
            4、本采购订单自双方盖章之日起生效，双方同意采购订单的原件与复印件具有同等的法律效力。
          </p>
        </template>
        <p class="pdf-content-p html2pdf__avoid-break">&nbsp;</p>
        <p class="pdf-content-p html2pdf__avoid-break">【以下为签章部分】</p>
        <div
          class="html2pdf__avoid-break"
          style="
            page-break-inside: avoid!important;
            break-inside:avoid!important;
            page-break-before:avoid!important;
            page-break-after: avoid!important;
          "
        >
          <div class="pdf-content-container html2pdf__avoid-break">
            <div class="pdf-content-row html2pdf__avoid-break pdf-table-container">
              <div class="pdf-content-cell html2pdf__avoid-break">
                <p class="pdf-content-p bold" style="margin-bottom: 20px">
                  甲方（采购方）：{{ allData.firstParty }}（盖章）
                </p>
              </div>
              <div class="pdf-content-cell html2pdf__avoid-break ">
                <p class="pdf-content-p bold" style="margin-bottom: 20px">
                  乙方（供应商）：{{ secoundParty }}（盖章）
                </p>
              </div>
            </div>
            <div class="pdf-content-row html2pdf__avoid-break  pdf-table-container" style="border-top: none">
              <div class="pdf-content-cell html2pdf__avoid-break">
                <p class="pdf-content-p bold">
                  日期: {{ allData.signDate | dateFilter('YYYY-MM-DD') }}
                </p>
              </div>
              <div class="pdf-content-cell html2pdf__avoid-break">
                <p class="pdf-content-p bold">
                  日期: {{ allData.signDate | dateFilter('YYYY-MM-DD') }}
                </p>
              </div>
            </div>
          </div>
<!--          <table-->
<!--            class="pdf-content-table-dot html2pdf__avoid-break"-->
<!--            border="1"-->
<!--            cellspacing="0"-->
<!--            cellpadding="0"-->
<!--            width="654"-->

<!--          >-->
<!--            <tbody class="html2pdf__avoid-break">-->
<!--              <tr class="html2pdf__avoid-break">-->
<!--                <td width="327" valign="top" class="html2pdf__avoid-break">-->
<!--                  <p class="pdf-content-p bold" style="margin-bottom: 20px">-->
<!--                    甲方（采购方）：{{ allData.firstParty }}（盖章）-->
<!--                  </p>-->
<!--                </td>-->
<!--                <td width="327" valign="top"  class="html2pdf__avoid-break">-->
<!--                  <p class="pdf-content-p bold" style="margin-bottom: 20px">-->
<!--                    乙方（供应商）： {{ secoundParty }}（盖章）-->
<!--                  </p>-->
<!--                </td>-->
<!--              </tr>-->
<!--              <tr style="border-top: none" class="html2pdf__avoid-break">-->
<!--                <td width="327" valign="top"  class="html2pdf__avoid-break">-->
<!--                  <p class="pdf-content-p bold">-->
<!--                    日期: {{ allData.signDate | dateFilter('YYYY-MM-DD') }}-->
<!--                  </p>-->
<!--                </td>-->
<!--                <td>-->
<!--                  <p class="pdf-content-p bold html2pdf__avoid-break">-->
<!--                    日期: {{ allData.signDate | dateFilter('YYYY-MM-DD') }}-->
<!--                  </p>-->
<!--                </td>-->
<!--              </tr>-->
<!--            </tbody>-->
<!--          </table>-->
        </div>
      </template>
    </vue-html2pdf>
  </section>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
import formatRMB from 'format-rmb'
import VueHtml2pdf from '@/page/components/wh-html2pdf/wh-html2pdf'
import Mixins from '@/page/manage/children/client/children/template-contract/mixins/consts'
import { BUSSNESS_SCOPE_TYPE_1 } from '@/page/manage/children/client/children/template-contract/mixins/consts'

const attachHeader =
  'data:image/png;base64,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'

export default {
  components: {
    VueHtml2pdf
  },
  mixins: [Mixins],
  props: {
    flowType: {
      type: String,
      require: true,
      default: ''
    },
    allData: {
      type: Object,
      default: () => {},
      require: true
    },
    index: {
      type: Number,
      default: -1,
      require: true
    },
    isPreview: {
      type: Boolean
    },
    content: {
      type: Object,
      default: () => {},
      require: true
    },
    contractNo: {
      type: String,
      default: '',
      require: false
    }
  },
  computed: {
    secondPartyOptions() {
      return this.isFlowTypeFirst ? this.secondPartyOptions1 : this.secondPartyOptions2
    },
    isFlowTypeFirst() {
      return this.flowType === 'framework'
    },
    isFlowTypeRecharge() {
      return this.flowType === 'attach_recharge'
    },
    secoundParty() {
      try {
        return this.secondPartyOptions.find((item) => item.value === this.allData.myCompany).label
      } catch (e) {
        return ''
      }
    },
    isInIntl() {
      return (
        this.flowType === 'attach_intl' || this.allData.businessScope === BUSSNESS_SCOPE_TYPE_1.intl
      )
    },
    spanField() {
      return this.isInIntl ? 'countryCode' : 'carrier'
    },
    computedList() {
      const result = this.isFlowTypeRecharge
        ? [
            ...this.content.list,
            {
              productName: `合计：${this.content.totalPurchasePayment} 元 （大写：${
                formatRMB(+this.content.totalPurchasePayment || '').value
              } ）(税率6%)`
            },
            {
              productName: `备注：${this.content.remark}`
            },
            {
              productName: '使⽤场景：',
              carrier: `甲⽅承诺，向⼄⽅购买的物联⽹卡仅使⽤于甲⽅${
                this.content.business || ''
              }物联⽹业务中。`,
              fake: true
            },
            {
              productName: '付款模式：',
              carrier: '预付费，乙方收到全额货款后发货',
              fake: true
            },
            {
              productName: `乙方银行信息：`,
              carrier: `
            <p>户名: ${this.allData.bankAccount ? this.allData.bankAccount.name : ''}</p>
            <p>开户行: ${this.allData.bankAccount ? this.allData.bankAccount.bank : ''}</p>
            <p>账号: ${this.allData.bankAccount ? this.allData.bankAccount.account : ''}</p>
          `,
              fake: true
            }
          ]
        : this.isInIntl
        ? [
            ...this.content.list,
            {
              productName: `快递费：${this.content.freight || 0} 元`
            },
            {
              productName: `总计：${this.content.totalPurchasePayment} 元 （大写：${
                formatRMB(+this.content.totalPurchasePayment || '').value
              } ）`
            },
            {
              productName: `备注：${this.content.remark}`
            }
          ]
        : [
            ...this.content.list,
            {
              productName: `快递费：${this.content.freight || 0} 元`
            },
            {
              productName: `合计：${this.content.totalPurchasePayment} 元 （大写：${
                formatRMB(+this.content.totalPurchasePayment || '').value
              } ）(税率6%)`
            },
            {
              productName: `备注：${this.content.remark}`
            },
            {
              productName: '使⽤场景：',
              [this.spanField]: `甲⽅承诺，向⼄⽅购买的物联⽹卡仅使⽤于甲⽅${
                this.content.business || ''
              }物联⽹业务中。`,
              fake: true
            },
            {
              productName: `交货⽅式：`,
              [this.spanField]: `${this.content.deliveryMethod}`,
              fake: true
            },
            {
              productName: `交货地址：`,
              [this.spanField]: `${this.content.deliveryAddress}`,
              fake: true
            },
            {
              productName: '付款模式：',
              [this.spanField]: '预付费，乙方收到全额货款后发货',
              fake: true
            },
            {
              productName: `乙方银行信息：`,
              [this.spanField]: `
            <p>户名: ${this.allData.bankAccount ? this.allData.bankAccount.name : ''}</p>
            <p>开户行: ${this.allData.bankAccount ? this.allData.bankAccount.bank : ''}</p>
            <p>账号: ${this.allData.bankAccount ? this.allData.bankAccount.account : ''}</p>
          `,
              fake: true
            }
          ]
      return result
    },
    headers() {
      const headers = safeGet(this.content, 'headers', []).filter(
        (item) => !!item.name && item.value !== 'action' && item.value !== 'index'
      )
      return headers
    },
    exsistColMaps() {
      const headers = safeGet(this.content, 'headers', [])
      const existKey = {}
      headers
        .filter((item) => !!item.name)
        .forEach((item) => {
          existKey[item.value] = item.name
        })
      delete existKey.action
      delete existKey.index
      return existKey
    }
  },
  methods: {
    hasDownloaded(...args) {
      this.$emit('hasDownloaded', ...args)
    },
    async generatePdf() {
      return this.$refs.pdfWrap.generatePdf()
    },
    async attachModifyPdf(html2PdfSetup) {
      const pdfFile = await html2PdfSetup.toPdf().get('pdf')
      const pages = pdfFile.getNumberOfPages()
      for (let i = 1; i <= pages; i++) {
        pdfFile.setPage(i)
        pdfFile.addImage(attachHeader, 'PNG', pdfFile.getPageWidth() - 120 - 70, 45, 118, 10)
        // pdfFile.setFontSize(10)
        // pdfFile.setTextColor(150)
        // pdfFile.text('SIMBOSS物联网卡入网协议附件', pdfFile.getPageWidth() - 120 - 80, 45)
        pdfFile.setFontSize(10)
        pdfFile.setTextColor(150)
        pdfFile.text(`${i} / ${pages}`, pdfFile.getPageWidth() / 2, pdfFile.getPageHeight() - 56)
      }
      return pdfFile
    },
    getFileName(type) {
      return `${type}${this.isPreview ? '预览' : ''}`
    },
    arraySpanMethod({ rowIndex, columnIndex }) {
      const colCount = Object.keys(this.exsistColMaps).length
      const len = this.computedList.length

      const allSpan = {
        attach: [len - 6, len - 7, len - 8],
        attach_recharge: [len - 4, len - 5],
        attach_intl: [len - 1, len - 2, len - 3]
      }
      if (
        allSpan[
          this.isFlowTypeRecharge ? 'attach_recharge' : this.isInIntl ? 'attach_intl' : 'attach'
        ].includes(rowIndex)
      ) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: colCount
          }
        }
      }
      const dual = {
        attach: [len - 1, len - 2, len - 3, len - 4, len - 5],
        attach_recharge: [len - 1, len - 2, len - 3],
        attach_intl: [len - 1, len - 2, len - 3]
      }
      if (
        dual[
          this.isFlowTypeRecharge ? 'attach_recharge' : this.isInIntl ? 'attach_intl' : 'attach'
        ].includes(rowIndex)
      ) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
        if (columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: colCount - 1
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.attach-contract-template {
  * {
    font-family: 'pdf-font';
  }

  .pdf-table-container {
    display: flex;
    .pdf-content-cell{
      flex-grow: 0;
      flex-shrink: 0;
      display: inline-block;
      width: 50%;
      padding: 2px 4px;
      border: 1px solid #333;
      &:first-child { border-right: 0; }
    }
    &:first-child {
      .pdf-content-cell {
        border-bottom: 0;
      }
    }
  }
  .pdf-content-h1 {
    text-align: center;
    font-size: 21px;
    font-weight: 700;
    line-height: 29px;
    margin: 17px 0;
  }

  .pdf-content-h2 {
    text-align: center;
    font-size: 21px;
    font-weight: 700;
    line-height: 36px;
    margin: 17px 0;
  }

  .pdf-content-h3 {
    font-size: 20px;
    font-weight: 700;
    line-height: 29px;
    margin: 17px 0;
  }

  .pdf-content-p {
    font-size: 14px;
    line-height: 29px;

    &.bold {
      font-weight: 700;
    }
  }

  .pdf-content-table-dot {
    width: 100%;
    page-break-before: avoid!important;
    page-break-after: avoid!important;
    //display: inline-block;
    //display: inline-table;
    //page-break-inside: avoid;
    break-inside:  avoid!important;
    border-collapse: collapse;
    mso-table-layout-alt: fixed;
    border: none;
    mso-border-alt: dotted windowtext 0.5pt;
    mso-yfti-tbllook: 1184;
    mso-padding-alt: 0cm 5.4pt 0cm 5.4pt;
    mso-border-insideh: 0.5pt dotted windowtext;
    mso-border-insidev: 0.5pt dotted windowtext;

    tr {
      mso-yfti-irow: 0;
      mso-yfti-firstrow: yes;

      td {
        width: 213.05pt;
        border: dotted windowtext 1pt;
        mso-border-alt: dotted windowtext 0.5pt;
        padding: 0cm 5.4pt 0cm 5.4pt;
      }
    }
  }
}
</style>
<style lang="scss">
.attach-contract-template {
  .el-table {
    color: #000;
  }

  .el-table thead .cell {
    color: #000;
  }

  .el-table--border,
  .el-table--group {
    border: 1px solid #333;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #333;
  }

  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
    border-right: 1px solid #333;
  }

  .el-table--border::after,
  .el-table--group::after {
    background-color: #fff;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>
