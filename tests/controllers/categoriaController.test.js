const {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  cambiarEstado,
  eliminarCategoria,
} = require('../../src/controllers/categoriaInsumo.controller');

const { Categoria_Insumos, Insumos } = require('../../src/models');

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
 * Tests para el controlador de categorías
 * cada función del controlador se prueba individualmente
 * las pruebas incluyen casos de éxito y error
 * cada prueba verifica que se llamen los métodos correctos de res
 * y que se manejen los errores adecuadamente
 * los mocks se utilizan para simular el comportamiento de los modelos
 * y evitar llamadas a la base de datos real
 * los tests cubren los siguientes casos:
 * - Listar categorías
 * - Obtener categoría por ID
 * - Crear categoría
 * - Actualizar categoría
 * - Cambiar estado de categoría
 * - Eliminar categoría
 * 
 * ROLDO ES EL MEJOR
 */

/**
 * Listar categorías
 */

describe('listarCategorias', () => {
  it('debe devolver lista de categorías', async () => {
    Categoria_Insumos.findAll.mockResolvedValue([{ Nombre: 'Cat1' }]);

    await listarCategorias(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: [{ Nombre: 'Cat1' }]
    });
  });

  it('debe manejar errores internos', async () => {
    Categoria_Insumos.findAll.mockRejectedValue(new Error('fail'));

    await listarCategorias(req, res);

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
 * Obtener categoría por ID
 */

describe('obtenerCategoriaPorId', () => {
  it('debe devolver la categoría encontrada', async () => {
    req.params.id = 1;
    Categoria_Insumos.findByPk.mockResolvedValue({ id: 1 });

    await obtenerCategoriaPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { id: 1 }
    });
  });

  it('debe devolver error si no existe', async () => {
    req.params.id = 2;
    Categoria_Insumos.findByPk.mockResolvedValue(null);

    await obtenerCategoriaPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: `No se encontró categoría con id 2`
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * Crear categoría
 */
describe('crearCategoria', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        Nombre: 'Categoria123',
        Descripcion: 'Descripción válida',
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('debe crear una categoría válida', async () => {
    Categoria_Insumos.findOne.mockResolvedValue(null);
    Categoria_Insumos.create.mockResolvedValue({
      Id_Categoria_Insumos: 1,
      Nombre: 'Categoria123',
      Descripcion: 'Descripción válida',
      Estado: 1
    });

    await crearCategoria(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      data: expect.any(Object),
    }));
  });

  it('debe rechazar si el nombre está vacío', async () => {
    req.body.Nombre = '  ';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('El nombre es obligatorio')
    }));
  });

  it('debe rechazar si la descripción está vacía', async () => {
    req.body.Descripcion = '';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('La descripción es obligatoria')
    }));
  });

  it('debe rechazar si el nombre es muy corto', async () => {
    req.body.Nombre = 'ab';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre debe tener al menos 3 caracteres.'
    }));
  });

  it('debe rechazar si el nombre contiene espacios', async () => {
    req.body.Nombre = 'abc def';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre no debe contener espacios.'
    }));
  });

  it('debe rechazar si el nombre tiene caracteres inválidos', async () => {
    req.body.Nombre = 'abc#123';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('El nombre solo debe contener letras y números')
    }));
  });

  it('debe rechazar si la descripción es muy corta', async () => {
    req.body.Descripcion = 'abc';
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('La descripción debe tener entre 5 y 100 caracteres')
    }));
  });

  it('debe rechazar si la descripción es muy larga', async () => {
    req.body.Descripcion = 'a'.repeat(101);
    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('La descripción debe tener entre 5 y 100 caracteres')
    }));
  });

  it('debe rechazar si ya existe una categoría con ese nombre', async () => {
    Categoria_Insumos.findOne.mockResolvedValue({ Nombre: 'Categoria123' });

    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Ya existe una categoría con ese nombre.',
    });
  });

  it('debe manejar errores internos', async () => {
    Categoria_Insumos.findOne.mockRejectedValue(new Error('DB fail'));

    await crearCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error al crear la categoría de insumo',
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * Actualizar categoría
 */

describe('actualizarCategoria', () => {
  beforeEach(() => {
    req.params.id = 1;
    req.body = {
      Nombre: 'CategoriaValida',
      Descripcion: 'Descripción válida'
    };
    jest.clearAllMocks();
  });

  it('debe actualizar si es válido', async () => {
    Categoria_Insumos.findOne
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(null);

    Categoria_Insumos.update.mockResolvedValue();

    await actualizarCategoria(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Categoría de insumo actualizada exitosamente.',
    });
  });

  it('debe devolver 404 si no encuentra la categoría', async () => {
    Categoria_Insumos.findOne.mockResolvedValue(null);

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Categoría de insumo no encontrada'
    }));
  });

  it('debe rechazar si el nombre está vacío', async () => {
    req.body.Nombre = '  ';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre es obligatorio.'
    }));
  });

  it('debe rechazar si la descripción está vacía', async () => {
    req.body.Descripcion = ' ';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La descripción es obligatoria.'
    }));
  });

  it('debe rechazar si el nombre tiene menos de 3 caracteres', async () => {
    req.body.Nombre = 'ab';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre debe tener al menos 3 caracteres.'
    }));
  });

  it('debe rechazar si el nombre contiene espacios', async () => {
    req.body.Nombre = 'Cate goria';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre no debe contener espacios.'
    }));
  });

  it('debe rechazar si el nombre contiene caracteres inválidos', async () => {
    req.body.Nombre = 'Categ@!';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'El nombre solo debe contener letras y números sin espacios.'
    }));
  });

  it('debe rechazar si la descripción es muy corta', async () => {
    req.body.Descripcion = '1234';
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La descripción debe tener entre 5 y 100 caracteres.'
    }));
  });

  it('debe rechazar si la descripción es muy larga', async () => {
    req.body.Descripcion = 'a'.repeat(101);
    Categoria_Insumos.findOne.mockResolvedValue({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La descripción debe tener entre 5 y 100 caracteres.'
    }));
  });

  it('debe devolver error si ya existe otra con el mismo nombre', async () => {
    Categoria_Insumos.findOne
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Ya existe otra categoría con ese nombre.',
    });
  });

  it('debe manejar errores internos del servidor', async () => {
    Categoria_Insumos.findOne.mockRejectedValue(new Error('Fallo interno'));

    await actualizarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Error interno del servidor.'
    }));
  });
});


/**
 *--------------------------------------------------------------------------------------
 */

/**
 * Cambiar estado de categoría
 */

describe('cambiarEstado', () => {
  it('debe cambiar el estado de la categoría', async () => {
    req.params.id = 1;

    const mockCategoria = { Estado: true, save: jest.fn(), Id_Categoria_Insumos: 1 };
    Categoria_Insumos.findByPk.mockResolvedValue(mockCategoria);

    await cambiarEstado(req, res);

    expect(mockCategoria.Estado).toBe(false);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockCategoria
    });
  });

  it('debe devolver 404 si no se encuentra', async () => {
    req.params.id = 1;
    Categoria_Insumos.findByPk.mockResolvedValue(null);

    await cambiarEstado(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Categoría no encontrada'
    });
  });
});

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * Eliminar categoría
 */

describe('eliminarCategoria', () => {
  it('debe eliminar si no tiene insumos asociados', async () => {
    req.params.id = 1;

    Categoria_Insumos.findOne.mockResolvedValue({});
    Insumos.count.mockResolvedValue(0);
    Categoria_Insumos.destroy.mockResolvedValue();

    await eliminarCategoria(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Categoría eliminada'
    });
  });

  it('debe rechazar si tiene insumos asociados', async () => {
    req.params.id = 1;

    Categoria_Insumos.findOne.mockResolvedValue({});
    Insumos.count.mockResolvedValue(5);

    await eliminarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'No se puede eliminar la categoría porque tiene insumos asociados',
    });
  });

  it('debe devolver 404 si no se encuentra', async () => {
    req.params.id = 999;
    Categoria_Insumos.findOne.mockResolvedValue(null);

    await eliminarCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Categoría no encontrada'
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