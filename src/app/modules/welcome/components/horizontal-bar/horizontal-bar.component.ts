import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.scss']
})

export class HorizontalBarComponent  {
    isNavbarOpen: boolean = false;
    public userRole: string = 'no-role';
    isDropdownOpen = false; // Añade esta línea
    activeLink = '';
    private intervalId?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = window.setInterval(() => {
        // Obtén el usuario del almacenamiento local
        const user = JSON.parse(localStorage.getItem('user') as string);

        // Si el usuario existe, obtén su cargo
        if (user) {
          this.userRole = user.charge;
        }
      }, 1000); // Ejecuta el código cada 1000 milisegundos (1 segundo)
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }
  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  logout() {
    localStorage.removeItem('user');
    this.userRole = 'no-role';
    this.router.navigate(['/inicio/bienvenida']).then(() => {
        window.location.reload();
    });
  }
}