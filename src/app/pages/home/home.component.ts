import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageBoxComponent } from '../components/message-box/message-box.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MessageBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  @ViewChild('aboutModal', { static: false }) aboutModal!: MessageBoxComponent;

  showAbout(): void {
    this.aboutModal.show('2025年4月，XJL在加拿大滑铁卢留学期间，为狼人杀爱好者开发了这款狼人杀助手。到2026年6月，继续用 CodeX 进行了优化和补全。');
  }
}
