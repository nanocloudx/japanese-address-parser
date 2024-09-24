import {describe, it, expect} from 'vitest'
import { parseAddress } from '../src'

describe('parseAddress', () => {
  it('正常系', () => {
    const address = '東京都千代田区丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都千代田区丸の内2-7-2 JPタワー',
      raw: '東京都千代田区丸の内二丁目7番2号JPタワー'
    })
  })

  it('先頭に郵便番号がある', () => {
    const address = '〒100-0005 東京都千代田区丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '100-0005',
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都千代田区丸の内2-7-2 JPタワー',
      raw: '〒100-0005 東京都千代田区丸の内二丁目7番2号JPタワー'
    })
  })

  it('都道府県がないが補完ができる', () => {
    const address = '千代田区丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都千代田区丸の内2-7-2 JPタワー',
      raw: '千代田区丸の内二丁目7番2号JPタワー'
    })
  })

  it('都道府県がなく補完もできない', () => {
    const address = '伊達市丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '',
      city: '伊達市',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '伊達市丸の内2-7-2 JPタワー',
      raw: '伊達市丸の内二丁目7番2号JPタワー'
    })
  })

  it('市区町村がない', () => {
    const address = '東京都丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '東京都',
      city: '',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '東京都丸の内2-7-2 JPタワー',
      raw: '東京都丸の内二丁目7番2号JPタワー'
    })
  })

  it('都道府県も市区町村もない', () => {
    const address = '丸の内二丁目7番2号JPタワー'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '',
      city: '',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー',
      full: '丸の内2-7-2 JPタワー',
      raw: '丸の内二丁目7番2号JPタワー'
    })
  })

  it('余計なスペースが多い', () => {
    const address = '〒100-0005　東京都　千代田区　丸の内　二丁目7番2号　JPタワー　東京中央郵便局'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '100-0005',
      prefecture: '東京都',
      city: '千代田区',
      town: '丸の内',
      block: '2-7-2',
      building: 'JPタワー東京中央郵便局',
      full: '東京都千代田区丸の内2-7-2 JPタワー東京中央郵便局',
      raw: '〒100-0005　東京都　千代田区　丸の内　二丁目7番2号　JPタワー　東京中央郵便局'
    })
  })

  it('駐日英国大使館', () => {
    const address = '102-8381 東京都千代田区一番町1駐日英国大使館'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '102-8381',
      prefecture: '東京都',
      city: '千代田区',
      town: '一番町',
      block: '1',
      building: '駐日英国大使館',
      full: '東京都千代田区一番町1 駐日英国大使館',
      raw: '102-8381 東京都千代田区一番町1駐日英国大使館'
    })
  })

  it('京都府', () => {
    const address = '京都市上京区今出川通室町西入堀出シ町二八五番地'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '京都府',
      city: '京都市上京区',
      town: '今出川通室町西入堀出シ町',
      block: '285',
      building: '',
      full: '京都府京都市上京区今出川通室町西入堀出シ町285',
      raw: '京都市上京区今出川通室町西入堀出シ町二八五番地'
    })
  })

  it('町名に都道府県名を含む', () => {
    const address = '京都府相楽郡南山城村南大河原北海道1'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '京都府',
      city: '相楽郡南山城村',
      town: '南大河原北海道',
      block: '1',
      building: '',
      full: '京都府相楽郡南山城村南大河原北海道1',
      raw: '京都府相楽郡南山城村南大河原北海道1'
    })
  })

  it('町名に都道府県名を含む', () => {
    const address = '長野県長野市南長野南県町1000'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '長野県',
      city: '長野市',
      town: '南長野南県町',
      block: '1000',
      building: '',
      full: '長野県長野市南長野南県町1000',
      raw: '長野県長野市南長野南県町1000'
    })
  })

  it('志布志市役所', () => {
    const address = '鹿児島県志布志市志布志町志布志二丁目1番1号志布志市役所志布志支所'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
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
