import { BehaviorSubject } from 'rxjs';

export class AuthService {
  // Inicializa userRole como un BehaviorSubject
  userRole = new BehaviorSubject<string>('no-role');

  // Llama a este método cada vez que el rol del usuario cambie
  updateUserRole(role: string) {
    this.userRole.next(role);
  }
}