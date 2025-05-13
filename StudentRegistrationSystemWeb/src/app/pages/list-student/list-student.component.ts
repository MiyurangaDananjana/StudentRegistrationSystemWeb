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
  selectedStudentId: number | null = null;  // Hold student ID
  showModal: boolean = false;
  searchTerm: string = '';
  filteredStudents: any[] = [];

  constructor(
    private studentService: StudentServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = data;
      },
      error: (err) => {
        console.error('Failed to fetch students:', err);
      }
    });
  }

  filterStudents() {
    const term = this.searchTerm.toLowerCase();
    console.log('Filtering with:', term);
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.nicNumber.toLowerCase().includes(term)
    );
  }

  openStudentModal(studentId: number): void {
    this.selectedStudentId = studentId;  // Set the selected student ID
    this.showModal = true;  // Show the modal
    console.log("Opening modal for Student ID: ", studentId);
  }

  closeStudentModal(): void {
    this.showModal = false;  // Close the modal
  }

  manageStudent(id: number): void {
    this.router.navigate(['/manage-students'], { queryParams: { id } });
  }
}
