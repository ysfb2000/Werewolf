import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  imports: [],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.less'
})
export class GameListComponent {

  constructor(private router: Router) {}

  onGameClick() {
    // Handle game click event here
    alert('Game clicked!');
  }

  back() {
    this.router.navigate(['/home']);
  }

}
