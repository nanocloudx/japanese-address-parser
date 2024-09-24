import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import {convertConfusingHyphens, convertFullWidthToHalfWidth} from './utils'

export function parsePhoneNumber(phone: string): string {
  const phoneUtil = PhoneNumberUtil.getInstance()
  let p = phone
  p = convertFullWidthToHalfWidth(p)
  p = convertConfusingHyphens(p)
  try {
    const parsedNumber = phoneUtil.parse(p, 'JP')
    return phoneUtil.format(parsedNumber, PhoneNumberFormat.NATIONAL)
  } catch(e) {
    return ''
  }
}
