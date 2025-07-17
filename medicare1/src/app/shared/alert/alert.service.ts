import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface Alert {
  show: boolean;
  config: AlertConfig;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  public alert$ = this.alertSubject.asObservable();

  constructor() { }

  showSuccess(title: string, message: string): void {
    this.showAlert({
      type: 'success',
      title,
      message,
      showConfirmButton: true,
      confirmText: 'OK'
    });
  }

  showError(title: string, message: string): void {
    this.showAlert({
      type: 'error',
      title,
      message,
      showConfirmButton: true,
      confirmText: 'OK'
    });
  }

  showWarning(title: string, message: string): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      showConfirmButton: true,
      confirmText: 'OK'
    });
  }

  showInfo(title: string, message: string): void {
    this.showAlert({
      type: 'info',
      title,
      message,
      showConfirmButton: true,
      confirmText: 'OK'
    });
  }

  showConfirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel'): Promise<boolean> {
    return new Promise((resolve) => {
      this.showAlert({
        type: 'warning',
        title,
        message,
        showConfirmButton: true,
        showCancelButton: true,
        confirmText,
        cancelText
      }, () => resolve(true), () => resolve(false));
    });
  }

  showAlert(config: AlertConfig, onConfirm?: () => void, onCancel?: () => void): void {
    this.alertSubject.next({
      show: true,
      config,
      onConfirm,
      onCancel
    });
  }

  hideAlert(): void {
    this.alertSubject.next(null);
  }
}
