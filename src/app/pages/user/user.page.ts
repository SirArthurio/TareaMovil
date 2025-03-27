import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from 'src/app/model/task';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule ],
})
export class UserPage implements OnInit {
  users: Task[] = [];
  userForm: FormGroup;
  editingUser: Task | null = null;
  data$: Observable<Task[]> = of([]);
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private tas: UserService) {
    this.userForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      detalle: ['', Validators.required],
      estado: [[]]
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tas.Tareas().subscribe({
      next: (tasks) => {
        console.log('Datos recibidos:', tasks); 
        this.users = tasks;
      },
      error: (err) => {
        console.error('Error al cargar tareas:', err);
      }
    });
  }

  closeForm() {
    this.userForm.reset();
    this.isEditing = false;
    this.editingUser = null;
  }

  saveUser() {
    if (this.userForm.valid) {
      const taskData: Task = this.userForm.value;
      
      if (this.isEditing && taskData.id) {
        this.tas.actualizarTarea(taskData).subscribe({
          next: (updatedTask) => {
            this.loadTasks();
            this.closeForm();
          },
          error: (err) => console.error('Error al actualizar tarea:', err)
        });
      } else {
        this.tas.crearTarea(taskData).subscribe({
          next: (newTask) => {
            this.loadTasks();
            this.closeForm();
          },
          error: (err) => console.error('Error al crear tarea:', err)
        });
      }
    }
  }

  editUser(task: Task) {
    this.isEditing = true;
    this.editingUser = task;
    this.userForm.patchValue({
      id: task.id,
      nombre: task.nombre,
      detalle: task.detalle,
      estado: task.estado
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.tas.eliminarTarea(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => console.error('Error al eliminar tarea:', err)
      });
    }
  }
}