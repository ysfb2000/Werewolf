import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './pages/home/home.component';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule, 
    SharedModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'WereWolvesAssistance';
}
