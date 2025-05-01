import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-confirm-box',
  imports: [],
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.less'
})
export class ConfirmBoxComponent {
  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  private modalInstance!: Modal;

  message: string = '';

  url = input<string>();
  ok = output<void>();

  constructor(private router: Router) {}



  show(message: string) {
    this.message = message;
    if (this.myModal) {
      this.modalInstance = new Modal(this.myModal.nativeElement);
      this.modalInstance.show();
    }
  }

  submit() {
    this.ok.emit();
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
