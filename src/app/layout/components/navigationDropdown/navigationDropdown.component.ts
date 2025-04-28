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
      this.markParents(item, this.items);
    }

    this.uncheckChildren(item, item.selected);
  }

  markParents(item: any, items: any[]): void {
    function findAndMark(node: any, parentList: any[]): void {
      for (const parent of parentList) {
        if (parent.childrens?.some((child: any) => child.id_ubica_geo == node.id_ubica_geo)) {
          parent.selected = true;
          findAndMark(parent, items);
          return;
        }
        findAndMark(node, parent.childrens || []);
      }
    }
  
    findAndMark(item, items);
  }
  
  uncheckChildren(parent: any, value: any): void {
    if (parent.childrens?.length) {
      for (const child of parent.childrens) {
        child.selected = value;
  
        this.uncheckChildren(child, value);
      }
    }
  }
  
}
