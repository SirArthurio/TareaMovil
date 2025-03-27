import { Component, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from 'src/app/model/Task';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import {   pencilOutline, trashOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private tas: UserService) {
    addIcons({ pencilOutline, 
      trashOutline,
      createOutline });    this.userForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      detalle: ['', Validators.required],
      estado: ['', Validators.required] 
    });
  }

  async ngOnInit() {
    await this.loadTasks();
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
      const formData = this.userForm.value;
  
      if (this.isEditing && formData.id) {
        this.tas.actualizarTarea(formData).subscribe({
          next: (updatedTask) => {
            console.log('Tarea actualizada:', updatedTask);
            this.loadTasks(); 
            this.closeForm(); 
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
      } else {
        this.tas.crearTarea(formData).subscribe({
          next: (newTask) => {
            console.log('Tarea creada:', newTask);
            this.loadTasks();
            this.closeForm();
          },
          error: (err) => console.error('Error al crear:', err)
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