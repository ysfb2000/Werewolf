import { Component, ElementRef, input, ViewChild, viewChild } from '@angular/core';
import { Modal } from 'bootstrap';

import { Router } from '@angular/router';

@Component({
  selector: 'app-message-box',
  imports: [],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.less'
})
export class MessageBoxComponent {

  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  private modalInstance!: Modal;

  message: string = '';

  url = input<string>();

  constructor(private router: Router) {}



  show(message: string) {
    this.message = message;
    if (this.myModal) {
      this.modalInstance = new Modal(this.myModal.nativeElement);
      this.modalInstance.show();
    }
  }

  close(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();

      if (this.url() && this.url() !== '') {
        this.router.navigate(['/edition-list']);
      }
      
    };
  }



}
