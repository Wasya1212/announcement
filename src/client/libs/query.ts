export default class Query {
  protected searchQueryString: string;
  protected searchQueriesList: any[];
  protected searchQueries: any;

  constructor(queryString: string) {
    this.searchQueryString = queryString.slice(1);
    this.searchQueriesList = this.parse();
    this.searchQueries = this.createQueriesObject();
  }

  private parse(): any[] {
    let searchQueries: any[] = this.searchQueryString.split('&');

    if (searchQueries[0] == "") return [];

    searchQueries = searchQueries.map(query => {
      let parsedQuery = query.split('=');
      return {[parsedQuery[0]]: parsedQuery[1]};
    });

    return searchQueries;
  }

  private createQueriesObject(): any {
    return Object.assign({}, ...this.searchQueriesList);
  }

  public get query(): string {
    return this.searchQueryString;
  }

  public get queries(): any {
    return this.searchQueries;
  }

  public get queriesList(): any[] {
    return this.searchQueriesList;
  }

  public get(key: string): any {
    return this.searchQueries[key];
  }

  public remove(key: string): void {
    try {
      delete this.searchQueries[key];
      this.searchQueriesList.splice(this.searchQueriesList.findIndex(query => query[key]), 1);
    } catch (err) {
      console.error(err);
    }
  }

  public static createQueryFromArrayOfParameters(parameters: any[]): string {
    return "?";
  }

  public static createQueryFromParametersObject(parameters: any): string {
    return `?${Object.keys(parameters).filter(k => parameters[k] != undefined).map((key: string) => `${key}=${parameters[key]}`).join('&')}`;
  }

  public static createQuery(parameters: any | any[]): string {
    return Array.isArray(parameters)
      ? this.createQueryFromArrayOfParameters(parameters)
      : this.createQueryFromParametersObject(parameters);
  }
}
