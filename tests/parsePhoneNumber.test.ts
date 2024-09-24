import {describe, it, expect} from 'vitest'
import { parsePhoneNumber } from '../src'

describe('parseAddress', () => {
  it('0312345678', () => {
    const result = parsePhoneNumber('0312345678')
    expect(result).toEqual('03-1234-5678')
  })

  it('0421234567', () => {
    const result = parsePhoneNumber('0421234567')
    expect(result).toEqual('042-123-4567')
  })

  it('0997123456', () => {
    const result = parsePhoneNumber('0997123456')
    expect(result).toEqual('0997-12-3456')
  })

  it('09012345678', () => {
    const result = parsePhoneNumber('09012345678')
    expect(result).toEqual('090-1234-5678')
  })

  it('０９０一００００ー００００', () => {
    const result = parsePhoneNumber('０９０一００００ー００００')
    expect(result).toEqual('090-0000-0000')
  })

  it('invalid', () => {
    const result = parsePhoneNumber('invalid')
    expect(result).toEqual('')
  })
})
