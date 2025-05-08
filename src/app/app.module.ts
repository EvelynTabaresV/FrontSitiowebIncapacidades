import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsersModule } from './modules/users/users.module'
import { AppRoutingModule } from './app.routes';
import { WelcomeModule } from '@app/welcome/welcome.module';
import {HttpClient } from '@angular/common/http';


@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        UsersModule, 
        RouterModule, 
        WelcomeModule,
        AppComponent
    ],
    providers: [
        HttpClient,
    ],
})
export class AppModule {}
