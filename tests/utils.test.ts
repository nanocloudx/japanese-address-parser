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
} from '../src/utils'

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
  it('数字と数字の間にある紛らわしい横棒を半角ハイフンに変換する', () => {
    const address = '01一23─45ー67━89'
    const result = convertConfusingHyphens(address)
    expect(result).toBe('01-23-45-67-89')
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
    const city = extractCity(address, '東京都')
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
    const town = extractTown(address, '千代田区')
    expect(town).toBe('丸の内')
  })
})

describe('extractBlock', () => {
  it('番地を抽出する1', () => {
    const address = '東京都千代田区丸の内1JPタワー'
    const block = extractBlock(address, '千代田区', '丸の内')
    expect(block).toBe('1')
  })
  it('番地を抽出する2', () => {
    const address = '東京都千代田区丸の内1-2JPタワー'
    const block = extractBlock(address, '千代田区', '丸の内')
    expect(block).toBe('1-2')
  })
  it('番地を抽出する3', () => {
    const address = '東京都千代田区丸の内1-2-3-4-5JPタワー'
    const block = extractBlock(address, '千代田区', '丸の内')
    expect(block).toBe('1-2-3-4-5')
  })
  it('番地を抽出する4', () => {
    const address = '東京都千代田区有楽町2-10-1東京交通会館'
    const block = extractBlock(address, '千代田区', '有楽町')
    expect(block).toBe('2-10-1')
  })
  it('番地を抽出する5', () => {
    const address = '山梨県南巨摩郡南部町南部8050-1'
    const block = extractBlock(address, '南巨摩郡南部町', '南部')
    expect(block).toBe('8050-1')
  })
})
describe('extractBuilding', () => {
  it('建物名を抽出する', () => {
    const address = '東京都千代田区丸の内1-2-3JPタワー'
    const building = extractBuilding(address, '丸の内', '1-2-3')
    expect(building).toBe('JPタワー')
  })
})
