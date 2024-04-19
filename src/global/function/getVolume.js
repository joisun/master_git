/*
 * @Author: SerkeyWu
 * @Date: 2021-02-23 17:16:55
 * @Description: 1C转成1次、1024MB转成1GB、1023MB不变
 * @LastEditors: SerkeyWu
 * @LastEditTime: 2021-02-23 17:30:14
 */
export default function getVolume(volume, volumeUnit) {
  if (volumeUnit === 'M') {
    volumeUnit = 'MB'
  }
  if (volume === 0 && volumeUnit === 'MB') {
    return '0MB'
  }
  if (volume && volume % 1024 === 0 && volumeUnit === "MB") {
    return volume / 1024 + "GB";
  } else if (volumeUnit === "C") {
    return volume + "次";
  } else if (volume % 1024 !== 0 && volumeUnit === 'MB') {
    return volume + "MB";
  }
  return volume + 'GB'
}