import { v4 as uuidv4 } from "uuid";

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
  id: string;
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
    id: uuidv4(),
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

export function vtConfigItem(vtConfig: any[], prop: string) {
  return vtConfig.find((item) => item.prop === prop);
}

export function vtColClass(vtConfig: any[], prop: string) {
  const item = vtConfigItem(vtConfig, prop);
  return `vt-col ${item.fixed ? "fixed" : ""} ${item.align || ""} ${item.outline || ""} vt-col-${prop}`;
}

export function vtColStyle(vtConfig: any[], prop: string) {
  const item = vtConfigItem(vtConfig, prop);
  return { ...{ width: item.width, order: toNum(item.order) }, ...item.fixed };
}

export function vtFooterData(tableData: any[], vtConfig: any[]) {
  const result: any = {};

  const needToSum = ["quantity", "weight", "money"];

  vtConfig.forEach((item) => {
    if (!item.sum) {
      result[item.prop] = "--";
    } else if (needToSum.includes(item.sum)) {
      let sum = 0;
      if (item.detail) {
        tableData.forEach((row) => {
          row[item.detail].forEach((detailRow: any) => {
            sum += toNum(detailRow[item.prop]);
          });
        });
      } else {
        tableData.forEach((row) => {
          sum += toNum(row[item.prop]);
        });
      }
      result[item.prop] = sum;
    } else {
      result[item.prop] = item.sum;
    }
  });

  return result;
}
