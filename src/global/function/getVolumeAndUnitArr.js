export default function (volumeAndUnit) {
  const p = /([0-9]+)(MB|C|GB)/
  const testResult = p.exec(volumeAndUnit)
  let volume = testResult.length ? parseInt(testResult[1]) : 0
  let volumeUnit = testResult.length ? testResult[2] : 'MB'
  if (volumeUnit === 'GB') {
    volume *= 1024
    volumeUnit = 'MB'
  }
  return [volume, volumeUnit]
}