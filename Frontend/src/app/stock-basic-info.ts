export class StockBasicInfo {
    constructor(
        public name: string,
        public ticker: string,
        public c: number,
        public d: number,
        public dp: number,
        public going_up: boolean
    ){}
    
}
