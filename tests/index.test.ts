import {describe, it, expect} from 'vitest'
import { parseAddress } from '../src'

describe('parseAddress', () => {
  it('東京都千代田区丸の内二丁目7番2号JPタワー', () => {
    const address = '東京都千代田区丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都千代田区丸の内2-7-2 JPタワー',
      raw: '東京都千代田区丸の内二丁目7番2号JPタワー'
    })
  })

  it('千代田区丸の内二丁目7番2号JPタワー', () => {
    const address = '千代田区丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都千代田区丸の内2-7-2 JPタワー',
      raw: '千代田区丸の内二丁目7番2号JPタワー'
    })
  })

  it('東京都丸の内二丁目7番2号JPタワー', () => {
    const address = '東京都丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '東京都',
      city: '',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都丸の内2-7-2 JPタワー',
      raw: '東京都丸の内二丁目7番2号JPタワー'
    })
  })

  it('丸の内二丁目7番2号JPタワー', () => {
    const address = '丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '',
      city: '',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '丸の内2-7-2 JPタワー',
      raw: '丸の内二丁目7番2号JPタワー'
    })
  })

  it('京都市上京区今出川通室町西入堀出シ町二八五番地', () => {
    const address = '京都市上京区今出川通室町西入堀出シ町二八五番地'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '京都府',
      city: '京都市上京区',
      town: '今出川通室町西入堀出シ町',
      block: '285',
      building: '',
      full: '京都府京都市上京区今出川通室町西入堀出シ町285',
      raw: '京都市上京区今出川通室町西入堀出シ町二八五番地'
    })
  })

  it('鹿児島県志布志市志布志町志布志二丁目1番1号志布志市役所志布志支所', () => {
    const address = '鹿児島県志布志市志布志町志布志二丁目1番1号志布志市役所志布志支所'
    const result = parseAddress(address)
    expect(result).toEqual({
      prefecture: '鹿児島県',
      city: '志布志市',
      town: '志布志町志布志',
      block: '2-1-1',
      building: '志布志市役所志布志支所',
      full: '鹿児島県志布志市志布志町志布志2-1-1 志布志市役所志布志支所',
      raw: '鹿児島県志布志市志布志町志布志二丁目1番1号志布志市役所志布志支所'
    })
  })
})
