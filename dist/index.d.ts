/**
 * 住所文字列を「都道府県」「市区町村」「町域」「番地」「建物名」に分解する
 */
export declare function parseAddress(address: string): {
    prefecture: string;
    city: string;
    town: string;
    block: string;
    building: string;
    raw: string;
};
/**
 * 郵便番号文字列を「999-9999」の形式に修正する
 */
export declare function parsePostalCode(postal: string): string;
