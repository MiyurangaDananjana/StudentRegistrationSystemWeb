import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {

  private baseUrl: string = "http://localhost:5003/api/";
  constructor(private http: HttpClient) { }

  createStudent(studentData: any): Observable<any> {
    console.log(studentData);
    return this.http.post(`${this.baseUrl}Students`, studentData);
  }

  getAllStudents(page: number = 1, pageSize: number = 10): Observable<any> {
    console.log("Hello Page data loaded: ");
    return this.http.get<any>(`${this.baseUrl}Students?pageNumber=${page}&pageSize=${pageSize}`);
  }

  getStudentById(id: number): Observable<any> {
    console.log("Is service Is running " + id);
    const url = `${this.baseUrl}Students/${id}`;  // Correct template string syntax
    console.log("Urltest:" + url);
    return this.http.get<any>(url);  // Use the url variable
  }

  updateStudent(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}Students/${id}`, data);
  }
}
