import prefectures from './prefectures.json'
import {parsePostalCode} from './parsePostalCode'

// 全角数字やスペースを半角に変換する
export function convertFullWidthToHalfWidth(address: string): string {
  return address.replace(/[Ａ-Ｚａ-ｚ０-９　]/g, (s) => {
    if (s === '　') {
      return ' ';
    }
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  })
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
  address = address
    .replace(/(\d)(丁目|丁|番地の|番の|番地|番|号室|号|組|の)/g, '$1-')
    .replace(/-(丁目|丁|番地の|番の|番地|番|号室|号|組)/g, '')
    .replace(/-$/, '')
  return address
}

// 数字と数字の間にある紛らわしい横棒を半角ハイフンに変換する
export function convertConfusingHyphens(address: string): string {
  return address.replace(/(\d)[ー－―‐−‒—–ｰ─━一](?=\d)/g, '$1-')
}

// 都道府県を抽出する
export function extractPrefecture(address: string): string {
  let prefecture = ''
  const prefectureList = Object.keys(prefectures)
  const searchRange = address.slice(0, 14)
  for (const pref of prefectureList) {
    if (searchRange.includes(pref)) {
      prefecture = pref
      break
    }
  }
  return prefecture
}

// 市区町村を抽出する
export function extractCity(address: string, prefecture: string): string {
  if (prefecture) {
    const prefIndex = address.indexOf(prefecture) + prefecture.length
    address = address.slice(prefIndex)
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
export function extractTown(address: string, city: string): string {
  if (city) {
    const cityIndex = address.indexOf(city) + city.length
    address = address.slice(cityIndex)
  }
  if (!city) {
    const prefecture = extractPrefecture(address)
    if (prefecture) {
      const prefectureIndex = address.indexOf(prefecture) + prefecture.length
      address = address.slice(prefectureIndex)
    }
  }
  const blockMatch = address.match(/(\d+(-\d+)*)(.*)$/)
  if (blockMatch) {
    address = address.slice(0, blockMatch.index)
  }
  address = address.replace(/[A-Za-z0-9\-]+$/, '').trim()
  return address
}

// 番地を抽出する
export function extractBlock(address: string, city: string = '', town: string = ''): string {
  const townIndex = address.indexOf(city + town) + (city.length + town.length)
  address = address.slice(townIndex)
  // address の末尾が階数の場合、それを除外する
  const floorMatch = address.match(/\-\d+階/)
  address = floorMatch ? address.slice(0, floorMatch.index) : address
  // 番地を抽出する
  const blockMatch = address.match(/^\d+(-\d+)*/)
  return blockMatch ? blockMatch[0] : ''
}

// 建物名を抽出する
export function extractBuilding(address: string, town: string, block: string): string {
  if (!town && !block) {
    return ''
  }
  // 番地が短いと郵便番号と誤判定する可能性があるので町名と合わせて検索する
  const blockIndex = address.indexOf(town + block) + town.length + block.length
  address = address.slice(blockIndex).trim()
  if (address.startsWith('-')) {
    // TODO FIXME 建物名の１文字目がハイフンの場合、部屋番号などが番地に含まれてしまっている可能性があるので要修正
    // 例えば「丸の内1-2-3 1-A」みたいな住所だと、序盤でスペースが消されてしまっているので「丸の内1-2-31」と「-A」になり失敗する
    address = address.slice(1).trim()
  }
  return address
}
