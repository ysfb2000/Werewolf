import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-box',
  imports: [CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.less'
})
export class MessageBoxComponent {
  message: string = '';
  isVisible = false;

  url = input<string>();

  constructor(private router: Router) {}

  show(message: string): void {
    this.message = message;
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;

    if (this.url() && this.url() !== '') {
      this.router.navigate(['/edition-list']);
    }
  }
}
