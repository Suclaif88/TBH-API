const {
  listarInsumos,
  crearInsumo,
  actualizarInsumo,
  obtenerInsumoPorId,
  eliminarInsumo,
  cambiarEstado,
  obtenerInsumosActivos,
  obtenerInsumosPorCategoria
} = require('../../src/controllers/insumo.controller');

const { Insumos, Categoria_Insumos } = require('../../src/models');

jest.mock('../../src/models');

let req, res;

beforeEach(() => {
  req = { params: {}, body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  jest.clearAllMocks();
});

/**
 * Tests del controlador de Insumos
 *
 * Cobertura de:
 * - Listar insumos
 * - Crear insumo
 * - Obtener por ID
 * - Actualizar
 * - Eliminar
 * - Cambiar estado
 */

/**
 * --------------------------------------------------------------------------------------
 * Listar insumos
 * --------------------------------------------------------------------------------------
 */
describe('listarInsumos', () => {
  it('debe devolver lista de insumos con detalles de compra', async () => {
    Insumos.findAll.mockResolvedValue([
      {
        toJSON: () => ({
          Id_Insumos: 1,
          Nombre: 'Alcohol',
          Detalle_Compra_Insumos: [{ Id_Detalle_Insumos: 123 }]
        })
      }
    ]);

    await listarInsumos(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: [{
        Id_Insumos: 1,
        Nombre: 'Alcohol',
        TieneCompras: true
      }]
    });
  });

  it('debe manejar errores de base de datos', async () => {
    Insumos.findAll.mockRejectedValue(new Error('fail'));

    await listarInsumos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'fail'
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * --------------------------------------------------------------------------------------
 * Obtener insumo por ID
 * --------------------------------------------------------------------------------------
 */
describe('obtenerInsumoPorId', () => {
  it('debe retornar el insumo si existe', async () => {
    req.params.id = 5;
    Insumos.findByPk.mockResolvedValue({ Id_Insumos: 5 });

    await obtenerInsumoPorId(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success'
    }));
  });

  it('debe retornar 404 si no encuentra el insumo', async () => {
    req.params.id = 999;
    Insumos.findByPk.mockResolvedValue(null);

    await obtenerInsumoPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: `No se encontró insumo con id 999`
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Crear insumo
 * --------------------------------------------------------------------------------------
 */
describe('crearInsumo', () => {
  beforeEach(() => {
    req.body = {
      Nombre: 'Glicerina',
      Stock: 20,
      Id_Categoria_Insumos: 1
    };
    jest.clearAllMocks();
  });

  it('debe crear un insumo válido', async () => {
    Categoria_Insumos.findByPk.mockResolvedValue({});
    Insumos.findOne.mockResolvedValue(null);
    Insumos.create.mockResolvedValue({ Id_Insumos: 2, ...req.body });

    await crearInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      message: 'Insumo creado correctamente'
    }));
  });

  it('debe rechazar si el nombre está vacío', async () => {
    req.body.Nombre = '   ';
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre es obligatorio'
    }));
  });

  it('debe rechazar si el nombre tiene menos de 3 caracteres', async () => {
    req.body.Nombre = 'ab';
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre debe tener al menos 3 caracteres'
    }));
  });

  it('debe rechazar si el nombre contiene caracteres inválidos', async () => {
    req.body.Nombre = 'Insumo#123';
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre solo puede contener letras, números y espacios'
    }));
  });

  it('debe rechazar si el stock no es un número válido', async () => {
    req.body.Stock = 'no-es-numero';
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El stock debe ser un número válido mayor o igual a cero'
    }));
  });

  it('debe rechazar si el stock es negativo', async () => {
    req.body.Stock = -5;
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El stock debe ser un número válido mayor o igual a cero'
    }));
  });

  it('debe rechazar si no se envía categoría', async () => {
    req.body.Id_Categoria_Insumos = null;
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Debe seleccionar una categoría válida'
    }));
  });

  it('debe rechazar si la categoría no existe', async () => {
    Categoria_Insumos.findByPk.mockResolvedValue(null);
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La categoría seleccionada no existe'
    }));
  });

  it('debe rechazar si ya existe un insumo duplicado', async () => {
    Categoria_Insumos.findByPk.mockResolvedValue({});
    Insumos.findOne.mockResolvedValue({});
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Ya existe un insumo con ese nombre'
    }));
  });

  it('debe manejar error interno si falla la búsqueda de categoría', async () => {
    Categoria_Insumos.findByPk.mockRejectedValue(new Error('Fallo inesperado'));
    await crearInsumo(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Error interno del servidor'
    }));
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Actualizar insumo
 * --------------------------------------------------------------------------------------
 */
describe('actualizarInsumo', () => {
  beforeEach(() => {
    req.params.id = 1;
    req.body = {
      Nombre: 'NuevoNombre',
      Stock: 15,
      Id_Categoria_Insumos: 2
    };
    jest.clearAllMocks();
  });

  it('debe actualizar un insumo válido', async () => {
    Insumos.findOne
      .mockResolvedValueOnce({ Id_Insumos: 1 })
      .mockResolvedValueOnce(null);

    Categoria_Insumos.findByPk.mockResolvedValue({});
    Insumos.update.mockResolvedValue([1]);

    await actualizarInsumo(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Insumo actualizado correctamente'
    });
  });

  it('debe retornar 404 si el insumo no existe', async () => {
    Insumos.findOne.mockResolvedValue(null);

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Insumo no encontrado'
    }));
  });

  it('debe rechazar si el nombre está vacío', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Nombre = '   ';

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre es obligatorio'
    }));
  });

  it('debe rechazar si el nombre es muy corto', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Nombre = 'ab';

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre debe tener al menos 3 caracteres'
    }));
  });

  it('debe rechazar si el nombre tiene caracteres inválidos', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Nombre = 'Nuevo#';

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre solo puede contener letras, números y espacios'
    }));
  });

  it('debe rechazar si el stock no es un número', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Stock = 'abc';

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El stock debe ser un número válido mayor o igual a cero'
    }));
  });

  it('debe rechazar si el stock es negativo', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Stock = -1;

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El stock debe ser un número válido mayor o igual a cero'
    }));
  });

  it('debe rechazar si no se envía categoría', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    req.body.Id_Categoria_Insumos = null;

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Debe seleccionar una categoría válida'
    }));
  });

  it('debe rechazar si la categoría no existe', async () => {
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 1 });
    Categoria_Insumos.findByPk.mockResolvedValue(null);

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La categoría seleccionada no existe'
    }));
  });

  it('debe rechazar si ya existe otro insumo con ese nombre', async () => {
    Insumos.findOne
      .mockResolvedValueOnce({ Id_Insumos: 1 }) // Insumo actual
      .mockResolvedValueOnce({ Id_Insumos: 2 }); // Duplicado

    Categoria_Insumos.findByPk.mockResolvedValue({});

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Ya existe otro insumo con ese nombre'
    }));
  });

  it('debe devolver error 500 si ocurre una excepción', async () => {
    Insumos.findOne.mockRejectedValue(new Error('fail'));

    await actualizarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Error interno del servidor'
    }));
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * --------------------------------------------------------------------------------------
 * Cambiar estado de insumo
 * --------------------------------------------------------------------------------------
 */
describe('cambiarEstado', () => {
  it('debe alternar el estado del insumo si existe', async () => {
    req.params.id = 10;
    const insumoMock = { Estado: true, save: jest.fn() };

    Insumos.findByPk.mockResolvedValue(insumoMock);

    await cambiarEstado(req, res);

    expect(insumoMock.Estado).toBe(false);
    expect(insumoMock.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success'
    }));
  });

  it('debe retornar 404 si el insumo no existe', async () => {
    req.params.id = 10;
    Insumos.findByPk.mockResolvedValue(null);

    await cambiarEstado(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Eliminar insumo
 * --------------------------------------------------------------------------------------
 */
describe('eliminarInsumo', () => {
  it('debe eliminar el insumo si existe', async () => {
    req.params.id = 3;
    Insumos.findOne.mockResolvedValue({ Id_Insumos: 3 });
    Insumos.destroy.mockResolvedValue(1);

    await eliminarInsumo(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Insumo eliminado'
    });
  });

  it('debe retornar 404 si el insumo no existe', async () => {
    req.params.id = 999;
    Insumos.findOne.mockResolvedValue(null);

    await eliminarInsumo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Obtener insumos activos
 * --------------------------------------------------------------------------------------
 */

describe('obtenerInsumosActivos', () => {
  it('debe devolver insumos activos con su categoría', async () => {
    const mockInsumos = [
      {
        Id_Insumos: 1,
        Nombre: 'Alcohol',
        Stock: 50,
        Estado: true,
        Id_Categoria_Insumos: 3,
        Id_Categoria_Insumos_Categoria_Insumo: { Nombre: 'Desinfectantes' }
      },
      {
        Id_Insumos: 2,
        Nombre: 'Guantes',
        Stock: 100,
        Estado: true,
        Id_Categoria_Insumos: 4,
        Id_Categoria_Insumos_Categoria_Insumo: null
      }
    ];

    Insumos.findAll.mockResolvedValue(mockInsumos);

    await obtenerInsumosActivos(req, res);

    expect(Insumos.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { Estado: true },
      include: expect.any(Object)
    }));

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: [
        {
          Id_Insumos: 1,
          Nombre: 'Alcohol',
          Stock: 50,
          Estado: true,
          Id_Categoria_Insumos: 3,
          Categoria: 'Desinfectantes'
        },
        {
          Id_Insumos: 2,
          Nombre: 'Guantes',
          Stock: 100,
          Estado: true,
          Id_Categoria_Insumos: 4,
          Categoria: 'Sin Categoría'
        }
      ]
    });
  });

  it('debe manejar errores internos y responder con 500', async () => {
    Insumos.findAll.mockRejectedValue(new Error('Fallo de base de datos'));

    await obtenerInsumosActivos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Fallo de base de datos'
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Obtener insumos por nombre de categoría dinámica
 * --------------------------------------------------------------------------------------
 */

describe('obtenerInsumosPorCategoria', () => {
  it('debe retornar insumos activos cuya categoría sea "Base"', async () => {
    req.params.nombre = 'Base';
    const mockInsumos = [{
      Id_Insumos: 1,
      Nombre: 'Glicerina',
      Estado: true,
      Id_Categoria_Insumos: 5,
      Id_Categoria_Insumos_Categoria_Insumo: { Nombre: 'Base' }
    }];

    Insumos.findAll.mockResolvedValue(mockInsumos);

    await obtenerInsumosPorCategoria(req, res);

    expect(Insumos.findAll).toHaveBeenCalledWith({
      where: { Estado: true },
      include: [{
        model: Categoria_Insumos,
        as: "Id_Categoria_Insumos_Categoria_Insumo",
        where: { Nombre: "Base" },
        attributes: ['Nombre']
      }]
    });

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockInsumos
    });
  });

  it('debe retornar insumos activos cuya categoría sea "Frasco"', async () => {
    req.params.nombre = 'Frasco';
    const mockInsumos = [{
      Id_Insumos: 2,
      Nombre: 'Frasco 250ml',
      Estado: true,
      Id_Categoria_Insumos: 6,
      Id_Categoria_Insumos_Categoria_Insumo: { Nombre: 'Frasco' }
    }];

    Insumos.findAll.mockResolvedValue(mockInsumos);

    await obtenerInsumosPorCategoria(req, res);

    expect(Insumos.findAll).toHaveBeenCalledWith(expect.objectContaining({
      include: expect.arrayContaining([
        expect.objectContaining({
          where: { Nombre: "Frasco" }
        })
      ])
    }));

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockInsumos
    });
  });

  it('debe retornar insumos activos cuya categoría sea "Fragancia"', async () => {
    req.params.nombre = 'Fragancia';
    const mockInsumos = [{
      Id_Insumos: 3,
      Nombre: 'Lavanda Premium',
      Estado: true,
      Id_Categoria_Insumos: 7,
      Id_Categoria_Insumos_Categoria_Insumo: { Nombre: 'Fragancia' }
    }];

    Insumos.findAll.mockResolvedValue(mockInsumos);

    await obtenerInsumosPorCategoria(req, res);

    expect(Insumos.findAll).toHaveBeenCalledWith(expect.objectContaining({
      include: expect.arrayContaining([
        expect.objectContaining({
          where: { Nombre: "Fragancia" }
        })
      ])
    }));

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockInsumos
    });
  });

  it('debe manejar errores internos del servidor', async () => {
    req.params.nombre = 'Fragancia';
    Insumos.findAll.mockRejectedValue(new Error('fail'));

    await obtenerInsumosPorCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'fail'
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

 
/**
________________________1¶¶¶¶_____________________
_______________________1¶__¶¶¶¶___________________
_______________________¶1___1¶¶¶__________________
_______________________¶1____11¶¶_________________
_______________________¶1_____11¶1________________
___________1111111_____¶1______¶1¶________________
________1¶¶111111¶¶¶¶1_¶1______11¶¶_______________
________¶¶¶111______1¶¶¶1_______¶1¶_______________
_________1¶¶¶¶¶¶¶1_____¶¶_______¶1¶1______________
_____________1¶¶¶¶¶1___1¶_______11¶¶______________
________________¶¶1¶1__1¶_______11¶¶______________
_________________1¶_¶___¶________11¶______________
__________________¶¶1¶__¶________11¶______________
___________________¶_¶1_¶________11¶11111_________
___________________1¶_¶_¶________¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶1_
____________________¶1¶¶¶1______¶1111111¶11¶___1¶_
___________________1111111¶¶__1¶111_11¶11¶_¶1___¶1
________________1¶1111111¶1¶¶1¶_¶1_11¶___1¶1¶___¶1
_____________11¶¶_1¶1_____1_¶¶_¶1_1¶¶_____¶_____¶_
___________1¶¶¶¶_¶¶¶1_______¶_¶1_1¶¶1_____¶____¶¶_
__________1¶__¶_¶1__¶¶_____111¶_¶11¶______¶___¶¶__
__________¶1___1¶___¶¶______1__11¶¶______1¶__¶¶___
__________¶____¶____¶1_____1¶__¶¶¶1______¶1_¶1____
_________1¶___¶¶___¶¶_____¶¶__¶1¶¶______1¶_¶1_____
_________¶¶__¶¶___¶¶_____¶¶___1¶¶_______¶¶1¶______
_________¶1_¶¶__1¶1____1¶1___¶1¶_________11_______
________¶¶_¶¶__¶¶____1¶¶___1¶1¶___________________
_______1¶¶¶1_¶¶1____¶¶1___11¶¶____________________
________11__¶¶____1¶¶_____¶¶¶_____________________
___________¶1____¶¶1____¶¶1¶______________________
__________¶1___1¶1____1¶1¶¶_______________________
_________¶1___¶¶____111¶¶1________________________
________¶¶__1¶1___1_1¶¶¶__________________________
________¶1_1¶1____¶¶¶¶1___________________________
_______¶¶__1¶__1¶¶¶¶1_____________________________
____1¶¶1____1¶¶¶¶¶1_______________________________
1¶¶¶¶1__1¶¶¶¶11___________________________________
¶¶¶¶_1¶¶1_________________________________________
1¶1¶¶¶____________________________________________

COMETELA NANDO

*/ 