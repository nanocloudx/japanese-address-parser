# japanese-address-parser

[![Test](https://github.com/nanocloudx/japanese-address-parser/actions/workflows/test.yaml/badge.svg)](https://github.com/nanocloudx/japanese-address-parser/actions/workflows/test.yaml)


A lightweight package to split Japanese addresses into postal code, prefecture, city, town, block, and buildings.  
日本の住所文字列を郵便番号、都道府県、市区町村、町域、番地、建物名に分割する軽量なパッケージです

## Usage

### Parse address
```
import {parseAddress} from 'japanese-address-parser'

const address = parseAddress('〒1000005 東京都千代田区丸の内二丁目7番2号JPタワー')

console.log(address)
// {
//   postalCode: '100-0005',
//   prefecture: '東京都',
//   city: '千代田区',
//   town: '丸の内',
//   block: '2-7-2',
//   building: 'JPタワー',
//   full: '東京都千代田区丸の内2-7-2 JPタワー'
//   raw: '〒1000005 東京都千代田区丸の内二丁目7番2号JPタワー'
// }
```

### Parse postal code
```
import {parsePostalCode} from 'japanese-address-parser'

const postal = parsePostalCode('１２３４５６７')

console.log(postal) // '123-4567'
```

### Parse phone number
```
import {parsePhoneNumber} from 'japanese-address-parser'

const phone = parsePhoneNumber('０３１２３４５６７８')

console.log(phone) // '03-1234-5678'
```

## Features
- Converts full-width or Chinese numerals to half-width numerals.
  - 全角数字や漢数字を半角数字に変換します
- Chome and banchi (block and lot numbers) are converted to half-width hyphens.
  - 丁目や番地などの表記は半角ハイフンに変換します
- Confusing horizontal lines are converted to half-width hyphens.
  - 番地に含まれる紛らわしい横棒は半角ハイフンに変換します
- Postal code and phone number parsers are also available
  - 郵便番号と電話番号のパーサーも利用できます

## Notice
- This package only divides addresses from string patterns.
  - このパッケージは住所のパターンから文字列を判定しています
- If there is an error in the address, only minimal corrections will be made.
  - 住所の訂正は最小限のみ行います (住所クレンジングには利用できません)
- Special address formats are largely unsupported.
  - 特殊な住所フォーマットにはほとんど対応していません (例：石川県金沢市利屋町など)
- Its simplicity, the accuracy of the parse results is not guaranteed.
  - シンプルであるためパース結果の正確性は保証されません

## Acknowledgements
- This package utilizes the phone number parser from [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber)
- This package utilizes the prefectures data from [Geolonia Japanese Addresses](https://github.com/geolonia/japanese-addresses).

## License
- This package is licensed under the MIT License.
