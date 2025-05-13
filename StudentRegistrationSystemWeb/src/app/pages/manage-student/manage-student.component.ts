import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentServiceService } from '../../services/student-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-student',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.css'
})
export class ManageStudentComponent implements OnInit {
  studentForm!: FormGroup;
  file: File | null = null;
  fileError = false;
  successMessage = '';
  editingId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private studentService: StudentServiceService
  ) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern(/^(\d{9}[vV]|\d{12})$/)]],
      dob: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(250)]]
    });

    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.editingId = +idParam;
      this.loadStudent(this.editingId);
    }
  }

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        const formattedDob = student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split('T')[0]
          : '';

        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          mobile: student.mobileNumber,
          email: student.email,
          nic: student.nicNumber,
          dob: formattedDob,
          address: student.address
        });

        console.log(student.dateOfBirth)
        // You may fetch and display image preview here if needed
      },
      error: () => {
        console.error('Error loading student');
      }
    });
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    this.file = selectedFile;
    this.fileError = !this.file;
  }

  onSubmit(): void {
    if (this.studentForm.invalid || (!this.file && !this.editingId)) {
      this.fileError = !this.file && !this.editingId;
      this.studentForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.studentForm.value.firstName);
    formData.append('lastName', this.studentForm.value.lastName);
    formData.append('mobileNumber', this.studentForm.value.mobile);
    formData.append('email', this.studentForm.value.email);
    formData.append('nicNumber', this.studentForm.value.nic);
    formData.append('dateOfBirth', this.studentForm.value.dob);
    formData.append('address', this.studentForm.value.address);

    if (this.file) {
      formData.append('profilePhoto', this.file);
    }

    if (this.editingId) {
      this.studentService.updateStudent(this.editingId, formData).subscribe({
        next: () => {
          this.successMessage = 'Student updated successfully!';
        },
        error: () => {
          console.error('Update failed');
        }
      });
    } else {
      this.studentService.createStudent(formData).subscribe({
        next: () => {
          this.successMessage = 'Student created successfully!';
          this.studentForm.reset();
          this.file = null;
        },
        error: () => {
          console.error('Creation failed');
        }
      });
    }
  }
}
