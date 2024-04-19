export const baseLineOptionCreate = (data) => {
  let op = {
    legend: {
      top: 15,
      right: 0,
      orient: 'vertical',
    },
    'tooltip': {
      'trigger': 'axis',
      formatter: (row) => {
        let n = `${row[0].name}<br>`
        for(const e of row) {
          n += e.marker + `${e.seriesName}: ${e.data}元 <br>`
        }
        return n
      }
    },
    grid: {
      left: '5%',
      right: '8%',
      bottom: '14%',
      top: '3%',
      containLabel: true
    },

    xAxis: { type: 'category' , data: data.month},
    yAxis: { gridIndex: 0 },
    series: [
      { type: 'line', smooth: true, seriesLayoutBy: 'row', data: data.renew, name: '续费' },
      { type: 'line', smooth: true, seriesLayoutBy: 'row', data: data.buyCard, name: '购卡'}
    ]
  }
  if (data.month.length > 12) {
    op.dataZoom = [
      {
        id: 'dataZoomX',
        type: 'slider',
        filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
        startValue: data.month.length - 12,
        endValue: data.month.length,
        zoomLock: true
      }
    ]
  }
  return op
}

export const planOptionCreate = ({ priceOfferName, money }, color = '#b34041') => {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}元',
      axisPointer: {
        type: 'shadow'
      },
      renderMode: 'richText'
    },
    grid: {
      left: '5%',
      right: '8%',
      bottom: '14%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: priceOfferName
    },
    series: [
      {
        name: '金额',
        type: 'bar',
        data: money,
        itemStyle: {
          color: color
        }
      }
    ]
  }
}

export const incomeMoneyOptionCreate = ({ month, money }) => {
  let op = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}元',
      renderMode: 'richText'
    },
    grid: {
      left: '5%',
      right: '8%',
      bottom: '14%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: month
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: money,
      type: 'line'
    }]
  }
  if (month.length > 12) {
    op.dataZoom = [
      {
        id: 'dataZoomX',
        type: 'slider',
        filterMode: 'filter', // 设定为 'filter' 从而 X 的窗口变化会影响 Y 的范围。
        startValue: month.length - 12,
        endValue: month.length,
        zoomLock: true
      }
    ]
  }
  return op
}
