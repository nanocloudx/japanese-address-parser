"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAddress = parseAddress;
exports.parsePostalCode = parsePostalCode;
const prefectures_json_1 = __importDefault(require("./prefectures.json"));
// 漢数字を数字に変換する
const kanjiToNumberMap = {
    '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
    '六': '6', '七': '7', '八': '8', '九': '9', '〇': '0', '十': '10'
};
/**
 * 住所文字列を「都道府県」「市区町村」「町域」「番地」「建物名」に分解する
 */
function parseAddress(address) {
    const raw = address;
    if (!address) {
        return {
            prefecture: '',
            city: '',
            town: '',
            block: '',
            building: '',
            raw
        };
    }
    // 全角数字は半角数字に変換する
    address = address.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    // 数字と数字の間に挟まれた横棒は全て半角ハイフンに変換する
    address = address.replace(/(\d)[ー－―‐−‒—–ｰ─━一](\d)/g, '$1-$2');
    // 数字の後にある「丁目」や「番地」などを半角ハイフンに変換する
    address = address.replace(/(\d)(丁目|番の|番地の|番地|番|号|の)/g, '$1-');
    // 漢数字を数字に変換する（「丁目」や「番地」などの前に数字がある場合のみ）
    address = address.replace(/([0-9])([一二三四五六七八九〇十])(丁目|番の|番地の|番地|番|号|の)/g, (_, p1, p2, p3) => {
        return p1 + kanjiToNumberMap[p2] + p3;
    });
    // スペースを削除する
    address = address.replace(/\s/g, '');
    // 番地と建物名の間のハイフンを取り除く
    address = address.replace(/-(?=\D)/g, '');
    // 都道府県を抽出する
    let prefecture = '';
    const prefectureList = Object.keys(prefectures_json_1.default);
    for (const pref of prefectureList) {
        if (address.startsWith(pref)) {
            prefecture = pref;
            address = address.slice(pref.length);
            break;
        }
    }
    // 市区町村を抽出する
    let city = '';
    const municipalities = Object.values(prefectures_json_1.default).flat();
    for (const municipality of municipalities) {
        if (address.startsWith(municipality)) {
            city = municipality;
            address = address.slice(municipality.length);
            break;
        }
    }
    // 町名を抽出する
    const townMatch = address.match(/^(.*?)(\d)/);
    const town = townMatch ? townMatch[1] : '';
    address = town ? address.slice(town.length) : address;
    // 番地を抽出する
    const blockMatch = address.match(/^(\d+(-\d+)*)(.*)$/);
    const block = blockMatch ? blockMatch[1] : '';
    address = blockMatch ? blockMatch[3] : address;
    // ビル名を抽出する
    const building = address.replace(/-$/, '');
    return {
        prefecture,
        city,
        town,
        block,
        building,
        raw
    };
}
/**
 * 郵便番号文字列を「999-9999」の形式に修正する
 */
function parsePostalCode(postal) {
    if (!postal)
        return '';
    // 全角数字を半角数字に変換する
    postal = postal.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    // 数字以外の文字を削除する
    postal = postal.replace(/[^0-9]/g, '');
    // 7桁の数字でない場合は空文字を返す
    if (postal.length !== 7)
        return '';
    // 3桁と4桁にセパレートし、間に半角ハイフンを追加する
    return `${postal.slice(0, 3)}-${postal.slice(3)}`;
}
