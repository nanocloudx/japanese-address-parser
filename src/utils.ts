import prefectures from './prefectures.json'

// 全角数字を半角数字に変換する
export function convertFullWidthToHalfWidth(address: string): string {
  return address.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
}

// 丁番表記の前にある漢数字を数字に変換する
export function convertKanjiNumbers(address: string): string {
  const kanjiToNumberMap: { [key: string]: string } = {
    '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
    '六': '6', '七': '7', '八': '8', '九': '9', '〇': '0', '十': '10'
  }
  // 「丁目」「番地」「号」の前にある漢数字を数字に変換
  address = address.replace(/([一二三四五六七八九〇十]+)(丁目|番地|号)/g, (match, p1, p2) => {
    let number = ''
    for (const char of p1) {
      number += kanjiToNumberMap[char] || char
    }
    return number + p2
  })
  // 「番」の前にある漢数字は、漢数字の前が「数字」「ハイフン」「丁目」である場合のみ数字に変換
  address = address.replace(/([0-9\-]|丁目)([一二三四五六七八九〇十]+)(番)/g, (match, p1, p2, p3) => {
    let number = ''
    for (const char of p2) {
      number += kanjiToNumberMap[char] || char
    }
    return p1 + number + p3
  })
  return address
}

// 数字の後ろにある丁番表記を半角ハイフンに変換する
export function convertToHalfWidthHyphen(address: string): string {
  return address
    .replace(/(\d)(丁目|番地|番|号)/g, '$1-')
    .replace(/(丁目|番地|番|号)/g, '')
    .replace(/-(?!\d)/g, '')
}

// 数字と数字の間にある紛らわしい横棒を半角ハイフンに変換する
export function convertConfusingHyphens(address: string): string {
  return address.replace(/(\d)[ー－―‐−‒—–ｰ─━一](?=\d)/g, '$1-')
}

// 都道府県を抽出する
export function extractPrefecture(address: string): string {
  let prefecture = ''
  const prefectureList = Object.keys(prefectures)
  for (const pref of prefectureList) {
    if (address.startsWith(pref)) {
      prefecture = pref
      break
    }
  }
  return prefecture
}

// 市区町村を抽出する
export function extractCity(address: string): string {
  // 都道府県名を取り除く
  const prefecture = extractPrefecture(address)
  if (prefecture) {
    address = address.slice(prefecture.length)
  }
  // 市区町村を抽出する
  let city = ''
  const municipalities = Object.values(prefectures).flat()
  for (const municipality of municipalities) {
    if (address.startsWith(municipality)) {
      city = municipality
      break
    }
  }
  return city
}

// 市区町村から都道府県を逆引きする(同名の市区町村がある場合を除く)
export function inferPrefectureFromCity(city: string): string {
  const possiblePrefectures = []
  for (const [prefecture, cities] of Object.entries(prefectures)) {
    if (cities.includes(city)) {
      possiblePrefectures.push(prefecture)
    }
  }
  return possiblePrefectures.length === 1 ? possiblePrefectures[0] : ''
}

// 町名を抽出する
export function extractTown(address: string): string {
  const city = extractCity(address)
  if (city) {
    const cityIndex = address.indexOf(city) + city.length
    address = address.slice(cityIndex)
  }
  const blockMatch = address.match(/(\d+(-\d+)*)(.*)$/)
  if (blockMatch) {
    address = address.slice(0, blockMatch.index)
  }
  return address.trim()
}

// 番地を抽出する
export function extractBlock(address: string): string {
  const town = extractTown(address)
  if (town) {
    const townIndex = address.indexOf(town) + town.length
    address = address.slice(townIndex)
  }
  const blockMatch = address.match(/^(\d+(-\d+)*)(.*)$/)
  return blockMatch ? blockMatch[1] : ''
}

// 建物名を抽出する
export function extractBuilding(address: string): string {
  const block = extractBlock(address)
  if (block) {
    const blockIndex = address.indexOf(block) + block.length
    address = address.slice(blockIndex)
  }
  return address.trim()
}
