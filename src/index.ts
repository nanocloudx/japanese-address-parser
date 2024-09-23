import {
  convertFullWidthToHalfWidth,
  convertKanjiNumbers,
  convertToHalfWidthHyphen,
  convertConfusingHyphens,
  extractPrefecture,
  extractCity,
  inferPrefectureFromCity,
  extractTown, extractBlock, extractBuilding
} from './utils'

/**
 * 郵便番号文字列を「999-9999」の形式に修正する
 */
export function parsePostalCode(postal: string) {
  if (!postal) return ''
  // 全角数字を半角数字に変換する
  postal = convertFullWidthToHalfWidth(postal)
  // 数字以外の文字を削除する
  postal = postal.replace(/[^0-9]/g, '')
  // 7桁の数字でない場合は空文字を返す
  if (postal.length !== 7) return ''
  // 3桁と4桁にセパレートし、間に半角ハイフンを追加する
  return `${postal.slice(0, 3)}-${postal.slice(3)}`
}

/**
 * 住所文字列を「都道府県」「市区町村」「町域」「番地」「建物名」に分解する
 */
export function parseAddress(address: string) {
  const raw = address
  if (!address) {
    return {prefecture: '', city: '', town: '', block: '', building: '', full: '', raw}
  }
  // 全角数字は半角数字に変換する
  address = convertFullWidthToHalfWidth(address)
  // 数字と数字の間に挟まれた横棒は全て半角ハイフンに変換する
  address = convertConfusingHyphens(address)
  // 「丁目」や「番地」などの前にある漢数字を数字に変換する
  address = convertKanjiNumbers(address)
  // 数字の後にある「丁目」や「番地」などを半角ハイフンに変換する
  address = convertToHalfWidthHyphen(address)
  // スペースを削除する
  address = address.replace(/\s/g, '')

  // 都道府県を抽出する
  let prefecture = extractPrefecture(address)
  // 市区町村を抽出する
  const city = extractCity(address)
  // 都道府県が無い場合、市区町村から推定する
  if (!prefecture && city) {
    prefecture = inferPrefectureFromCity(city)
  }
  // 町名を抽出する
  const town = extractTown(address)
  // 番地を抽出する
  const block = extractBlock(address)
  // 建物名を抽出する
  const building = extractBuilding(address)
  // 全て結合したものを作成
  const full = `${prefecture}${city}${town}${block} ${building}`

  return {
    prefecture,
    city,
    town,
    block,
    building,
    full,
    raw
  }
}
