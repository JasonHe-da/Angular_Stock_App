export class News {
    constructor(
        public news_detail: {
            "category" : string,
            "datetime" : number,
            "headline" : string,
            "id" : number,
            "image" : string,
            "related" : string,
            "source" : string,
            "summary" : string,
            "url" : string
        }
    ){}
}
