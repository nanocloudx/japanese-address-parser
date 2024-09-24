import {
  convertFullWidthToHalfWidth,
} from './utils'

/**
 * 郵便番号文字列を「999-9999」の形式に修正する
 */
export function parsePostalCode(postal: string) {
  if (!postal) return ''
  postal = postal.replace(/[\s　]+/g, '')
  // 文字列の先頭9文字を対象とする
  postal = postal.slice(0, 9)
  // 全角数字を半角数字に変換する
  postal = convertFullWidthToHalfWidth(postal)
  // 数字以外の文字を削除する
  postal = postal.replace(/[^0-9]/g, '')
  // 7桁の数字でない場合は空文字を返す
  if (postal.length !== 7) return ''
  // 3桁と4桁にセパレートし、間に半角ハイフンを追加する
  return `${postal.slice(0, 3)}-${postal.slice(3)}`
}
