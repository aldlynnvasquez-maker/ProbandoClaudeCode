"""
Script para actualizar las rutas de logos de partidos políticos en la base de datos.

Uso:
    python update_logos.py
"""

from app import create_app
from app.models import db, PartidoPolitico

def update_logo_paths():
    """
    Actualiza las rutas de los logos de los partidos políticos.
    Puedes modificar el diccionario 'nuevos_logos' con las rutas correctas.
    """
    app = create_app()

    with app.app_context():
        print("Actualizando rutas de logos de partidos políticos...\n")

        # Mapeo de nombre de partido a nueva ruta de logo
        # MODIFICA ESTAS RUTAS según donde estén tus logos
        nuevos_logos = {
            'Partido Democrático Nacional': 'static/logos/partido_democratico.png',
            'Alianza Popular': 'static/logos/alianza_popular.png',
            'Movimiento Verde Progresista': 'static/logos/verde_progresista.png',
            'Frente Unido por el Perú': 'static/logos/frente_unido.png',
            'Partido Libertad y Democracia': 'static/logos/partido_libertad.png',
            'Acción Nacional': 'static/logos/accion_nacional.png',
            'Renovación Popular': 'static/logos/renovacion_popular.png',
            'Perú Libre': 'static/logos/peru_libre.png',
            'Fuerza Popular': 'static/logos/fuerza_popular.png',
            'Juntos por el Perú': 'static/logos/juntos_peru.png',
        }

        partidos = PartidoPolitico.query.all()

        if not partidos:
            print("❌ No se encontraron partidos en la base de datos.")
            print("   Ejecuta 'python init_db.py' primero.\n")
            return

        actualizados = 0

        for partido in partidos:
            if partido.nombre_partido in nuevos_logos:
                vieja_ruta = partido.logo
                nueva_ruta = nuevos_logos[partido.nombre_partido]

                partido.logo = nueva_ruta

                print(f"✓ {partido.nombre_partido}")
                print(f"  Anterior: {vieja_ruta}")
                print(f"  Nueva:    {nueva_ruta}\n")

                actualizados += 1
            else:
                print(f"⚠ Partido '{partido.nombre_partido}' no encontrado en el mapeo")

        # Guardar cambios
        db.session.commit()

        print("="*70)
        print(f"✓ Rutas de logos actualizadas: {actualizados} de {len(partidos)}")
        print("="*70)
        print("\nIMPORTANTE:")
        print("  - Asegúrate de que los archivos de imagen existan en las rutas especificadas")
        print("  - Reinicia el servidor Flask para ver los cambios: python app.py")
        print("="*70 + "\n")

def mostrar_logos_actuales():
    """
    Muestra las rutas actuales de los logos.
    """
    app = create_app()

    with app.app_context():
        print("="*70)
        print("LOGOS ACTUALES EN LA BASE DE DATOS")
        print("="*70 + "\n")

        partidos = PartidoPolitico.query.all()

        if not partidos:
            print("❌ No se encontraron partidos en la base de datos.\n")
            return

        for i, partido in enumerate(partidos, 1):
            print(f"{i:2d}. {partido.nombre_partido}")
            print(f"    Logo: {partido.logo or '(sin logo)'}\n")

        print("="*70 + "\n")

if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == '--mostrar':
        mostrar_logos_actuales()
    else:
        print("\n" + "="*70)
        print("ACTUALIZACIÓN DE LOGOS DE PARTIDOS POLÍTICOS")
        print("="*70 + "\n")

        respuesta = input("¿Deseas actualizar las rutas de los logos? (s/n): ")

        if respuesta.lower() in ['s', 'si', 'sí', 'y', 'yes']:
            update_logo_paths()
        else:
            print("\nOperación cancelada.\n")
            print("Para ver los logos actuales, ejecuta:")
            print("  python update_logos.py --mostrar\n")
