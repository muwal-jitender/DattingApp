
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messaageService: MessageService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages = () => {
    this.loading = true;
    this.messaageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    });
  }

  pageChanged = (event: any) => {
    this.pageSize = event.page;
    this.loadMessages();
  }

  deleteMessage = (id: number) => {
    this.confirmService.confirm('Confirm deletion', 'Are you sure?').subscribe(result => {
      if (result) {
        this.messaageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
        });
      }
    });
  }

}
