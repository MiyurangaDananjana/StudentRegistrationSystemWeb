import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentServiceService } from '../../services/student-service.service';

@Component({
  selector: 'app-new-student',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-student.component.html',
  styleUrl: './new-student.component.css'
})

export class NewStudentComponent implements OnInit {
  studentForm!: FormGroup;
  successMessage: string | null = null;
  fileToUpload: File | null = null;
  fileError = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentServiceService
  ) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern('^[0-9]{9}[vVxX]$|^[0-9]{12}$')]],
      dob: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
      this.fileError = false;
    } else {
      this.fileError = true;
    }
  }
  onSubmit(): void {
    if (this.studentForm.invalid || !this.fileToUpload) {
      this.fileError = !this.fileToUpload;
      this.studentForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('id', '0'); // or whatever ID logic you use
    formData.append('firstName', this.studentForm.value.firstName);
    formData.append('lastName', this.studentForm.value.lastName);
    formData.append('mobileNumber', this.studentForm.value.mobile);
    formData.append('email', this.studentForm.value.email);
    formData.append('nicNumber', this.studentForm.value.nic);
    formData.append('dateOfBirth', this.studentForm.value.dob);
    formData.append('fileInfo', this.fileToUpload);

    this.studentService.createStudent(formData).subscribe({
      next: (res) => {
        console.log('Student created:', res);
        this.successMessage = 'Student saved successfully!';
        this.studentForm.reset();
        this.fileToUpload = null;
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
