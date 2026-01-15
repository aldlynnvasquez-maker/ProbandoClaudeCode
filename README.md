# Sistema de Votacion Electronica - API REST

API REST desarrollada con Flask para gestionar un sistema de votacion electronica con soporte para multiples categorias electorales, voto preferencial y un modulo independiente de cuestionario de conocimiento ciudadano.

---

## Tabla de Contenidos

1. [Descripcion General](#descripcion-general)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Modelo de Base de Datos](#modelo-de-base-de-datos)
5. [Configuracion del Entorno](#configuracion-del-entorno)
6. [Inicializacion del Proyecto](#inicializacion-del-proyecto)
7. [Ejecucion del Proyecto](#ejecucion-del-proyecto)
8. [Endpoints Disponibles](#endpoints-disponibles)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Buenas Practicas y Consideraciones](#buenas-practicas-y-consideraciones)

---

## Descripcion General

### Que problema resuelve?

Este sistema aborda la necesidad de contar con una plataforma digital para gestionar procesos de votacion electronica de manera estructurada, segura y transparente. Permite la administracion completa de un proceso electoral, desde el registro de electores hasta el conteo de votos por categoria.

### Objetivo del Sistema

Proporcionar una API REST robusta y bien documentada que permita:

- Gestionar electores y su participacion en el proceso electoral
- Administrar partidos politicos y candidatos por categorias
- Registrar votos con soporte para voto preferencial
- Garantizar la integridad del voto (un voto unico por elector)
- Ofrecer un modulo educativo de cuestionario de conocimiento ciudadano

### Alcance Funcional

El sistema incluye dos modulos principales:

**Modulo de Votacion:**
- Gestion de electores (registro, consulta)
- Administracion de partidos politicos y candidatos
- Categorias electorales (Presidente, Vicepresidente, Diputado, Senador Nacional, Senador Regional, Parlamento Andino)
- Registro de votos con tipos: Valido, Nulo, En Blanco
- Soporte para voto preferencial (hasta 2 numeros preferenciales por categoria)

**Modulo de Cuestionario (Independiente):**
- Preguntas de conocimiento ciudadano sobre el sistema electoral peruano
- Opciones de respuesta multiple
- Registro anonimo de cuestionarios completados

---

## Tecnologias Utilizadas

| Tecnologia | Version | Descripcion |
|------------|---------|-------------|
| **Python** | 3.8+ | Lenguaje de programacion principal |
| **Flask** | 3.0.0 | Framework web minimalista para Python |
| **Flask-SQLAlchemy** | 3.1.1 | ORM para interaccion con la base de datos |
| **PostgreSQL** | 12+ | Sistema de gestion de base de datos relacional |
| **psycopg2-binary** | 2.9.9 | Adaptador de PostgreSQL para Python |
| **Flasgger** | 0.9.7.1 | Integracion de Swagger/OpenAPI para documentacion automatica |
| **Flask-CORS** | 4.0.0 | Manejo de Cross-Origin Resource Sharing |
| **python-dotenv** | 1.0.0 | Gestion de variables de entorno desde archivos .env |
| **marshmallow** | 3.20.1 | Serializacion y validacion de datos |

---

## Estructura del Proyecto

```
voting_api/
├── app/                          # Paquete principal de la aplicacion
│   ├── __init__.py               # Factory de la aplicacion Flask
│   ├── swagger.py                # Configuracion de Swagger/OpenAPI
│   │
│   ├── models/                   # Modelos de datos (SQLAlchemy)
│   │   ├── __init__.py           # Exportacion de modelos y db
│   │   ├── elector.py            # Modelo de electores
│   │   ├── voto.py               # Modelo de votos
│   │   ├── tipo_voto.py          # Tipos de voto (Valido, Nulo, Blanco)
│   │   ├── partido_politico.py   # Partidos politicos
│   │   ├── candidato.py          # Candidatos
│   │   ├── categoria.py          # Categorias electorales
│   │   ├── voto_categoria.py     # Votos por categoria con preferenciales
│   │   ├── cuestionario.py       # Cuestionarios completados
│   │   ├── pregunta.py           # Preguntas del cuestionario
│   │   ├── opcion.py             # Opciones de respuesta
│   │   └── respuesta.py          # Respuestas registradas
│   │
│   ├── services/                 # Capa de logica de negocio
│   │   ├── __init__.py
│   │   ├── base_service.py       # Clase base abstracta (LSP)
│   │   ├── elector_service.py    # Servicio de electores
│   │   ├── voto_service.py       # Servicio de votos
│   │   ├── tipo_voto_service.py  # Servicio de tipos de voto
│   │   ├── partido_politico_service.py
│   │   ├── candidato_service.py
│   │   ├── categoria_service.py
│   │   ├── voto_categoria_service.py
│   │   ├── pregunta_service.py
│   │   └── cuestionario_service.py
│   │
│   └── controllers/              # Endpoints REST (Blueprints)
│       ├── __init__.py           # Exportacion de blueprints
│       ├── elector_controller.py
│       ├── voto_controller.py
│       ├── tipo_voto_controller.py
│       ├── partido_politico_controller.py
│       ├── candidato_controller.py
│       ├── categoria_controller.py
│       ├── voto_categoria_controller.py
│       ├── pregunta_controller.py
│       └── cuestionario_controller.py
│
├── config/
│   └── config.py                 # Configuracion de la aplicacion
│
├── frontend/                     # Archivos estaticos del frontend
│   └── index.html                # Interfaz de usuario
│
├── static/                       # Recursos estaticos (logos, imagenes)
│
├── app.py                        # Punto de entrada principal
├── init_db.py                    # Script de inicializacion de BD
├── requirements.txt              # Dependencias del proyecto
├── .env                          # Variables de entorno (no versionado)
├── .gitignore                    # Archivos ignorados por Git
└── README.md                     # Este archivo
```

### Descripcion de Carpetas

| Carpeta | Funcion |
|---------|---------|
| `app/models/` | Define la estructura de las tablas de la base de datos usando SQLAlchemy ORM |
| `app/services/` | Contiene la logica de negocio, aislada de los controladores |
| `app/controllers/` | Maneja las peticiones HTTP y respuestas, usando Flask Blueprints |
| `config/` | Centraliza la configuracion de la aplicacion para diferentes entornos |
| `frontend/` | Contiene los archivos estaticos servidos por Flask |

---

## Modelo de Base de Datos

### Diagrama de Entidades

El sistema utiliza las siguientes entidades organizadas en dos modulos:

#### Modulo de Votacion

| Tabla | Descripcion | Campos Principales |
|-------|-------------|-------------------|
| **elector** | Ciudadanos habilitados para votar | `dni` (PK), `nombres`, `apellidos`, `distrito`, `region` |
| **voto** | Registro de participacion electoral | `id_voto` (PK), `fecha`, `dni` (FK, UNIQUE), `id_tipo_voto` (FK) |
| **tipo_voto** | Clasificacion del voto | `id_tipo_voto` (PK), `nombre_tipo` |
| **partido_politico** | Organizaciones politicas | `id_partido` (PK), `nombre_partido`, `logo` |
| **candidato** | Postulantes a cargos | `id_candidato` (PK), `nombre_candidato`, `numero_candidato`, `id_partido` (FK), `id_categoria` (FK) |
| **categoria** | Cargos a elegir | `id_categoria` (PK), `nombre_categoria`, `ambito` |
| **voto_categoria** | Detalle del voto por categoria | `id_voto_categoria` (PK), `id_voto` (FK), `id_categoria` (FK), `id_partido` (FK), `numero_preferencial_1`, `numero_preferencial_2` |

#### Modulo de Cuestionario

| Tabla | Descripcion | Campos Principales |
|-------|-------------|-------------------|
| **pregunta** | Preguntas de conocimiento ciudadano | `id_pregunta` (PK), `texto` |
| **opcion** | Opciones de respuesta | `id_opcion` (PK), `id_pregunta` (FK), `texto`, `es_correcta` |
| **cuestionario** | Cuestionario completado (anonimo) | `id_cuestionario` (PK), `fecha` |
| **respuesta** | Respuestas registradas | `id_respuesta` (PK), `id_cuestionario` (FK), `id_pregunta` (FK), `id_opcion` (FK) |

### Relaciones Clave

```
ELECTOR (1) ──────── (0..1) VOTO
    │                       │
    └── dni (UNIQUE)        └── (1) ──── (N) VOTO_CATEGORIA
                                              │
TIPO_VOTO (1) ──── (N) VOTO                  │
                                              │
PARTIDO_POLITICO (1) ──── (N) CANDIDATO      │
         │                      │             │
         │                      │             │
         └────────────────────┬─┴─────────────┘
                              │
CATEGORIA (1) ──── (N) CANDIDATO
         │
         └──── (1) ──── (N) VOTO_CATEGORIA

PREGUNTA (1) ──── (N) OPCION
    │
    └──── (1) ──── (N) RESPUESTA ──── (N) ──── (1) CUESTIONARIO
```

### Reglas de Negocio Importantes

1. **Voto Unico por Elector**: La columna `dni` en la tabla `voto` tiene restriccion `UNIQUE`, garantizando que cada elector solo puede votar una vez.

2. **Votos en Blanco**: Un voto se considera "en blanco" cuando el campo `id_partido` en `voto_categoria` es `NULL`.

3. **Voto Preferencial**: Los campos `numero_preferencial_1` y `numero_preferencial_2` permiten indicar preferencia dentro de las listas de candidatos. Son opcionales (`NULL` si no aplica).

4. **Tipo de Voto Automatico**: El sistema determina el tipo de voto (Valido, Nulo, En Blanco) basandose en las selecciones realizadas.

5. **Cuestionario Independiente**: El modulo de cuestionario es completamente independiente del sistema de votacion y no almacena datos personales para mantener el anonimato.

6. **Categorias Electorales**: El sistema soporta 6 categorias:
   - Presidente (Nacional, sin numero preferencial)
   - Vicepresidente (Nacional, sin numero preferencial)
   - Diputado (Nacional, con numero preferencial)
   - Senador Nacional (Nacional, con numero preferencial)
   - Senador Regional (Regional, con numero preferencial)
   - Parlamento Andino (Nacional, con numero preferencial)

---

## Configuracion del Entorno

### 1. Crear y Activar el Entorno Virtual

```bash
# Navegar al directorio del proyecto
cd voting_api

# Crear el entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows:
venv\Scripts\activate

# En Linux/Mac:
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar la Base de Datos PostgreSQL

Crear la base de datos y el usuario:

```sql
-- Conectar a PostgreSQL como superusuario
CREATE DATABASE voting_db;
CREATE USER voting_user WITH PASSWORD 'tu_contrasena_segura';
GRANT ALL PRIVILEGES ON DATABASE voting_db TO voting_user;
```

### 4. Configurar el Archivo .env

Crear el archivo `.env` en la raiz del proyecto con las siguientes variables:

```env
DATABASE_URL=postgresql://voting_user:tu_contrasena_segura@localhost:5432/voting_db
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui-cambiar-en-produccion
```

### Variables de Entorno

| Variable | Descripcion | Valor por Defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URI de conexion a PostgreSQL | `postgresql://postgres:postgres@localhost:5432/voting_db` |
| `FLASK_ENV` | Entorno de ejecucion | `development` |
| `FLASK_DEBUG` | Modo debug | `True` |
| `SECRET_KEY` | Clave secreta para sesiones | `dev-secret-key` |
| `PORT` | Puerto del servidor | `5000` |

---

## Inicializacion del Proyecto

### Ejecutar el Script de Inicializacion

El archivo `init_db.py` se encarga de:

1. Crear todas las tablas en la base de datos
2. Insertar datos de ejemplo (electores, partidos, candidatos, preguntas)

```bash
python init_db.py
```

### Caracteristicas del Script

- **Idempotente**: Puede ejecutarse multiples veces sin errores. Si ya existen datos, no insertara duplicados.
- **Datos de Ejemplo**: Incluye:
  - 3 tipos de voto (Valido, Nulo, En Blanco)
  - 20 electores de diferentes regiones del Peru
  - 10 partidos politicos
  - 6 categorias electorales
  - Candidatos para cada partido y categoria
  - 10 preguntas de conocimiento ciudadano con sus opciones

### Orden de Ejecucion Recomendado

1. Asegurar que PostgreSQL este en ejecucion
2. Verificar que la base de datos `voting_db` exista
3. Confirmar que el archivo `.env` tenga las credenciales correctas
4. Ejecutar: `python init_db.py`

---

## Ejecucion del Proyecto

### Iniciar el Servidor

```bash
python app.py
```

El servidor se iniciara y mostrara:

```
Tablas creadas exitosamente
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### Accesos Principales

| Recurso | URL |
|---------|-----|
| **Aplicacion Web** | http://localhost:5000 |
| **Documentacion Swagger** | http://localhost:5000/api/docs |
| **Especificacion OpenAPI** | http://localhost:5000/apispec.json |

### Flujo Basico de Uso

1. **Consultar electores disponibles**: `GET /api/electores/`
2. **Consultar categorias**: `GET /api/categorias/`
3. **Consultar partidos y candidatos**: `GET /api/partidos/`, `GET /api/candidatos/`
4. **Registrar un voto**: `POST /api/votos/`
5. **Registrar votos por categoria**: `POST /api/votos-categoria/`

---

## Endpoints Disponibles

### Sistema de Votacion

#### Electores
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/electores/` | Obtener todos los electores |
| GET | `/api/electores/<dni>` | Obtener elector por DNI |
| POST | `/api/electores/` | Crear nuevo elector |

#### Votos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/votos/` | Obtener todos los votos |
| GET | `/api/votos/<id>` | Obtener voto por ID |
| POST | `/api/votos/` | Registrar nuevo voto |

#### Tipos de Voto
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/tipos-voto/` | Obtener todos los tipos |
| GET | `/api/tipos-voto/<id>` | Obtener tipo por ID |
| POST | `/api/tipos-voto/` | Crear nuevo tipo |

#### Partidos Politicos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/partidos/` | Obtener todos los partidos |
| GET | `/api/partidos/<id>` | Obtener partido por ID |
| POST | `/api/partidos/` | Crear nuevo partido |

#### Candidatos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/candidatos/` | Obtener todos los candidatos |
| GET | `/api/candidatos/<id>` | Obtener candidato por ID |
| POST | `/api/candidatos/` | Crear nuevo candidato |

#### Categorias
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/categorias/` | Obtener todas las categorias |
| GET | `/api/categorias/<id>` | Obtener categoria por ID |
| POST | `/api/categorias/` | Crear nueva categoria |

#### Votos por Categoria
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/votos-categoria/` | Obtener todos los votos por categoria |
| GET | `/api/votos-categoria/<id>` | Obtener voto-categoria por ID |
| POST | `/api/votos-categoria/` | Crear voto por categoria |

### Modulo de Cuestionario

#### Preguntas
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/preguntas/` | Obtener todas las preguntas |
| GET | `/api/preguntas/<id>` | Obtener pregunta por ID |

#### Cuestionarios
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/cuestionarios/` | Obtener cuestionarios completados |
| POST | `/api/cuestionarios/` | Enviar cuestionario completado |

---

## Ejemplos de Uso

### Crear un Elector

```bash
curl -X POST http://localhost:5000/api/electores/ \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "99999999",
    "nombres": "Carlos Eduardo",
    "apellidos": "Mendoza Lopez",
    "distrito": "Miraflores",
    "region": "Lima"
  }'
```

### Obtener Todos los Electores

```bash
curl http://localhost:5000/api/electores/
```

### Registrar un Voto

```bash
curl -X POST http://localhost:5000/api/votos/ \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "id_tipo_voto": 1
  }'
```

### Registrar Voto por Categoria con Preferencial

```bash
curl -X POST http://localhost:5000/api/votos-categoria/ \
  -H "Content-Type: application/json" \
  -d '{
    "id_voto": 1,
    "id_categoria": 3,
    "id_partido": 2,
    "numero_preferencial_1": 105,
    "numero_preferencial_2": 108
  }'
```

### Obtener Preguntas del Cuestionario

```bash
curl http://localhost:5000/api/preguntas/
```

---

## Buenas Practicas y Consideraciones

### Arquitectura y Principios SOLID

El proyecto implementa una arquitectura en capas con aplicacion de principios SOLID:

#### 1. Single Responsibility Principle (SRP)
Cada clase tiene una unica responsabilidad:
- **Models**: Representan la estructura de datos
- **Services**: Contienen la logica de negocio
- **Controllers**: Manejan peticiones HTTP

#### 2. Open/Closed Principle (OCP)
- Nuevos servicios heredan de `BaseService` sin modificar codigo existente
- Nuevos endpoints se agregan como Blueprints independientes

#### 3. Liskov Substitution Principle (LSP)
- `BaseService` define un contrato con metodos abstractos (`get_all`, `get_by_id`, `create`)
- Todos los servicios implementan este contrato de forma consistente
- Cualquier servicio puede sustituir a otro sin romper funcionalidad

#### 4. Interface Segregation Principle (ISP)
- Las interfaces son especificas y no obligan a implementar metodos innecesarios

#### 5. Dependency Inversion Principle (DIP)
- Los controllers dependen de abstracciones (servicios), no de implementaciones concretas

### Separacion de Modulos

El sistema esta disenado con dos modulos claramente separados:

1. **Modulo de Votacion**: Gestiona todo el proceso electoral
2. **Modulo de Cuestionario**: Completamente independiente, sin vinculacion a datos personales

### Consideraciones Eticas

El sistema incorpora las siguientes consideraciones:

1. **Privacidad del Voto**: El voto se registra sin exponer la seleccion especifica del elector en consultas publicas
2. **Anonimato del Cuestionario**: No se almacenan datos personales en el modulo de cuestionario
3. **Integridad Electoral**: Restriccion de voto unico por DNI a nivel de base de datos
4. **Transparencia**: Documentacion completa de la API mediante Swagger

### Seguridad

- Las credenciales se manejan mediante variables de entorno
- CORS habilitado para permitir acceso controlado desde otros origenes
- Validacion de datos en la capa de servicios

---

## Licencia

Proyecto desarrollado con fines educativos y de demostracion.
