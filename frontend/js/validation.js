/**
 * Módulo de validación de votos por categoría
 */

const VoteValidator = {
    // Estado de los votos por categoría
    votosPorCategoria: {
        presidente: {
            id_categoria: 1,
            nombre: 'Presidente',
            estado: 'blanco', // blanco, valido, nulo
            id_partido: null,
            candidatos_preferenciales: [],
            max_preferenciales: 0 // Presidente no tiene preferenciales
        },
        'senador-nacional': {
            id_categoria: 4,
            nombre: 'Senador Nacional',
            estado: 'blanco',
            id_partido: null,
            candidatos_preferenciales: [],
            max_preferenciales: 1
        },
        'senador-regional': {
            id_categoria: 5,
            nombre: 'Senador Regional',
            estado: 'blanco',
            id_partido: null,
            candidatos_preferenciales: [],
            max_preferenciales: 1
        },
        diputado: {
            id_categoria: 3,
            nombre: 'Diputado',
            estado: 'blanco',
            id_partido: null,
            candidatos_preferenciales: [],
            max_preferenciales: 2
        },
        parlamento: {
            id_categoria: 6,
            nombre: 'Parlamento Andino',
            estado: 'blanco',
            id_partido: null,
            candidatos_preferenciales: [],
            max_preferenciales: 2
        }
    },

    /**
     * Valida el voto de presidente/vicepresidente
     */
    validarPresidente(partidoSeleccionado) {
        const categoria = this.votosPorCategoria.presidente;

        if (!partidoSeleccionado) {
            categoria.estado = 'blanco';
            categoria.id_partido = null;
        } else {
            categoria.estado = 'valido';
            categoria.id_partido = partidoSeleccionado;
        }

        return categoria.estado;
    },

    /**
     * Valida votos con posibilidad de preferenciales (Senadores, Diputados, Parlamento)
     */
    validarCategoriaConPreferenciales(categoriaKey, partidoSeleccionado, candidatosPreferenciales = []) {
        const categoria = this.votosPorCategoria[categoriaKey];

        // Caso 1: No hay selección -> EN BLANCO
        if (!partidoSeleccionado && candidatosPreferenciales.length === 0) {
            categoria.estado = 'blanco';
            categoria.id_partido = null;
            categoria.candidatos_preferenciales = [];
            return 'blanco';
        }

        // Caso 2: Solo partido seleccionado -> VÁLIDO
        if (partidoSeleccionado && candidatosPreferenciales.length === 0) {
            categoria.estado = 'valido';
            categoria.id_partido = partidoSeleccionado;
            categoria.candidatos_preferenciales = [];
            return 'valido';
        }

        // Caso 3: Partido y candidatos preferenciales
        if (partidoSeleccionado && candidatosPreferenciales.length > 0) {
            // Validar que no se excedan los preferenciales permitidos
            if (candidatosPreferenciales.length > categoria.max_preferenciales) {
                categoria.estado = 'nulo';
                return 'nulo';
            }

            // Todos los candidatos deben ser del mismo partido
            const todosDelMismoPartido = candidatosPreferenciales.every(c =>
                c.id_partido === partidoSeleccionado
            );

            if (!todosDelMismoPartido) {
                categoria.estado = 'nulo';
                return 'nulo';
            }

            categoria.estado = 'valido';
            categoria.id_partido = partidoSeleccionado;
            categoria.candidatos_preferenciales = candidatosPreferenciales.map(c => c.numero_candidato);
            return 'valido';
        }

        // Caso 4: Candidatos sin partido -> NULO
        if (!partidoSeleccionado && candidatosPreferenciales.length > 0) {
            categoria.estado = 'nulo';
            categoria.id_partido = null;
            categoria.candidatos_preferenciales = [];
            return 'nulo';
        }

        categoria.estado = 'blanco';
        return 'blanco';
    },

    /**
     * Obtiene el estado actual de una categoría
     */
    getEstadoCategoria(categoriaKey) {
        return this.votosPorCategoria[categoriaKey]?.estado || 'blanco';
    },

    /**
     * Obtiene el partido seleccionado para una categoría
     */
    getPartidoSeleccionado(categoriaKey) {
        return this.votosPorCategoria[categoriaKey]?.id_partido || null;
    },

    /**
     * Obtiene los candidatos preferenciales seleccionados
     */
    getCandidatosPreferenciales(categoriaKey) {
        return this.votosPorCategoria[categoriaKey]?.candidatos_preferenciales || [];
    },

    /**
     * Limpia todas las selecciones
     */
    resetAll() {
        for (const key in this.votosPorCategoria) {
            this.votosPorCategoria[key].estado = 'blanco';
            this.votosPorCategoria[key].id_partido = null;
            this.votosPorCategoria[key].candidatos_preferenciales = [];
        }
    },

    /**
     * Verifica si hay algún voto nulo sin resolver
     */
    hayVotosNulosSinResolver() {
        return Object.values(this.votosPorCategoria).some(c => c.estado === 'nulo');
    },

    /**
     * Verifica si todas las categorías están en blanco
     */
    todasEnBlanco() {
        return Object.values(this.votosPorCategoria).every(c => c.estado === 'blanco');
    },

    /**
     * Genera resumen del voto para confirmación
     */
    generarResumen() {
        const resumen = [];

        for (const key in this.votosPorCategoria) {
            const categoria = this.votosPorCategoria[key];
            let texto = `<div class="resumen-categoria">
                <strong>${categoria.nombre}:</strong> `;

            switch (categoria.estado) {
                case 'valido':
                    texto += `<span class="badge-valido">Válido</span>`;
                    if (categoria.candidatos_preferenciales.length > 0) {
                        texto += ` (con ${categoria.candidatos_preferenciales.length} preferencial${categoria.candidatos_preferenciales.length > 1 ? 'es' : ''})`;
                    }
                    break;
                case 'nulo':
                    texto += `<span class="badge-nulo">Nulo</span>`;
                    break;
                case 'blanco':
                    texto += `<span class="badge-blanco">En Blanco</span>`;
                    break;
            }

            texto += '</div>';
            resumen.push(texto);
        }

        return resumen.join('');
    },

    /**
     * Obtiene todos los votos para enviar al backend
     */
    getVotosParaEnviar() {
        return Object.values(this.votosPorCategoria).filter(c => c.estado !== 'blanco');
    },

    /**
     * Mensaje de ayuda según el tipo de error
     */
    getMensajeError(categoriaKey, tipo) {
        const mensajes = {
            'candidatos-sin-partido': 'Debes seleccionar primero el partido antes de marcar candidatos preferenciales.',
            'demasiados-preferenciales': 'Has seleccionado más candidatos preferenciales de los permitidos (máximo 2).',
            'candidatos-diferentes-partidos': 'Los candidatos preferenciales deben ser del mismo partido seleccionado.',
            'multiple-partido': 'Solo puedes seleccionar un partido político por categoría.'
        };

        return mensajes[tipo] || 'Selección inválida.';
    }
};

// Exportar para uso en otros módulos
window.VoteValidator = VoteValidator;
