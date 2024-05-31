export function toNum(value: any) {
  return isNaN(Number(value)) ? 0 : Number(value);
}

export function generateRandomString(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export function generateRandomObject(): {
  attr1: string;
  attr2: string;
  attr3: string;
  attr4: string;
  attr5: string;
  attr6: string;
  attr7: string;
  attr8: string;
  attr9: string;
  detail: { detail1: string; detail2: string }[];
} {
  // const attr1Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr2Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr3Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr4Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  // const attr5Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr6Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr7Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr8Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const attr9Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
  const numObjects = Math.floor(Math.random() * 4) + 1; // Random number of objects between 1 and 4

  const detailArray = [];
  for (let i = 0; i < numObjects; i++) {
    const detail_1Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
    // const detail_2Length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
    detailArray.push({
      detail1: generateRandomString(detail_1Length),
      detail2: String(generateRandomNumber(1, 100, Math.random() <= 0.5)),
    });
  }

  return {
    attr1: String(generateRandomNumber(1, 100, Math.random() <= 0.5)),
    attr2: generateRandomString(attr2Length),
    attr3: generateRandomString(attr3Length),
    attr4: generateRandomString(attr4Length),
    attr5: String(generateRandomNumber(1, 100, Math.random() <= 0.5)),
    attr6: generateRandomString(attr6Length),
    attr7: generateRandomString(attr7Length),
    attr8: generateRandomString(attr8Length),
    attr9: generateRandomString(attr9Length),
    detail: detailArray,
  };
}

export function findFirstGreaterOrEqual(arr: number[], target: number): number {
  let left: number = 0;
  let right: number = arr.length - 1;
  let resultIndex: number = arr.length;

  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);

    if (arr[mid] >= target) {
      resultIndex = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return resultIndex;
}

export function cumulativeArray(inputArray: number[]): number[] {
  const outputArray: number[] = [];
  let sum: number = 0;

  for (const num of inputArray) {
    sum += num;
    outputArray.push(sum);
  }

  return outputArray;
}

export function vtSum(list: any[], config: any[]) {
  const result: any = {};
  config.forEach((vtc) => {
    if (!vtc.sum) {
      result[vtc.prop || vtc.type] = "--";
    } else if (vtc.sum === "quantity" || vtc.sum === "weight" || vtc.sum === "money") {
      let sum = 0;
      if (vtc.detail) {
        list.forEach((item) => {
          item[vtc.detail].forEach((childItem: any) => {
            sum += toNum(childItem[vtc.prop]);
          });
        });
      } else {
        list.forEach((item) => {
          sum += toNum(item[vtc.prop]);
        });
      }
      result[vtc.prop || vtc.type] = sum;
    } else {
      result[vtc.prop || vtc.type] = vtc.sum;
    }
  });
  return result;
}

export function formatNum(value: number, formatType: "quantity" | "weight" | "money") {
  return `${value} | ${formatType}`;
}

export function generateRandomNumber(min: number, max: number, isInteger: boolean = false, decimalPlaces: number = 7): number {
  if (min > max) {
    throw new Error("最小值不能大于最大值");
  }

  const randomNum = Math.random() * (max - min) + min;

  if (isInteger) {
    return Math.floor(randomNum);
  } else {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(randomNum * factor) / factor;
  }
}

export function vtc(vtConfig: any[], prop: string) {
  if (prop === "index" || prop === "operations") {
    return vtConfig.find((item) => item.type === prop);
  } else {
    return vtConfig.find((item) => item.prop === prop);
  }
}

export function vtcc(vtConfig: any[], prop: string) {
  const obj = vtc(vtConfig, prop);
  return `col ${obj.fixed ? "fixed" : ""} ${obj.align || ""} ${obj.outline || ""} vtc-${prop}`;
}

export function vtcs(vtConfig: any[], prop: string) {
  const obj = vtc(vtConfig, prop);
  return { ...{ width: obj.width, order: toNum(obj.order) }, ...obj.fixed };
}
