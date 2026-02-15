import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminComponent } from './admin/admin'; // Sesuaikan path
import { UserComponent } from './user/user';   // Sesuaikan path
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  
  { path: 'register', component: RegisterComponent },

  { path: 'forgot-password', component: ResetPasswordComponent },

  // RUTE KHUSUS ADMIN
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard],
    data: { role: 'admin' } // (Opsional) Nanti bisa dipakai untuk RoleGuard
  },

  // RUTE KHUSUS USER / MAHASISWA
  { 
    path: 'user', 
    component: UserComponent, 
    canActivate: [AuthGuard],
    data: { role: 'user' }
  },

  { path: '**', redirectTo: 'login' }
];