import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-box',
  imports: [CommonModule],
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.less'
})
export class ConfirmBoxComponent {
  message: string = '';
  isVisible = false;

  url = input<string>();
  ok = output<void>();

  constructor(private router: Router) {}

  show(message: string): void {
    this.message = message;
    this.isVisible = true;
  }

  submit(): void {
    this.isVisible = false;
    this.ok.emit();
  }

  close(): void {
    this.isVisible = false;

    if (this.url() && this.url() !== '') {
      this.router.navigate(['/edition-list']);
    }
  }
}
