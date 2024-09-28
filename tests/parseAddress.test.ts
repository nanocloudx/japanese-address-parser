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

  it('都道府県と市区町村しかない', () => {
    const address = '東京都千代田区'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '東京都',
      city: '千代田区',
      town: '',
      block: '',
      building: '',
      full: '東京都千代田区',
      raw: '東京都千代田区'
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

  it('龍ケ崎市役所(町名がない)', () => {
    const address = '茨城県龍ケ崎市3710龍ケ崎市役所'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '茨城県',
      city: '龍ケ崎市',
      town: '',
      block: '3710',
      building: '龍ケ崎市役所',
      full: '茨城県龍ケ崎市3710 龍ケ崎市役所',
      raw: '茨城県龍ケ崎市3710龍ケ崎市役所'
    })
  })

  it('大阪市中央区久太郎町(番地が渡辺)', () => {
    const address = '大阪府大阪市中央区久太郎町4丁目渡辺'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '大阪府',
      city: '大阪市中央区',
      town: '久太郎町',
      block: '4-渡辺',
      building: '',
      full: '大阪府大阪市中央区久太郎町4-渡辺',
      raw: '大阪府大阪市中央区久太郎町4丁目渡辺'
    })
  })

  it('大阪市中央区上町(丁目がABC)', () => {
    const address = '大阪府大阪市中央区上町Ａ-1-1'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '大阪府',
      city: '大阪市中央区',
      town: '上町',
      block: 'A-1-1',
      building: '',
      full: '大阪府大阪市中央区上町A-1-1',
      raw: '大阪府大阪市中央区上町Ａ-1-1'
    })
  })

  it('道頓堀一丁目(東3のような表記)', () => {
    const address = '大阪府大阪市中央区道頓堀一丁目東3番地26号大阪高津郵便局'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '大阪府',
      city: '大阪市中央区',
      town: '道頓堀',
      block: '1-東3-26',
      building: '大阪高津郵便局',
      full: '大阪府大阪市中央区道頓堀1-東3-26 大阪高津郵便局',
      raw: '大阪府大阪市中央区道頓堀一丁目東3番地26号大阪高津郵便局'
    })
  })

  it('大阪府堺市(丁のような表記)', () => {
    const address = '大阪府堺市堺区百舌鳥夕雲町1丁1'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '大阪府',
      city: '堺市堺区',
      town: '百舌鳥夕雲町',
      block: '1-1',
      building: '',
      full: '大阪府堺市堺区百舌鳥夕雲町1-1',
      raw: '大阪府堺市堺区百舌鳥夕雲町1丁1'
    })
  })

  it('大分県(組のような表記)', () => {
    const address = '大分県臼杵市深田中対田11組'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '大分県',
      city: '臼杵市',
      town: '深田中対田',
      block: '11',
      building: '',
      full: '大分県臼杵市深田中対田11',
      raw: '大分県臼杵市深田中対田11組'
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

  it('京都市上京区役所', () => {
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

  it('有楽町パスポートセンター', () => {
    const address = '千代田区有楽町二丁目１０番１号　東京交通会館２階２０７号室'
    const result = parseAddress(address)
    expect(result).toEqual({
      postalCode: '',
      prefecture: '東京都',
      city: '千代田区',
      town: '有楽町',
      block: '2-10-1',
      building: '東京交通会館2階207',
      full: '東京都千代田区有楽町2-10-1 東京交通会館2階207',
      raw: '千代田区有楽町二丁目１０番１号　東京交通会館２階２０７号室'
    })
  })
})
