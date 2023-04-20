// for portfolio

export class AllSearchInfo {
    constructor(
        public ticker: string,
        public name:string,
        public quantity: number,
        public total_cost: number,
        public AverageCostShare: number,
        public CurrentPrice: number,
        public Change: number,
        public MarketValue: number
    ){}
}
