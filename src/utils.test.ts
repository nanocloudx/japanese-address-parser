import {describe, it, expect} from 'vitest'
import {
  convertFullWidthToHalfWidth,
  convertKanjiNumbers,
  convertToHalfWidthHyphen,
  convertConfusingHyphens,
  extractPrefecture,
  extractCity,
  inferPrefectureFromCity,
  extractTown,
  extractBlock,
  extractBuilding
} from './utils'

describe('convertFullWidthToHalfWidth', () => {
  it('全角数字を半角数字に変換する', () => {
    const address = '１丁目２番３号'
    const result = convertFullWidthToHalfWidth(address)
    expect(result).toBe('1丁目2番3号')
  })
})

describe('convertKanjiNumbers', () => {
  it('丁番表記の前にある漢数字を数字に変換する', () => {
    const address = '丸の内一丁目二番三号'
    const result = convertKanjiNumbers(address)
    expect(result).toBe('丸の内1丁目2番3号')
  })
  it('丁番表記の前にある漢数字を数字に変換する', () => {
    const address = '一番町2番3号'
    const result = convertKanjiNumbers(address)
    expect(result).toBe('一番町2番3号')
  })
})

describe('convertToHalfWidthHyphen', () => {
  it('数字の後ろにある丁番表記を半角ハイフンに変換する', () => {
    const address = '丸の内1丁目2番3号'
    const result = convertToHalfWidthHyphen(address)
    expect(result).toBe('丸の内1-2-3')
  })
  it('数字の後ろにある丁番表記を半角ハイフンに変換する', () => {
    const address = '丸の内1丁目2番の3号'
    const result = convertToHalfWidthHyphen(address)
    expect(result).toBe('丸の内1-2-3')
  })
  it('数字の後ろにある丁番表記を半角ハイフンに変換する', () => {
    const address = '丸の内1丁目2の3'
    const result = convertToHalfWidthHyphen(address)
    expect(result).toBe('丸の内1-2-3')
  })
})

describe('convertConfusingHyphens', () => {
  it('数字と数字の間にある紛らわしい横棒を半角ハイフンに変換する', () => {
    const address = '丸の内1ー2一3'
    const result = convertConfusingHyphens(address)
    expect(result).toBe('丸の内1-2-3')
  })
})

describe('extractPrefecture', () => {
  it('都道府県を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3JPタワー'
    const prefecture = extractPrefecture(address)
    expect(prefecture).toBe('東京都')
  })
})

describe('extractCity', () => {
  it('市区町村を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3JPタワー'
    const city = extractCity(address)
    expect(city).toBe('千代田区')
  })
})

describe('inferPrefectureFromCity', () => {
  it('市区町村から都道府県を逆引きする(同名の市区町村がない場合)', () => {
    const city = '千代田区'
    const result = inferPrefectureFromCity(city)
    expect(result).toBe('東京都')
  })
  it('市区町村から都道府県を逆引きする(同名の市区町村がある場合)', () => {
    const city = '伊達市'
    const result = inferPrefectureFromCity(city)
    expect(result).toBe('')
  })
})

describe('extractTown', () => {
  it('町名を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3JPタワー'
    const town = extractTown(address)
    expect(town).toBe('丸の内')
  })
})

describe('extractBlock', () => {
  it('番地を抽出する', () => {
    const address = '東京都千代田区丸の内1JPタワー'
    const block = extractBlock(address)
    expect(block).toBe('1')
  })
  it('番地を抽出する', () => {
    const address = '東京都千代田区丸の内1-2JPタワー'
    const block = extractBlock(address)
    expect(block).toBe('1-2')
  })
  it('番地を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3-4-5JPタワー'
    const block = extractBlock(address)
    expect(block).toBe('1-2-3-4-5')
  })
})
describe('extractBuilding', () => {
  it('建物名を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3JPタワー'
    const building = extractBuilding(address)
    expect(building).toBe('JPタワー')
  })
})
