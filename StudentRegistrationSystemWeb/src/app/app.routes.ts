import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'new-student',
    loadComponent: () =>
      import('./pages/new-student/new-student.component').then(m => m.NewStudentComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'list-students',
    loadComponent: () =>
      import('./pages/list-student/list-student.component').then(m => m.ListStudentComponent)
  },
  {
    path: 'manage-students',
    loadComponent: () =>
      import('./pages/manage-student/manage-student.component').then(m => m.ManageStudentComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
