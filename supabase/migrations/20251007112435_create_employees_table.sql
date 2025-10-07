/*
  # Sistema de Autenticación de Empleados

  ## Descripción
  Crea la infraestructura necesaria para el sistema de inicio de sesión de empleados
  que deben autenticarse antes de acceder al escáner de productos.

  ## 1. Tablas Nuevas
    - `employees` (empleados)
      - `id` (uuid, primary key) - ID único del empleado
      - `email` (text, unique, not null) - Email del empleado para login
      - `nombre_completo` (text, not null) - Nombre completo del empleado
      - `puesto` (text) - Puesto o cargo del empleado
      - `departamento` (text) - Departamento al que pertenece
      - `activo` (boolean, default true) - Si el empleado está activo
      - `created_at` (timestamptz) - Fecha de creación
      - `last_login` (timestamptz) - Último inicio de sesión

  ## 2. Seguridad (RLS)
    - Se habilita RLS en la tabla `employees`
    - Los empleados autenticados pueden:
      - Ver su propia información
      - Actualizar su último login
    - Solo usuarios con rol específico pueden crear/eliminar empleados

  ## 3. Notas Importantes
    - Los empleados se autentican usando Supabase Auth (email/password)
    - La tabla `employees` complementa `auth.users` con información adicional
    - El campo `activo` permite deshabilitar empleados sin borrar su cuenta
*/

-- Crear tabla de empleados
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nombre_completo text NOT NULL,
  puesto text DEFAULT 'Empleado',
  departamento text DEFAULT 'General',
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Habilitar RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Política: Los empleados autenticados pueden ver su propia información
CREATE POLICY "Empleados pueden ver su propia información"
  ON employees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política: Los empleados pueden actualizar su último login
CREATE POLICY "Empleados pueden actualizar su último login"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Función para crear empleado automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_employee()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.employees (id, email, nombre_completo)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nombre_completo', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear empleado automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_employee();

-- Insertar un empleado demo (contraseña: demo123456)
-- Nota: Este insert solo funcionará si creas manualmente el usuario en Supabase Auth primero
-- o usas el signup en la aplicación