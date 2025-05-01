import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { StoryComponent } from './pages/story/story.component';
import { EditionListComponent } from './pages/edition-list/edition-list.component';
import { EditionSetupComponent } from './pages/edition-setup/edition-setup.component';
import { GameListComponent } from './pages/game-list/game-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'create-game', component: CreateGameComponent},
    { path: 'story', component: StoryComponent},
    { path: 'edition-list', component: EditionListComponent },
    { path: 'edition-setup', component: EditionSetupComponent }, // Assuming EditionSetupComponent is used here
    { path: 'game-list', component: GameListComponent }, // Assuming GameListComponent is used here
    { path: '**', redirectTo: '' } // Redirect to home for any unknown routes
];
