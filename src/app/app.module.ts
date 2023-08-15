import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } 
    from "@angular/platform-browser/animations";
import { DialogModule } from "primeng/dialog";

@NgModule({
  imports: [
     BrowserModule, 
     FormsModule,
     BrowserAnimationsModule, 
     DialogModule, 
  ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }