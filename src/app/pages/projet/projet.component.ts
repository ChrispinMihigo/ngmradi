import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from '../../core/models/project.models';
import {
  FieldValue,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/services/firebase/auth.service';
import { FirestoreService } from '../../core/services/firebase/firestore.service';
import { APP_NAME } from '../../app.constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { SetProjectComponent } from '../home/projects/set-project/set-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { SetTodoComponent } from './todo/set-todo.component';
import { Task } from '../../core/models/task.model';
import { TodoComponent } from './todo/todo.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-projet',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatTooltipModule,
    RouterLink,
    MatDividerModule,
    MatCardModule,
    DatePipe,
    TodoComponent,
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './projet.component.html',
  styleUrl: './projet.component.scss',
})
export default class ProjetComponent implements OnInit, OnDestroy {
  id = input('id');
  projectSub?: Subscription;
  project?: Project<Timestamp>;

  readonly title = inject(Title);
  private fs = inject(FirestoreService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  readonly user$ = this.auth.user;

  todos$?: Observable<Task<Timestamp>[]>;
  inProgresses$?: Observable<Task<Timestamp>[]>;
  dones$?: Observable<Task<Timestamp>[]>;

  formatdDate = (t?: Timestamp) => this.fs.formatedTimestamp(t);

  ngOnInit(): void {
    this.todos$ = this.fs.getTodos(this.id(), 'backlog');
    this.inProgresses$ = this.fs.getTodos(this.id(), 'in-progress');
    this.dones$ = this.fs.getTodos(this.id(), 'done');

    this.projectSub = this.fs
      .getDocData(this.fs.projectCol, this.id())
      .subscribe((project) => {
        this.project = project as Project<Timestamp>;
        this.title.setTitle(`${this.project.title} - ${APP_NAME}`);
      });
  }

  onSetTodo(projectId: string) {
    this.dialog.open(SetTodoComponent, {
      width: '35rem',
      disableClose: true,
      data: { projectId },
    });
  }

  onEditProject(project: Project<Timestamp> | undefined) {
    this.dialog.open(SetProjectComponent, {
      width: '35rem',
      disableClose: true,
      data: project,
    });
  }
  onDeleteProject(profectId: string) {
    this.fs.deleteData(this.fs.projectCol, profectId);
    const message = 'Project supprimé avec succès';
    this.snackBar.open(message, '', { duration: 5000 });
  }

  drop(
    event: CdkDragDrop<Task<Timestamp>[] | null>,
    status: 'backlog' | 'in-progress' | 'done'
  ) {
    if (event.previousContainer !== event.container) {
      const task = event.previousContainer.data![
        event.previousIndex
      ] as Task<FieldValue>;

      task.moved = true;
      task.status = status;
      this.fs.setTask(this.id(), task);
    }
  }

  ngOnDestroy(): void {
    this.projectSub?.unsubscribe();
  }
}
