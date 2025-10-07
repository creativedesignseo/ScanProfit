export interface Employee {
  id: string;
  email: string;
  nombre_completo: string;
  puesto: string;
  departamento: string;
  activo: boolean;
  created_at: string;
  last_login?: string;
}
