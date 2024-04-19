class formObject {
  constructor(id) {
    this.id = 0
    this.carrier = "" //运营商
    this.volume =  1024 //规格
    this.volumeUnit = "MB" //规格单位（MB：流量，C：次数）
    this.validity = 0 //周期（0：按月）
    this.status = 1 //状态（0:关闭，1:开启）
  }
}

export default formObject
