import { Component, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AngularMaterialModule } from '../shared/modules/angular-material.module';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

/**
 * @title Table with re-orderable columns
 */
@Component({
  selector: 'fnx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
})
export class TableComponent {
  //
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userList: UserData[];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor() {
    // Create 100 users
    this.userList = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(this.userList);
  }

  ngAfterViewInit() {
    // Assign the data to the data source for the table to render
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    /*merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.dataSource; //.pipe(catchError(() => observableOf(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = data === null;
    
              if (data === null) {
                return [];
              }
    
              // Only refresh the result length if there is new data. In case of rate
              // limit errors, we do not want to reset the paginator to zero, as that
              // would prevent users from re-triggering requests.
              this.resultsLength = data.total_count;
              return data.items;
            }),
          )
          .subscribe(data => (this.data = data));*/
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}
