import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentServiceService } from '../../services/student-service.service';
import { StudentDetailsModelComponent } from '../../components/student-details-model/student-details-model.component'; // Adjust path
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [
    CommonModule,
    StudentDetailsModelComponent,
    FormsModule
  ],
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit {
  students: any[] = [];
  selectedStudentId: number | null = null;
  showModal: boolean = false;
  searchTerm: string = '';
  filteredStudents: any[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.students = data.items;
        this.filteredStudents = data.items;
        this.totalItems = data.totalCount;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Failed to fetch students:', err);
      }
    });
  }

  filterStudents() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.nicNumber.toLowerCase().includes(term)
    );
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadStudents();
  }

  openStudentModal(studentId: number): void {
    this.selectedStudentId = studentId;
    this.showModal = true;
  }

  closeStudentModal(): void {
    this.showModal = false;
  }

  manageStudent(id: number): void {
    this.router.navigate(['/manage-students'], { queryParams: { id } });
  }
}
