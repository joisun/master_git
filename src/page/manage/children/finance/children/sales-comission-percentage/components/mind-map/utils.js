export function collectByParent(list, keys) {
  const obj = {}
  list.forEach((item) => {
    setNestedValue(
      obj,
      keys.map((key) => item[key]),
      item
    )
  })
  return convertToHierarchy(obj)
}

export function setNestedValue(obj, keys, value) {
  let current = obj
  // Iterate over each key, except the last one
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  // Set the value to the last key
  current[keys[keys.length - 1]] = value
}

export function convertToHierarchy(obj, parentKey = null) {
  const convertLevel = (currentObj, currentParentKey, level = 1) => {
    return Object.entries(currentObj).map(([key, value]) => {
      // Check if the value is an object and not an array, and has nested objects
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.values(value).some((val) => typeof val === 'object')
      ) {
        return convertAndProcessData({
          key,
          level,
          parentKey: currentParentKey,
          children: convertLevel(value, key, level + 1) // Recursively convert children
        })
      } else {
        // Leaf node with actual data
        return convertAndProcessData({ ...value, key, parentKey: currentParentKey, level })
      }
    })
  }

  return convertLevel(obj, parentKey)
}

export function convertAndProcessData(data) {
  if (!data.children) {
    const {
      incomeCommission,
      profitCommission,
      rechargeLimit,
      parentKey,
      rangeValues,
      key,
      type,
      orderType,
      incomeLeft,
      incomeRight,
      profitLeft,
      profitRight,
      level
    } = data
    return {
      incomeCommission,
      profitCommission,
      parentKey,
      rangeValues,
      rechargeLimit,
      key,
      type,
      orderType,
      level,
      incomeLeft,
      incomeRight,
      profitLeft,
      profitRight
    }
  }
  data.children = data.children.map((item) => {
    return {
      ...item,
      key: item.key === '-1' ? Infinity : item.key
    }
  })
  data.children.sort((a, b) => parseInt(a.key) - parseInt(b.key))
  data.children.forEach((child, index, array) => {
    const startRange = index === 0 ? 0 : parseInt(array[index - 1].key)
    const endRange = child.key === Infinity ? Infinity : parseInt(child.key)
    child.rangeValues = [startRange, endRange]
  })
  return {
    ...data,
    incomeRight: data.children[0].incomeRight,
    incomeLeft: data.children[0].incomeLeft
  }
}

export function findNonContinuousRanges(data) {
  let nonContinuousKeys = []
  function checkAndCollectNonContinuous(children) {
    for (let i = 0; i < children.length - 1; i++) {
      // Compare the end of the current range with the start of the next
      if (children[i].rangeValues[1] !== children[i + 1].rangeValues[0]) {
        if (!nonContinuousKeys.includes(children[i].parentKey)) {
          nonContinuousKeys.push(children[i])
        }
      }
      const { incomeRight, profitRight } = children[i]
      const { incomeLeft, profitLeft } = children[i + 1]
      if (incomeRight === incomeLeft || (profitRight && profitLeft && profitRight === profitLeft)) {
        if (!nonContinuousKeys.includes(children[i].parentKey)) {
          nonContinuousKeys.push(children[i])
        }
      }
    }
  }

  function traverseAndCollect(node) {
    if (node.children && node.children.length > 0) {
      // Check and collect keys for the current level
      checkAndCollectNonContinuous(node.children)
      // Recursively check and collect for each child
      for (const child of node.children) {
        traverseAndCollect(child)
      }
    }
  }

  // Start the process from the top level
  data.forEach((item) => traverseAndCollect(item))

  return nonContinuousKeys
}

export function convertHierarchicalDataToFlatArrayRecharge(data) {
  const flatArray = []

  function processLevel3(children, incomeLimit, parentKey, extra) {
    children.forEach((child) => {
      const rechargeLimit = child.rangeValues[1] // Assign incomeLimit from level 2 rangeValues
      if (child.children && child.children.length) {
        processLevel4(child.children, incomeLimit, rechargeLimit, parentKey, extra) // Pass down the incomeLimit and parentKey to level 3
      }
    })
  }
  // Function to traverse and process level 3 items
  function processLevel4(children, incomeLimit, rechargeLimit, parentKey, extra) {
    children.forEach((child) => {
      const profitLimit = child.rangeValues[1] // Assign profitLimit from level 3 rangeValues
      // Push the processed data to the flat array
      flatArray.push({
        type: child.type, // Assuming the type is derived from the parent key
        orderType: child.orderType, // Assuming orderType follows the same assumption as type
        incomeLimit: incomeLimit === Infinity ? -1 : incomeLimit, // Assigned from the parameter passed down from level 2
        profitLimit, // Assigned from level 3 rangeValues
        incomeCommission: child.incomeCommission,
        profitCommission: child.profitCommission,
        profitLeft: child.profitLeft,
        profitRight: child.profitRight,
        rechargeLimit: rechargeLimit === Infinity ? -1 : rechargeLimit, // Assuming a default value as it's not specified how to derive it
        ...extra
      })
    })
  }

  // Function to traverse and process level 2 items
  function processLevel2(children, parentKey) {
    children.forEach((child) => {
      const incomeLimit = child.rangeValues[1] // Assign incomeLimit from level 2 rangeValues
      if (child.children && child.children.length) {
        processLevel3(child.children, incomeLimit, parentKey, {
          incomeLeft: child.incomeLeft,
          incomeRight: child.incomeRight
        }) // Pass down the incomeLimit and parentKey to level 3
      }
    })
  }

  // Start processing from the top-level (level 1)
  data.forEach((item) => {
    if (item.children && item.children.length) {
      processLevel2(item.children, item.key) // Pass down the parent key to level 2
    }
  })

  return flatArray
}

export function convertHierarchicalDataToFlatArray(data) {
  const flatArray = []

  // Function to traverse and process level 3 items
  function processLevel3(children, incomeLimit, extra) {
    children.forEach((child) => {
      const profitLimit = child.rangeValues[1] // Assign profitLimit from level 3 rangeValues
      // Push the processed data to the flat array
      flatArray.push({
        type: child.type, // Assuming the type is derived from the parent key
        orderType: child.orderType, // Assuming orderType follows the same assumption as type
        incomeLimit: incomeLimit === Infinity ? -1 : incomeLimit, // Assigned from the parameter passed down from level 2
        profitLimit, // Assigned from level 3 rangeValues
        incomeCommission: child.incomeCommission,
        profitCommission: child.profitCommission,
        profitLeft: child.profitLeft,
        profitRight: child.profitRight,
        rechargeLimit: -1, // Assuming a default value as it's not specified how to derive it
        ...extra
      })
    })
  }

  // Function to traverse and process level 2 items
  function processLevel2(children, parentKey) {
    children.forEach((child) => {
      const incomeLimit = child.rangeValues[1] // Assign incomeLimit from level 2 rangeValues
      if (child.children && child.children.length) {
        processLevel3(child.children, incomeLimit, {
          incomeLeft: child.incomeLeft,
          incomeRight: child.incomeRight
        }) // Pass down the incomeLimit and parentKey to level 3
      }
    })
  }

  // Start processing from the top-level (level 1)
  data.forEach((item) => {
    if (item.children && item.children.length) {
      processLevel2(item.children, item.key) // Pass down the parent key to level 2
    }
  })

  return flatArray
}

export const levelWidths = {
  INCOME: [0, 70, 350, 'auto'],
  RECHARGE: [0, 70, 350, 160, 'auto']
}
