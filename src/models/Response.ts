export class Result {
  index: number;
  result: number;
}

export class Response {
  results: Result[];

  constructor(results: Result[]) {
    this.results = results;
  }
}
