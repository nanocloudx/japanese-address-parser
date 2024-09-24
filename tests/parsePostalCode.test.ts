import {describe, expect, it} from 'vitest'
import {parsePostalCode} from '../src'

describe('parsePostalCode', () => {
  it('郵便番号を抽出する', () => {
    const address = '〒100-0005 東京都千代田区丸の内1-2-3JPタワー'
    const postalCode = parsePostalCode(address)
    expect(postalCode).toBe('100-0005')
  })
  it('郵便番号を抽出する', () => {
    const address = '1000005東京都千代田区丸の内1-2-3JPタワー'
    const postalCode = parsePostalCode(address)
    expect(postalCode).toBe('100-0005')
  })
})
