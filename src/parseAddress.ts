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
  const full = `${prefecture}${city}${town}${block}${building ? ' ' + building : ''}`

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
