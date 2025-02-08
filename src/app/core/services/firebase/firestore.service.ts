import { inject, Injectable } from '@angular/core';
import { Project } from '../../models/project.models';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  FieldValue,
  Firestore,
  or,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private fs = inject(Firestore);

  projectCol = 'projects';
  todoCol = (projectId: string) => `${this.projectCol}/${projectId}/todos`;

  // Generate id for document (work even offline)
  createDocId = (colName: string) => doc(collection(this.fs, colName)).id;

  setProject(p: Project<FieldValue>) {
    const projectColRef = collection(this.fs, this.projectCol);
    const projectDocRef = doc(projectColRef, p.id);
    return setDoc(projectDocRef, p, { merge: true });
  }

  setTask(projectId: string, t: Task<FieldValue>) {
    const todoColrel = collection(this.fs, this.todoCol(projectId));
    const todoDocRef = doc(todoColrel, t.id);
    return setDoc(todoDocRef, t, { merge: true });
  }

  getProjects(user: User) {
    const projectColRef = collection(this.fs, this.projectCol);
    const queryProjects = query(
      projectColRef,
      or(
        where('uid', '==', user.uid),
        where('contributors', 'array-contains', user.email)
      ),
      orderBy('createdAt', 'desc')
    );
    return collectionData(queryProjects);
  }

  getTodos(projectId: string, todoStauts: string) {
    const todoColRef = collection(this.fs, this.todoCol(projectId));
    const queryTodos = query(
      todoColRef,
      where('status', '==', todoStauts),
      orderBy('createdAt', 'asc')
    );
    return collectionData(queryTodos) as Observable<Task<Timestamp>[]>;
  }

  getDocData(colName: string, id: string) {
    return docData(doc(this.fs, colName, id));
  }

  deleteData(colName: string, id: string) {
    return deleteDoc(doc(this.fs, colName, id));
  }

  formatedTimestamp = (t?: Timestamp) => (t?.seconds ? t.toDate() : new Date());
}
