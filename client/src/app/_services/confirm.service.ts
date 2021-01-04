import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Observer } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef;

  constructor(private modalService: BsModalService) {
  }

  private getResult = () => {
    return (observer: Observer<any>) => {
      const subscription = this.bsModelRef.onHidden.subscribe(() => {
        observer.next(this.bsModelRef.content?.result);
        observer.complete();
      });
      return {
        unsubscribe: () => {
          subscription.unsubscribe();
        }
      };
    };
  }

  public confirm = (title = 'Confirmation', message = 'Are you sure you want to do this?', btnOkText = 'Ok', btnCacelText = 'Cancel'
  ): Observable<boolean> => {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCacelText
      }
    };
    this.bsModelRef = this.modalService.show(ConfirmDialogComponent, config);

    return new Observable<boolean>(this.getResult());
  }

}

