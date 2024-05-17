<template>
  <vue-html2pdf
    ref="frameContractPdf"
    :show-layout="false"
    :float-layout="true"
    :enable-download="isPreview"
    :preview-modal="true"
    pdf-content-width="664px"
    :filename="getFileName('框架合同')"
    :pdf-quality="1.5"
    :manual-pagination="true"
    pdf-format="a4"
    content-class="pdf-content"
    :modfiy-pdf="frameModifyPdf"
    @hasDownloaded="hasDownloaded"
  >
    <template slot="pdf-content">
      <h1 class="pdf-content-h1">SIMBOSS物联网卡入网服务协议</h1>
      <p class="pdf-content-p bold">甲方：{{ content.firstParty }}（或简称“您”）</p>
      <p class="pdf-content-p bold">地址：{{ content.firstPartyAddress }}</p>
      <p class="pdf-content-p bold">联系人：{{ content.firstPartyContact }}</p>
      <p class="pdf-content-p bold">电话：{{ content.firstPartyPhone }}</p>
      <p class="pdf-content-p bold">邮箱：{{ content.firstPartyEmail }}</p>
      <p class="pdf-content-p bold">&nbsp;</p>
      <p class="pdf-content-p bold">乙方：{{ content.secondParty }}（或简称“{{ shortName }}”）</p>
      <p class="pdf-content-p bold">地址：{{ content.secondPartyAddress }}</p>
      <p class="pdf-content-p bold">联系人：{{ content.secondPartyContact }}</p>
      <p class="pdf-content-p bold">电话：{{ content.secondPartyPhone }}</p>
      <p class="pdf-content-p bold">邮箱：{{ content.secondPartyEmail }}</p>
      <p class="pdf-content-p bold">&nbsp;</p>
      <p class="pdf-content-p">
        根据《中华人民共和国民法典》、《中华人民共和国电信条例》及其他有关法律、法规的规定，甲乙双方本着平等自愿、互惠互利的原则，就开展物联网卡及相关数据通信业务入网服务（以下简称通信服务）的相关事宜达成本协议如下条款：
      </p>
      <p class="pdf-content-p">
        一、甲方购买乙方物联网卡及流量套餐服务，具体以后续签署的采购订单为准。
      </p>
      <p class="pdf-content-p">
        二、本协议有效期内，乙方为甲方提供专业的通信运营商物联网SIM卡及相关的流量套餐服务。服务期限为：自
        {{ serviceBegin[0] }}年{{ serviceBegin[1] }}月{{ serviceBegin[2] }}日起至{{
          serviceEnd[0]
        }}年{{ serviceEnd[1] }}月{{
          serviceEnd[2]
        }}日止，本协议期限届满前，双方均未提出书面终止要求，且甲方继续使用乙方服务，则视为双方同意本协议自动顺延一年协议期，此类自动顺延不设定次数限制。
      </p>
      <p class="pdf-content-p">
        三、甲方需在采购订单签订后，甲方根据实际购买的数量3个工作日内一次性付清SIM卡费和套餐费用，支付成功后，乙方将提供相应的流量套餐服务。
      </p>
      <p class="pdf-content-p">
        四、甲方可以通过支付宝或网上银行等途径向乙方指定的账户充值，或通过银行转账的方式将费用支付至乙方指定账户。甲方选择的付款途径为：{{
          content.paymentMethod
        }}
      </p>
      <p class="pdf-content-p">乙方银行收款账户信息如下：</p>
      <p class="pdf-content-p">户名：{{ content.secondParty }}</p>
      <p class="pdf-content-p">开户行：{{ bankAccount.bank }}</p>
      <p class="pdf-content-p">账号：{{ bankAccount.account }}</p>
      <p v-if="bankAccount.alipay" class="pdf-content-p">
        支付宝收款账户信息如下：{{ bankAccount.alipay }}
      </p>
      <p v-if="bankAccount.liaison" class="pdf-content-p">联行号：{{ bankAccount.liaison }}</p>
      <p class="pdf-content-p">
        发票的开具方式：在甲方付清款项后，乙方在10个工作日内开具发票，预付款项不可退。
      </p>
      <p class="pdf-content-p">
        五、本服务协议的附件为《服务条款》和《采购订单》。所有附件与本服务协议主文共同构成完整协议；若附件与服务协议主文存不一致之处，以协议主文约定为准。
      </p>
      <p class="pdf-content-p">
        六、本协议自甲乙双方加盖公章或合同专用章之日起生效。本协议一式贰份，双方各持壹份，每份具有同等法律效力。
      </p>
      <p class="pdf-content-p bold">&nbsp;</p>
      <p class="pdf-content-p">（以下无正文）</p>
      <p class="pdf-content-p bold">&nbsp;</p>
      <table
        class="pdf-content-table-dot html2pdf__page-break"
        border="1"
        cellspacing="0"
        cellpadding="0"
        width="568"
      >
        <tbody>
          <tr>
            <td width="284" valign="top">
              <p class="pdf-content-p bold" style="margin-bottom: 20px">
                甲方：{{ content.firstParty }}（盖章）
              </p>
            </td>
            <td width="284" valign="top">
              <p class="pdf-content-p bold" style="margin-bottom: 20px">
                乙方 {{ content.secondParty }}（盖章）
              </p>
            </td>
          </tr>
          <tr style="border-top: none">
            <td width="284" valign="top">
              <p class="pdf-content-p bold">
                日期: {{ content.signDate | dateFilter('YYYY-MM-DD') }}
              </p>
            </td>
            <td>
              <p class="pdf-content-p bold">
                日期: {{ content.signDate | dateFilter('YYYY-MM-DD') }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <h2 class="pdf-content-h2" style="margin-bottom: 25px">服务条款</h2>
        <p class="pdf-content-p bold">
          本服务条款是{{ content.secondParty }}（以下简称“{{ shortName }}”）与您就{{
            shortName
          }}所提供服务的相关事项所订立的有效合约。
        </p>
        <p class="pdf-content-p bold">
          关于本服务条款，提示您特别关注限制、免责、{{
            shortName
          }}对您违约行为的认定处理条款，以及管辖法院的选择条款等，前述条款可能以加粗或下滑线的形式提示您注意。在接受本服务之前，请您仔细阅读本服务条款的全部内容。如果您对本服务条款有疑问的，请通过{{
            shortName
          }}相关业务部门进行询问，{{
            shortName
          }}将向您解释条款内容。如果您不同意本服务条款的任意内容，或者无法准确理解{{
            shortName
          }}对条款的解释，请不要进行后续合作。
        </p>
        <h3 class="pdf-content-h3">1.服务范围</h3>
        <p class="pdf-content-p bold">1.1服务内容：</p>
        <p class="pdf-content-p">为甲方提供专业的通信运营商物联网SIM卡及相关的流量套餐服务。</p>
        <p class="pdf-content-p bold">1.2服务期限：（以协议主文约定为准）</p>
        <p class="pdf-content-p">
          本协议期限届满前，双方均未提出书面终止要求，且甲方继续使用乙方服务，则视为双方同意本协议自动顺延一年协议期，此类自动顺延不设定次数限制。
        </p>
        <p class="pdf-content-h3">2.价款和支付方式</p>
        <p class="pdf-content-p bold">2.1 价款:</p>
        <p class="pdf-content-p bold">2.1.1包含SIM卡和流量套餐两部分。</p>
        <p class="pdf-content-p bold">2.1.2数量：按照甲方实际购买、激活使用的数量。</p>
        <p class="pdf-content-p bold">2.1.3种类：</p>
        <p class="pdf-content-p">（1）物联网普通流量卡</p>
        <p class="pdf-content-p">月卡：以月为单位，卡内流量仅可当月使用。不可结转。</p>
        <p class="pdf-content-p">年卡：以年为单位，卡内流量可在360天内流动使用。不可结转。</p>
        <p class="pdf-content-p">（2）物联网NB卡</p>
        <p class="pdf-content-p">
          以运营商侧套餐周期为单位，卡内流量可在套餐周期内使用，不可结转。
        </p>
        <p class="pdf-content-p bold">2.1.4总价款=收费标准*相应数量</p>
        <p class="pdf-content-p bold">2.2 流量账单期：</p>
        <p class="pdf-content-p">
          流量账单期从物联网卡激活之日起计算，其中月卡流量账单期从激活日至当月月末；年卡流量账单期从激活日当日起算至360天后截止。
        </p>
        <p class="pdf-content-p">
          <span style="font-weight: 700">2.3 支付方式：</span>甲方实际购买后3个工作日内一次性付清。
        </p>
        <p class="pdf-content-p bold">2.4收款账户信息：</p>
        <p class="pdf-content-p">乙方银行收款账户信息如下：</p>
        <p class="pdf-content-p">户名：{{ content.secondParty }}</p>
        <p class="pdf-content-p">开户行：{{ bankAccount.bank }}</p>
        <p class="pdf-content-p">账号：{{ bankAccount.account }}</p>
        <p v-if="bankAccount.alipay" class="pdf-content-p">
          支付宝收款账户信息如下：{{ bankAccount.alipay }}
        </p>
        <p v-if="bankAccount.liaison" class="pdf-content-p">联行号：{{ bankAccount.liaison }}</p>
        <p class="pdf-content-p bold">
          2.5发票的开具方式：在甲方付清款项后，乙方开具发票，预付款项不可退。
        </p>
        <p class="pdf-content-h3">3.甲方权利及义务</p>
        <p class="pdf-content-p">
          3.1
          甲方可根据自己的要求选择确定电信运营商且有权按照本协议使用乙方提供的物联网卡及流量套餐服务。
        </p>
        <p class="pdf-content-p">
          3.2 物联网卡可在激活宽限期内激活，激活宽限期为购卡之日起{{
            content.activationDay
          }}天，超出激活宽限期次日将被自动激活；激活之后不可退卡。
        </p>
        <p class="pdf-content-p">
          3.3
          甲方应当根据国家相关法律、法规的要求使用、管理物联网卡，不得将乙方提供的物联网卡授权给任何第三方使用，非因乙方过错导致丢失、被盗等情况，甲方应自行承担相关责任。
        </p>
        <p class="pdf-content-p">
          3.4
          甲方在使用乙方提供的物联网卡时因操作不当、发送内容不当或发送用户的范围不当，造成本协议任何一方或电信运营商与用户之间的纠纷或遭到用户的投诉，应由甲方负责解决，并承担由此对乙方造成相关损失（包括但不限于乙方的直接损失；乙方在处理此类纠纷过程中产生的律师费、公证费等费用）。
        </p>
        <p class="pdf-content-p">
          3.5
          物联网卡通信终端丢失或被盗用的，甲方应及时拨打乙方客服电话或到乙方营业地点办理暂停通信服务、修改服务密码等手续，并向公安机关报案。
        </p>
        <p class="pdf-content-p">
          3.6
          甲方及时支付费用，如甲方未及时支付费用，乙方有权中止提供服务；待甲方支付成功后，乙方将继续提供服务。
        </p>
        <p class="pdf-content-p html2pdf__page-break" style="margin-bottom: 40px">
          3.7 甲方承诺向乙方购买的物联网卡仅使用于甲方<span style="font-weight: 700">{{
            content.business
          }}</span
          >业务中（采购订单另有约定的，则以采购订单为准）。甲方所购物联网卡不得在线上单独销售,线上销售必须与智能设备捆绑销售。若因您存在裸卡转售行为，而被运营商、工信部或相关部门查处，乙方有权要求您支付不低于2万元人民币的违约金并关停您账号下的所有物联网卡，上述违约金不足以弥补乙方损失的，您还需按实际损失（包括但不限于直接损失、预期利益损失、商誉损失等）进行补充赔偿。同时，若甲方设备漫游到运营商高危地区，出现信息安全事件，由此产生的损失和一切责任由甲方承担，乙方将配合国家相关部门（工信部、公安部等）取证。
        </p>
        <p class="pdf-content-h3">4.乙方权利及义务</p>
        <p class="pdf-content-p">
          4.1
          乙方应当按照协议约定为甲方提供物联网卡及流量套餐服务，有权定期或不定期检查甲方使用的物联网卡，以检查甲方的使用和操作符合法律法规及运营商政策。若发现甲方未遵守相关法律法规及运营商政策，乙方有权关闭提供给甲方的物联网卡，停止服务并终止本协议。
        </p>
        <p class="pdf-content-p">
          4.2
          乙方应为甲方提供相应售后支持人员，保障提供给甲方的物联网卡稳定运行，若发生故障，需及时响应及修复。
        </p>
        <p class="pdf-content-p">
          4.3
          乙方发现甲方出现异常巨额通信费用的，应及时进行数据核实，在权限范围内采取限制、暂停通信服务等技术措施，并积极协助甲方调查情况。甲方申报通信费用异常增长的，乙方应积极协助查询，并按照甲方要求采取限制、暂停通信服务等技术措施。异常巨额通信费用，是指突然出现超过甲方此前3个月平均通信费用5倍以上的费用。非因乙方过错造成上述情况的，乙方不承担责任。
        </p>
        <p class="pdf-content-p">
          4.4
          甲方提供虚假登记资料或甲方登记资料内容变更未及时通知乙方，未在乙方给出的合理期限内完成整改或乙方有合理理由认为影响乙方正常履行合同的，乙方有权限制、暂停、终止通信服务。
        </p>
        <p class="pdf-content-p">
          4.5
          乙方收到国家行政、司法机关通知，甲方的物联网卡等被认定用于违法犯罪活动或其他不当用途的，或被第三方投诉用于违规发送商业信息的，乙方有权限制、暂停、终止通信服务，甲方应自行承担相应后果。
        </p>
        <p class="pdf-content-p">
          4.6
          乙方享有收取费用的权利，如甲方未及时支付费用，乙方有权中止提供服务。在合同有效期内，如合同赖以成立的基础运营商产品价格体系发生重大变化，继续维持合同的原有效力则显失公平，乙方有权另行确定新的结算价格及生效时间并向甲方发出通知；若甲方不同意新的结算价格，乙方有权单方面解除合同。在此情况下，乙方终止协议，不视为乙方违约。
        </p>
        <p class="pdf-content-p">
          4.7
          在合同有效期内，若运营商计费规则发生变化，乙方有权另行确定新的结算价格。乙方需提前以书面形式通知甲方，若甲方在价格调整生效日后继续使用物联网卡套餐服务的，视为甲方接受上述调整，则甲方需在调整生效后10个工作日内按新的结算价格补足费用差额；若甲方不同意新的结算价格，乙方有权单方面解除本协议，乙方需在协议终止后10个工作日内按甲方实际使用的时间及流量结算服务费用，并返还甲方剩余费用。
        </p>
        <p class="pdf-content-p html2pdf__page-break">
          4.8
          合同期内，因技术进步，现行使用的网络进行整体换代升级或变更调整（如2G退网），甲方无法享有约定的电信服务的，乙方应及时在后台公告通知。在此情况下导致甲方无法享有约定的电信服务，不视为乙方违约，乙方不承担任何责任。
        </p>
        <p class="pdf-content-h3">5.保密条款</p>
        <p class="pdf-content-p">
          5.1
          本协议及本协议任何一方因协议的履行而获得或知悉的对方的任何资料和信息均视为保密信息，双方相互负有保密义务。任何一方未经对方书面同意，不可将上述保密信息以任何方式向第三方披露或用于本协议以外的其他事项，但法律、法规另有规定或监管部门另有要求的除外。
        </p>
        <p class="pdf-content-p">
          5.2
          甲方不得擅自泄露、盗取、修改、复制乙方所提供的物联网卡信息。若乙方发现或明确证据证明因甲方原因导致信息泄露、复制、盗取、修改，甲方则需按照乙方提供证据所产生的损失进行赔偿，乙方有权立即终止本协议。
        </p>
        <p class="pdf-content-p">
          5.3
          本保密条款将持续有效。本协议或其中任何条款的终止、中止、失效、无效均不影响本保密条款的效力。
        </p>
        <p class="pdf-content-h3">6.违约责任</p>
        <p class="pdf-content-p">
          6.1
          若因甲方在业务使用方面违反法律、法规、规章及相关条例，造成甲方物联网卡被运营商暂停使用，乙方有权关闭甲方物联网管理平台账号，同时本协议自动终止，若造成乙方任何损失，甲方应承担相关的法律责任，并赔偿乙方直接经济损失以及乙方在处理此类纠纷过程中产生的律师费、公证费等费用。
        </p>
        <p class="pdf-content-p">
          6.2
          甲方未根据本协议的约定支付价款的，乙方有权暂时中止向甲方提供服务。自乙方向甲方中止提供服务之日起15日内，甲方仍未补足价款的，乙方有权终止本协议履行，并要求甲方履行付款义务。甲方迟延付款期间，按每日千分之三的标准向乙方支付迟延履行违约金。
        </p>
        <p class="pdf-content-p">
          6.3
          如甲方违反本合同3.7条约定，未按本合同约定范围或超范围使用物联网卡的，乙方可暂停直至终止向甲方提供通信服务、解除协议，由此产生的法律责任由甲方自行承担。同时，乙方有权取消已给予甲方的所有优惠，甲方应补交超范围使用的物联网卡所享受的优惠资费与正常资费之间的差额。给乙方造成损失的，甲方还应承担相应的赔偿责任。
        </p>
        <p class="pdf-content-p">
          6.4
          若甲方存在其他违约情形，乙方有权在书面通知甲方后，中止向甲方提供服务。自乙方向甲方中止提供服务之日起15日内，甲方仍未改正的，乙方有权向甲方发出通知，终止本协议的履行。若造成乙方任何损失，甲方应承担相关的法律责任，并赔偿乙方直接经济损失以及乙方在处理此类纠纷过程中产生的律师费、公证费等费用。
        </p>
        <p class="pdf-content-p">
          6.5
          因甲方违约，乙方依法解除本协议，甲方预付款尚有余额的，乙方不予退还；因乙方违约，甲方依法解除本协议，甲方预付款尚有余额的，乙方应当予以无息退还。
        </p>
        <p class="pdf-content-p html2pdf__page-break">
          6.6
          不论本协议中是否存在其他相反条款，乙方的任何违约或赔偿的总额不应超过对应采购订单总价款的30%。
        </p>
        <p class="pdf-content-h3">7.不可抗力、意外事件与免责</p>
        <p class="pdf-content-p">
          7.1“不可抗力”是指协议双方不能合理控制、不可预见或即使预见亦无法避免的事件，该事件妨碍、影响或延误任何一方根据协议履行其全部或部分义务。意外事件是指包括但不限于政府行为、基础运营商政策（管理和技术）行为、自然灾害、战争、电脑病毒、黑客攻击、乙方不可控制的ChinaNet骨干网故障、传输网故障或特定第三方的网络故障、带宽或其他网络设备或技术提供商的服务延迟、服务故障或任何其它类似事件。
        </p>
        <p class="pdf-content-p">
          7.2由于上述不可抗力或意外事件致使协议的部分或全部不能履行或延迟履行，则根据不可抗力、意外事件的影响，遭受不可抗力、意外事件一方可部分或全部免除违约责任。
        </p>
        <p class="pdf-content-p">
          7.3当事人一方因不可抗力、意外事件不能履行协议的，应当及时通知对方，以减轻可能给对方造成的损失，并应当在合理期限内提供证明。未履行通知义务而致损失扩大的，过错方应当承担赔偿责任。
        </p>
        <p class="pdf-content-p">7.4任何一方迟延履行后发生不可抗力、意外事件的，不能免除责任。</p>
        <p class="pdf-content-p">
          7.5
          若因全国通信网络业务升级，运营商停止提供2G网络服务，甲方应自行升级受影响终端。若因2G退网造成甲方无法使用本协议项下服务，不视为乙方违约，且剩余套餐费用不予退还。
        </p>
        <p class="pdf-content-p">
          7.6
          若因运营商网络升级或难以避免、难以排除的技术或网络故障或第三方原因（包括但不限于黑客、病毒、电信部门技术调整和骨干线路中断等）造成甲方无法使用本协议项下服务，不视为乙方违约，但乙方应积极协调相关部门尽快解决上述问题。
        </p>
        <p class="pdf-content-h3">8.协议的变更与终止</p>
        <p class="pdf-content-p">
          8.1 本协议有效期内，双方可就需要变更的内容重新协商，并签订书面补充协议。
        </p>
        <p class="pdf-content-p">
          8.2 本协议有效期内，双方可以通过友好协商，以书面方式中止、终止本协议。
        </p>
        <p class="pdf-content-p">
          8.3
          在有限期内，甲方要求变更套餐内容或终止协议，需提前30天提出书面申请，并由甲乙双方协商确认具体变更事项。
        </p>
        <p class="pdf-content-p">
          若甲方选择月卡，提出变更申请当月应按照正常套餐资费支付乙方服务费。次月按照新套餐费用重新计费。
        </p>
        <p class="pdf-content-p">
          若甲方选择年卡，套餐资费提升，甲方需在提出申请后15日内补足差额。套餐资费下降，乙方不予退款，超出费用将为甲方预留到下一年。第二年若不予使用将自动过期.
        </p>
        <p class="pdf-content-p  html2pdf__page-break">
          8.4
          在合同有效期内，如合同赖以成立的基础运营商产品价格体系发生重大变化，继续维持合同的原有效力则显失公平，乙方有权另行确定新的结算价格及生效时间并通知甲方；若甲方不同意新的结算价格，乙方有权单方面解除合同。在此情况下，乙方终止协议，不视为乙方违约。
        </p>
        <p class="pdf-content-h3">9.终止通信服务</p>
        <p class="pdf-content-p">
          9.1
          甲方申请终止通信服务的，应在缴清通信费用及违约金（如有）后办理退网手续，账户余额（如有）乙方应无息退还甲方，双方另有约定的除外。
        </p>
        <p class="pdf-content-p">
          9.2 除本合同另有约定外，有下列情形之一的，乙方有权单方终止通信服务，并追究甲方违约责任：
        </p>
        <p class="pdf-content-p">
          9.2.1 甲方擅自改变通信服务使用性质或私自转让、出租通信服务资源的；
        </p>
        <p class="pdf-content-p">9.2.2 甲方有其他严重违反法律、法规、规章行为的。</p>
        <p class="pdf-content-h3">10.法律适用与争议解决</p>
        <p class="pdf-content-p">10.1 本协议适用中华人民共和国法律。</p>
        <p class="pdf-content-p">
          10.2
          本协议的解释、履行发生的争议，双方首先应当协商解决。双方不能通过友好协商解决争议的，任何一方均可将争议提交乙方所在地有管辖权的人民法院审理。
        </p>
        <p class="pdf-content-p">11.附则</p>
        <p class="pdf-content-p">
          11.1本协议未尽事宜由甲、乙双方友好协商后，以书面形式加以确认补充。补充协议经双方盖公章或合同专用章后生效，补充协议与主协议具有同等法律效力，补充协议与主协议不一致的，以补充协议为准。
        </p>
        <p class="pdf-content-p">
          11.2
          如果任何条款在性质上或其他方面理应的在此协议终止时继续存在，那么应视为继续存在的条款，这些条款包括但不限于保证条款、保密条款、知识产权条款法律适用及争议解决条款。
        </p>
      </div>
    </template>
  </vue-html2pdf>
</template>

<script>
import { safeGet } from '@/global/function/safe-operations'
import VueHtml2pdf from '@/page/components/wh-html2pdf/wh-html2pdf'
import moment from 'moment'
import Mixins from '@/page/manage/children/client/children/template-contract/mixins/consts'
import { BUSSNESS_SCOPE_TYPE_1 } from '@/page/manage/children/client/children/template-contract/mixins/consts'
const img = `data:image/png;base64,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0p8zAAA/m2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTctMDQtMjRUMTY6MjQ6MjkrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE3LTA0LTI0VDE2OjI1OjAzKzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNy0wNC0yNFQxNjoyNTowMyswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6ZjVhNTAyZDEtOTZhNi00MTczLWJhZDQtZjZmNzNjNTAwZmVhPC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NjE0NjkxZmUtNjhlZC0xMTdhLTllMjgtZWM1OTk3MTM3Mjg0PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6OTU4MmZkODItMzgwYS00NTNmLWE3NDEtZjIwMjZlYzU4NTNiPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjk1ODJmZDgyLTM4MGEtNDUzZi1hNzQxLWYyMDI2ZWM1ODUzYjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wNC0yNFQxNjoyNDoyOSswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjlmMzZjYzNhLTY0YWUtNDUzNS1iZDU4LWNkODQzNGQ0MGJiZTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wNC0yNFQxNjoyNTowMyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmY1YTUwMmQxLTk2YTYtNDE3My1iYWQ0LWY2ZjczYzUwMGZlYTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0wNC0yNFQxNjoyNTowMyswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDo5ZjM2Y2MzYS02NGFlLTQ1MzUtYmQ1OC1jZDg0MzRkNDBiYmU8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6OTU4MmZkODItMzgwYS00NTNmLWE3NDEtZjIwMjZlYzU4NTNiPC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICAgICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6OTU4MmZkODItMzgwYS00NTNmLWE3NDEtZjIwMjZlYzU4NTNiPC9zdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjU5NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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`

export default {
  components: {
    VueHtml2pdf
  },
  mixins: [Mixins],
  props: {
    isPreview: {
      type: Boolean
    },
    content: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  computed: {
    shortName() {
      const shorts = {
        上海启奈信息科技有限公司: '上海启奈',
        杭州芯博士网络科技有限公司: '芯博士'
      }
      return shorts[this.content.secondParty] || ''
    },
    serviceBegin() {
      let v = safeGet(this.content, 'serviceBegin', '0-0-0')
      if (v && typeof v === 'object') {
        v = moment(v).format('YYYY-MM-DD')
      }
      return v ? v.split('-') : []
    },
    serviceEnd() {
      let v = safeGet(this.content, 'serviceEnd', '0-0-0')
      if (v && typeof v === 'object') {
        v = moment(v).format('YYYY-MM-DD')
      }
      return v ? v.split('-') : []
    },
    bankAccount() {
      const accounts =
        this.content.businessScope === BUSSNESS_SCOPE_TYPE_1.intl
          ? this.bankAccountsIntl
          : this.bankAccounts
      return (
        accounts[this.content.secondParty] || {
          bank: '',
          account: '',
          alipay: '',
          liaison: ''
        }
      )
    }
  },
  methods: {
    async generatePdf() {
      return this.$refs.frameContractPdf.generatePdf()
    },
    getFileName(type) {
      return `${type}${this.isPreview ? '预览' : ''}`
    },
    hasDownloaded(...args) {
      this.$emit('hasDownloaded', ...args)
    },
    async frameModifyPdf(html2PdfSetup) {
      const pdfFile = await html2PdfSetup.toPdf().get('pdf')
      const pages = pdfFile.getNumberOfPages()
      for (let i = 1; i <= pages; i++) {
        pdfFile.setPage(i)
        pdfFile.addImage(img, 'PNG', pdfFile.getPageWidth() - 120 - 80, 45, 108, 25)
        pdfFile.setPage(i)
        pdfFile.setFontSize(10)
        pdfFile.setTextColor(150)
        pdfFile.text(`${i} / ${pages}`, pdfFile.getPageWidth() / 2, pdfFile.getPageHeight() - 56)
      }
      return pdfFile
    }
  }
}
</script>
<style scoped lang="scss">
* {
  font-family: 'pdf-font';
}
.pdf-content {
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
