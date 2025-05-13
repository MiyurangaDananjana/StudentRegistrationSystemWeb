import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentServiceService } from '../../services/student-service.service';

@Component({
  selector: 'app-student-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-details-model.component.html',
  styleUrls: ['./student-details-model.component.css']
})
export class StudentDetailsModelComponent implements OnChanges {
  @Input() studentId: number | null = null;  // Accept studentId as input
  @Input() isVisible: boolean = false;  // Control visibility of modal
  @Output() close = new EventEmitter<void>();

  student: any = null;
  loading: boolean = false;
  error: string | null = null;
  photoUrl: string = '';

  constructor(private studentService: StudentServiceService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studentId'] && this.studentId !== null) {
      this.loadStudentDetails();
    }
    if (changes['isVisible'] && !this.isVisible) {
      this.student = null;  // Reset student when modal is closed
    }
  }

  loadStudentDetails(): void {
    if (this.studentId !== null) {
      this.loading = true;
      this.studentService.getStudentById(this.studentId).subscribe({
        next: (data) => {
          this.student = data;
          this.photoUrl = `http://192.168.8.124/api/Students/profile-photo/${this.student.id}`;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch student details:', err);
          this.error = 'Failed to load student details.';
          this.loading = false;
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();  // Emit close event to parent
  }
}
