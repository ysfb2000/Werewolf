import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Edition } from '../../shared/models/edition';
import { CommonModule } from '@angular/common';
import { CampType } from '../../shared/enums';

@Component({
  selector: 'app-edition-list',
  imports: [
    CommonModule
  ],
  templateUrl: './edition-list.component.html',
  styleUrl: './edition-list.component.less'
})
export class EditionListComponent {

  CampType = CampType;
  editionList: Edition[] = []; // Initialize editionList as an empty array

  constructor(private router: Router) {}
  

  ngOnInit() {
    // Load editions from localStorage and display them
    const defaultEditions = Edition.loadDefaultEditions();
    const editions = localStorage.getItem('edition');
    
    if (editions) {
      this.editionList = JSON.parse(editions);
    } else {
      this.editionList = [];
    }

    defaultEditions.push(...this.editionList); // Merge default editions with loaded editions

    this.editionList = defaultEditions;
  }


  onEditionClick(edition: Edition) {
    // Handle edition click event here
    this.router.navigate(['/edition-setup'], { queryParams: { editionName: edition.editionName, isDefault: edition.isDefault } });
  }

  addEdition() {
    this.router.navigate(['/edition-setup']);
  }

  back() {
    this.router.navigate(['/home']);
  }
}
