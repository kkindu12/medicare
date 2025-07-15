import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, Alert, AlertConfig } from './alert.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit, OnDestroy {
  show: boolean = false;
  config: AlertConfig = {
    type: 'info',
    title: '',
    message: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmText: 'OK',
    cancelText: 'Cancel'
  };

  private subscription: Subscription = new Subscription();
  private currentAlert: Alert | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      if (alert) {
        this.currentAlert = alert;
        this.config = alert.config;
        this.show = alert.show;
      } else {
        this.show = false;
        this.currentAlert = null;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onConfirm() {
    if (this.currentAlert?.onConfirm) {
      this.currentAlert.onConfirm();
    }
    this.close();
  }

  onCancel() {
    if (this.currentAlert?.onCancel) {
      this.currentAlert.onCancel();
    }
    this.close();
  }

  close() {
    this.show = false;
    this.alertService.hideAlert();
  }

  getIconClass(): string {
    switch (this.config.type) {
      case 'success':
        return 'bi bi-check-circle-fill text-success';
      case 'error':
        return 'bi bi-exclamation-triangle-fill text-danger';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-warning';
      case 'info':
      default:
        return 'bi bi-info-circle-fill text-info';
    }
  }

  getAlertClass(): string {
    switch (this.config.type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  }
}
