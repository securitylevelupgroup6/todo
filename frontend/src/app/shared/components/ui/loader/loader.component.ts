import { Component } from '@angular/core';
import { LoaderService } from '../../../data-access/services/loader.service';
import { NgIf } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [NgIf, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}
