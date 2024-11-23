import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigationDropdown',
  templateUrl: './navigationDropdown.component.html',
  styleUrls: ['../../../../styles/styles.scss']
})
export class NavigationDropdown {
  @Input() items: any[] = [];
  @Input() parent: boolean = false;

  toggleChildren(item: any) {
    item.isOpen = !item.isOpen;
  }

  ubiCheckboxChanged(item: any): void {
    if (item.selected) {
      this.uncheckChildren(item);
    }
  }
  
  uncheckChildren(parent: any): void {
    if (parent.childrens?.length) {
      for (const child of parent.childrens) {
        child.selected = false;
  
        this.uncheckChildren(child);
      }
    }
  }
  
}
