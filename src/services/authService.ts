import { supabase } from '../lib/supabase';
import type { Employee } from '../types/employee';

export async function loginEmployee(email: string, password: string): Promise<Employee> {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
  }

  if (!authData.user) {
    throw new Error('No se pudo obtener información del usuario');
  }

  const { data: employeeData, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (employeeError) {
    throw new Error('Error al obtener información del empleado');
  }

  if (!employeeData) {
    throw new Error('Empleado no encontrado en el sistema');
  }

  if (!employeeData.activo) {
    await supabase.auth.signOut();
    throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
  }

  await supabase
    .from('employees')
    .update({ last_login: new Date().toISOString() })
    .eq('id', authData.user.id);

  return employeeData as Employee;
}

export async function logoutEmployee(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('Error al cerrar sesión');
  }
}

export async function getCurrentEmployee(): Promise<Employee | null> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data: employeeData, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !employeeData) {
    return null;
  }

  if (!employeeData.activo) {
    await supabase.auth.signOut();
    return null;
  }

  return employeeData as Employee;
}
