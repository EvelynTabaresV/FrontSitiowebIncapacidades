import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialogComponent } from '../modal/report-information.component';
import { RejectReportFormComponent } from '../modalRejectReport/reject-report-form.component';
import Swal from 'sweetalert2';
import { EntityService } from './entities.service';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})

export class EntityComponent implements OnInit, AfterViewInit {
    entities: any[] = [];
    classList: any;
    nextElementSibling: HTMLElement | undefined;

    constructor(
        private el: ElementRef, 
        private dialog: MatDialog, 
        private entityService: EntityService
    ) {}

    ngOnInit() {
        this.entityService.getEntities().subscribe(data => {
            this.entities = data;
        });
    }

    ngAfterViewInit() {
        this.addEventListeners();
    }

    ngAfterViewChecked() {
        this.addEventListeners();
    }

    addEventListeners() {
        let acc = this.el.nativeElement.getElementsByClassName("accordion");
        let len = acc.length;
    
        for (let i = 0; i < len; i++) {
            acc[i].removeEventListener("click", this.togglePanel);
            acc[i].addEventListener("click", this.togglePanel);
        }
    }

    togglePanel() {
        this.classList.toggle("active");
        let panel = this.nextElementSibling as HTMLElement;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = "";
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
}