import {describe, it, expect} from 'vitest'
import { parseAddress } from './index'

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

  // it('住所が与えられなかった場合は何もしない', () => {
  //   const address = ''
  //   const result = parseAddress(address)
  //   expect(result).toEqual({
  //     prefecture: '',
  //     city: '',
  //     town: '',
  //     block: '',
  //     building: '',
  //     full: '',
  //     raw: '',
  //   })
  // })
})
