import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  render?: (value: any, row: any) => string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  operator: string;
  value: any;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
}

interface Group {
  column: string;
  expanded: boolean;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {
  @Input() title = '';
  @Input() description = '';
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() selectable = false;
  @Input() showActions = false;
  @Input() showPagination = true;
  @Input() showRefresh = true;
  @Input() emptyStateMessage = 'No data available to display.';
  @Input() emptyStateTitle = 'No data available';
  @Input() emptyStateAction?: { label: string; onClick: () => void };
  @Input() isLoading = false;
  @Input() loadingMessage = 'Loading data...';
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Input() showFilters = true;
  @Input() showGrouping = true;

  @Output() onSort = new EventEmitter<SortConfig>();
  @Output() onFilter = new EventEmitter<FilterConfig[]>();
  @Output() onPageChange = new EventEmitter<PaginationConfig>();
  @Output() onSelectionChange = new EventEmitter<any[]>();
  @Output() onRefresh = new EventEmitter<void>();

  paginationConfig: PaginationConfig = {
    page: 1,
    pageSize: 10,
    totalItems: 0
  };

  sortConfig: SortConfig | null = null;
  selectedRows: any[] = [];
  filters: FilterConfig[] = [];
  groups: Group[] = [];

  ngOnInit(): void {
    this.paginationConfig.totalItems = this.data.length;
  }

  get paginatedData(): any[] {
    const start = (this.paginationConfig.page - 1) * this.paginationConfig.pageSize;
    const end = start + this.paginationConfig.pageSize;
    return this.data.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.paginationConfig.totalItems / this.paginationConfig.pageSize);
  }

  get paginationStart(): number {
    return (this.paginationConfig.page - 1) * this.paginationConfig.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(
      this.paginationConfig.page * this.paginationConfig.pageSize,
      this.paginationConfig.totalItems
    );
  }

  get isAllSelected(): boolean {
    return this.data.length > 0 && this.selectedRows.length === this.data.length;
  }

  get filterableColumns(): Column[] {
    return this.columns.filter(column => column.filterable);
  }

  get groupableColumns(): Column[] {
    return this.columns.filter(column => column.groupable);
  }

  get groupedData(): { key: string; items: any[] }[] {
    if (this.groups.length === 0) {
      return [{ key: '', items: this.data }];
    }

    const grouped = this.data.reduce((acc, item) => {
      const groupKey = this.groups.map(g => item[g.column]).join(' - ');
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, items]) => ({
      key,
      items: items as any[]
    }));
  }

  sort(key: string): void {
    if (this.sortConfig?.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig = { key, direction: 'asc' };
    }
    this.onSort.emit(this.sortConfig);
  }

  isSorted(key: string): boolean {
    return this.sortConfig?.key === key;
  }

  sortDirection(key: string): 'asc' | 'desc' {
    return this.sortConfig?.key === key ? this.sortConfig.direction : 'asc';
  }

  changePage(page: number): void {
    this.paginationConfig.page = page;
    this.onPageChange.emit(this.paginationConfig);
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.paginationConfig.pageSize = Number(select.value);
    this.paginationConfig.page = 1;
    this.onPageChange.emit(this.paginationConfig);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedRows = [];
    } else {
      this.selectedRows = [...this.data];
    }
    this.onSelectionChange.emit(this.selectedRows);
  }

  toggleSelect(row: any): void {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
    this.onSelectionChange.emit(this.selectedRows);
  }

  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  refresh(): void {
    this.onRefresh.emit();
  }

  formatCell(value: any, column: Column): string {
    if (column.format) {
      return column.format(value);
    }

    if (value === null || value === undefined) {
      return '';
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  applyFilter(column: string, event: any): void {
    const value = event.target.value;
    const existingFilter = this.filters.find(f => f.key === column);
    
    if (value) {
      if (existingFilter) {
        existingFilter.value = value;
      } else {
        this.filters.push({
          key: column,
          operator: 'contains',
          value
        });
      }
    } else {
      this.filters = this.filters.filter(f => f.key !== column);
    }

    this.onFilter.emit(this.filters);
  }

  applyNumberFilter(column: string, event: any, type: 'min' | 'max'): void {
    const value = event.target.value;
    const existingFilter = this.filters.find(f => f.key === column);
    
    if (value) {
      if (existingFilter) {
        existingFilter.value = {
          ...existingFilter.value,
          [type]: value
        };
      } else {
        this.filters.push({
          key: column,
          operator: 'between',
          value: { [type]: value }
        });
      }
    } else {
      if (existingFilter) {
        delete existingFilter.value[type];
        if (Object.keys(existingFilter.value).length === 0) {
          this.filters = this.filters.filter(f => f.key !== column);
        }
      }
    }

    this.onFilter.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = [];
    this.onFilter.emit(this.filters);
  }

  toggleGroup(column: string): void {
    const index = this.groups.findIndex(g => g.column === column);
    if (index === -1) {
      this.groups.push({ column, expanded: true });
    } else {
      this.groups.splice(index, 1);
    }
    this.onSelectionChange.emit(this.selectedRows);
  }

  toggleGroupExpansion(groupKey: string): void {
    const group = this.groups.find(g => g.column === groupKey);
    if (group) {
      group.expanded = !group.expanded;
      this.onSelectionChange.emit(this.selectedRows);
    }
  }

  clearGroups(): void {
    this.groups = [];
    this.onSelectionChange.emit(this.selectedRows);
  }
} 