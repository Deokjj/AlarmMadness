import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SnackServiceService {

  constructor() { }

  private test = new Subject<string>();

  // Observable string streams
  test$ = this.test.asObservable();

    // Service message commands
  publishData(data: string) {
    this.test.next(data);
  }

}
