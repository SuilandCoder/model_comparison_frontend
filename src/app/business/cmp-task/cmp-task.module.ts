import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmpTaskListComponent } from './cmp-task-list/cmp-task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { CmpTaskListRoutingModule } from './routing.module';
import { SharedModule } from '@shared';
import { NewTaskComponent } from './new-task/new-task.component';
import { CmpTaskService } from './services';

@NgModule({
  imports: [
    SharedModule,
    CmpTaskListRoutingModule
  ],
  declarations: [CmpTaskListComponent, TaskDetailComponent, NewTaskComponent],
  providers: [
    CmpTaskService
  ]
})
export class CmpTaskModule { }