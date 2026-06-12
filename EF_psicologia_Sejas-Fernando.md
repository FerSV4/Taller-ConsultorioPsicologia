# EF — Reporte de Proyecto
**Estudiante:** [Sejas Colque Fernando Andres]
**Proyecto:** [Citas Psicológicas]
**Repositorio:** [[URL del repositorio](https://github.com/FerSV4/Taller-ConsultorioPsicologia)]
**Fecha de entrega:** [12/06/2026]

---

## Sección 1 — Deploy

**URL del proyecto:** [[URL pública](https://psicosystem.netlify.app)]
**Swagger / API:** [No, Supabase]

> Captura del proyecto corriendo con datos reales:

![Deploy en producción](capturas/psico-deploy.png)

---

## Sección 2 — Pruebas con TDD + cobertura

### Cobertura inicial (0%)

**Herramienta:** [ng test --coverage]

> Captura del reporte de cobertura antes de escribir pruebas nuevas:

![Cobertura inicial](capturas/psico-coverage-inicial.png)

---

### Ciclo TDD — Prueba 1

**HU:** [HU-XX] [título]
> Como [rol] quiero [acción] para [beneficio]

**CA elegido:** [texto del criterio de aceptación]

**Commit 1 — Rojo** [`a1b2c3d`](https://github.com/usuario/repo/commit/a1b2c3d):
```
test: [HU-XX] agregar test para [CA]
```
Test escrito (sin el código que lo pase aún):
```csharp / typescript
// snippet del test
```

> Captura del test fallando o error de compilación:

![Test rojo](capturas/[proyecto]-tdd1-rojo.png)

---

**Commit 2 — Verde** [`b2c3d4e`](https://github.com/usuario/repo/commit/b2c3d4e):
```
feat: [HU-XX] implementar [método] para pasar test
```
Código mínimo para hacer pasar el test:
```csharp / typescript
// snippet del código implementado
```

> Captura del test pasando:

![Test verde](capturas/[proyecto]-tdd1-verde.png)

---

**Commit 3 — Refactor** [`c3d4e5f`](https://github.com/usuario/repo/commit/c3d4e5f):
```
refactor: [HU-XX] limpiar [aspecto mejorado]
```
Cambios aplicados:
```csharp / typescript
// snippet mejorado
```

> Captura del test aún pasando después del refactor:

![Test post-refactor](capturas/[proyecto]-tdd1-refactor.png)

---

### Ciclo TDD — Prueba 2

> Mismo formato. Incluir al menos 3 ciclos TDD completos.

---

### Ciclo TDD — Prueba 3

> Mismo formato.

---

### Cobertura final

**Cobertura alcanzada:** X%

> Captura del reporte de cobertura final:

![Cobertura final](capturas/[proyecto]-cobertura-final.png)

> Si la cobertura es <50%, pegar aquí la justificación enviada al docente:

---

## Sección 3 — Code smells corregidos

Mínimo 3 nuevos (adicionales a los del EC2).

| # | Tipo | Commit | Descripción |
|---|---|---|---|
| 1 | [Tipo] | [`a1b2c3d`](https://github.com/usuario/repo/commit/a1b2c3d) | [Antes: X → Después: Y] |
| 2 | [Tipo] | [`b2c3d4e`](https://github.com/usuario/repo/commit/b2c3d4e) | [Antes: X → Después: Y] |
| 3 | [Tipo] | [`c3d4e5f`](https://github.com/usuario/repo/commit/c3d4e5f) | [Antes: X → Después: Y] |

### Detalle — Smell 1: [Tipo]

**Código antes:**
```csharp / typescript
// código con el smell
```

**Código después:**
```csharp / typescript
// código corregido
```

---

### Detalle — Smell 2: [Tipo]

> Mismo formato.

---

### Detalle — Smell 3: [Tipo]

> Mismo formato.

---

## Sección 4 — Trazabilidad HU → CA → test

| # | Historia de Usuario | Criterio de Aceptación | Prueba que valida ese CA | Commit |
|---|---|---|---|---|
| 1 | [HU título] | [Dado/Cuando/Entonces] | [NombrePrueba_Escenario_Resultado] | [`a1b2c3d`](https://github.com/usuario/repo/commit/a1b2c3d) |
| 2 | [HU título] | [Dado/Cuando/Entonces] | [NombrePrueba_Escenario_Resultado] | [`b2c3d4e`](https://github.com/usuario/repo/commit/b2c3d4e) |
| 3 | [HU título] | [Dado/Cuando/Entonces] | [NombrePrueba_Escenario_Resultado] | [`c3d4e5f`](https://github.com/usuario/repo/commit/c3d4e5f) |

### Cadena 1 — [Nombre HU]

**Historia de Usuario:**
> Como [rol] quiero [acción] para [beneficio]

**Criterio de Aceptación elegido:**
> Dado [contexto] / Cuando [acción] / Entonces [resultado esperado]

**Prueba que valida este CA:**
```csharp / typescript
[Fact / test]
public void Metodo_Escenario_ResultadoEsperado()
{
    // Arrange — setup del contexto del CA
    // Act — ejecutar la acción del CA
    // Assert — verificar el resultado del CA
}
```

---

### Cadena 2 — [Nombre HU]

> Mismo formato.

---

### Cadena 3 — [Nombre HU]

> Mismo formato.
