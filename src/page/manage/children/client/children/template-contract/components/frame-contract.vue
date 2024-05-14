<template>
  <div class="frame-contract">
    <div class="pdf-content">
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
          本服务条款是{{ content.secondParty }}（以下简称“{{
            shortName
          }}”）与您就上海启奈所提供服务的相关事项所订立的有效合约。
        </p>
        <p class="pdf-content-p bold">
          关于本服务条款，提示您特别关注限制、免责、上海启奈对您违约行为的认定处理条款，以及管辖法院的选择条款等，前述条款可能以加粗或下滑线的形式提示您注意。在接受本服务之前，请您仔细阅读本服务条款的全部内容。如果您对本服务条款有疑问的，请通过上海启奈相关业务部门进行询问，上海启奈将向您解释条款内容。如果您不同意本服务条款的任意内容，或者无法准确理解上海启奈对条款的解释，请不要进行后续合作。
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
        <p class="pdf-content-p" style="margin-bottom: 40px">
          3.7 甲方承诺向乙方购买的物联网卡仅使用于甲方<span style="font-weight: 700">{{
            content.business
          }}</span
          >业务中（采购订单另有约定的，则以采购订单为准）。甲方所购物联网卡不得在线上单独销售,线上销售必须与智能设备捆绑销售,同时,若甲方设备需漫游到运营商高危地区,如新疆省维吾尔族自治区,需提前向乙方申报,并且将设备的IMEI号提供乙方报备,若甲方违规使用,出现信息安全事件,由此产生的损失和一切责任由甲方承担,乙方将配合国家相关部门(工信部、公安部)取证。
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
        <p class="pdf-content-p">
          4.8
          合同期内，因技术进步，现行使用的网络进行整体换代升级或变更调整，甲方无法享有约定的电信服务的，乙方应及时在后台公告通知。在此情况下导致甲方无法享有约定的电信服务，不视为乙方违约，乙方不承担任何责任。
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
          因运营商原因造成的，如通道端口速率低、通道堵塞等情况，乙方不承担相应的责任，但应积极协调相关电信运营商尽快解决上述问题。
        </p>
        <p class="pdf-content-p">
          7.6
          对于因网关或其他网络故障等不可预见的原因引起的发送中断，乙方不承担相应责任，但乙方应及时通知甲方，并积极采取措施尽快修复。
        </p>
        <p class="pdf-content-p">
          7.7
          如因目前的技术发展水平难以避免、难以排除的技术或网络故障造成甲方接受的服务受到影响，不视为乙方违约。但乙方将尽最大努力争取在最短时间内解决。
        </p>
        <p class="pdf-content-h3">8.协议的变更与终止</p>
        <p class="pdf-content-p">
          8.1 本协议有效期内，双方可就需要变更的内容重新协商，并签订书面补充协议。
        </p>
        <p class="pdf-content-p">
          8.2 本协议有效期内，双方可以通过友好协商，以书面方式中止、终止本协议。
        </p>
        <p class="pdf-content-p">
          8.3 在有限期内，甲方要求变更套餐内容或终止协议，需提前30天提出书面申请。
        </p>
        <p class="pdf-content-p">
          若甲方选择月卡，提出变更申请当月应按照正常套餐资费支付乙方服务费。次月按照新套餐费用重新计费。
        </p>
        <p class="pdf-content-p">
          若甲方选择年卡，套餐资费提升，甲方需在提出申请后15日内补足差额。套餐资费下降，乙方不予退款，超出费用将为甲方预留到下一年。第二年若不予使用将自动过期.
        </p>
        <p class="pdf-content-p">
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
    </div>
  </div>
</template>
<script>
import { safeGet } from '@/global/function/safe-operations'
import moment from 'moment'
import Mixins from '@/page/manage/children/client/children/template-contract/mixins/consts'

export default {
  mixins: [Mixins],
  props: {
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
    // TODO bankAccount
    bankAccount() {
      return (
        this.bankAccounts[this.content.secondParty] || {
          bank: '',
          account: '',
          alipay: ''
        }
      )
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
