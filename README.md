# japanese-address-parser

[![Test](https://github.com/nanocloudx/japanese-address-parser/actions/workflows/test.yaml/badge.svg)](https://github.com/nanocloudx/japanese-address-parser/actions/workflows/test.yaml)


A lightweight package to split Japanese addresses into prefecture, city, town, block, and building name.

## Usage

### Parse address
```
import {parseAddress} from 'japanese-address-parser'

const address = parseAddress('東京都千代田区丸の内二丁目7番2号JPタワー')

console.log(address)
// {
//   prefecture: '東京都',
//   city: '千代田区',
//   town: '丸の内',
//   block: '2-7-2',
//   building: 'JPタワー',
//   full: '東京都千代田区丸の内2-7-2 JPタワー'
//   raw: '東京都千代田区丸の内二丁目7番2号JPタワー'
// }
```

### Parse postal code
```
import {parsePostalCode} from 'japanese-address-parser'

const postal = parsePostalCode('１２３４５６７')

console.log(postal) //'123-4567'
```

## Features
- Full-width numbers and kanji numbers are converted to half-width numbers.
- Chome and banchi (block and lot numbers) are converted to half-width hyphens.
- Confusing horizontal lines are converted to half-width hyphens.

## Notice
- This package only divides addresses from string patterns.
- If there is an error in the address, only minimal corrections will be made.
- Its simplicity, the accuracy of the parse results is not guaranteed.

## Acknowledgements
- This package utilizes the prefecture data from [Geolonia Japanese Addresses](https://github.com/geolonia/japanese-addresses).

## License
- This package is licensed under the MIT License.
