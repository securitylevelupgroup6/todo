import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {

  private formData: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.formData = this.formBuilder.group({});
  }

  set(data: FormGroup) {
    this.formData = data;
  }

  get(): FormGroup {
    return this.formData;
  }

  clear() {
    this.formData = this.formBuilder.group({});
  }
}
