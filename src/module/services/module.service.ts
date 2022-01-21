import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { Model } from 'mongoose';
import { MenuService } from 'src/menu/services/menu.service';
import { RoleDocument } from 'src/role/schemas/role.schema';
import { ModuleOptionsDocument } from 'src/module-options/schemas/module-options.schema';

@Injectable()
export class ModuleService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel('Role') private roleModel: Model<RoleDocument>,
    @InjectModel('ModuleOptions') private moModel: Model<ModuleOptionsDocument>,
    //@InjectModel('User') private userModel: Model<UserDocument>,
    private readonly menuService: MenuService,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.moduleModel.estimatedDocumentCount();
    if (count > 0) return;
    try {
      //ADD MODULES

      const getMenusADM = await this.menuService.findbyName([
        'Usuarios',
        'Roles',
        'Modulos',
        'Permisos',
      ]);

      const getMenusInventario = await this.menuService.findbyName([
        'Productos',
        'Marcas',
        'Categoria',
        'Unidad de medida',
      ]);

      const getMenusClient = await this.menuService.findbyName([
        'Gestion de clientes',
      ]);

      const getMenusCompras = await this.menuService.findbyName([
        'Proveedores',
      ]);

      const getMenusComprobantes = await this.menuService.findbyName([
        'Realizar ventas',
      ]);

      const findMenusADM = getMenusADM.map((men) => men._id);
      const findMenusInventario = getMenusInventario.map((men) => men._id);
      const findMenusClient = getMenusClient.map((men) => men._id);
      const findMenusCompras = getMenusCompras.map((men) => men._id);
      const findMenusComprobantes = getMenusComprobantes.map((men) => men._id);

      await Promise.all([
        new this.moduleModel({
          name: 'Administración de sistema',
          status: true,
          menu: findMenusADM,
        }).save(),
        new this.moduleModel({
          name: 'Inventario',
          status: true,
          menu: findMenusInventario,
        }).save(),
        new this.moduleModel({
          name: 'Clientes',
          status: true,
          menu: findMenusClient,
        }).save(),
        new this.moduleModel({
          name: 'Compras',
          status: true,
          menu: findMenusCompras,
        }).save(),
        new this.moduleModel({
          name: 'Comprobantes',
          status: true,
          menu: findMenusComprobantes,
        }).save(),
        new this.moduleModel({
          name: 'Consultas y Reportes',
          status: true,
        }).save(),
      ]);

      //ADD ROL

      const getModules = await this.findbyNames([
        'Administración de sistema',
        'Clientes',
        'Inventario',
        'Compras',
        'Comprobantes',
        'Consultas y Reportes',
      ]);

      const findModules = getModules.map((mo) => mo._id);

      await Promise.all([
        new this.roleModel({
          name: 'SUPER ADMINISTRADOR',
          status: true,
          module: findModules,
        }).save(),
        new this.roleModel({ name: 'ADMINISTRADOR', status: true }).save(),
      ]);

      //add resource
      const getRole = await this.roleModel.findOne({
        name: 'SUPER ADMINISTRADOR',
      });

      await Promise.all([
        new this.moModel({
          role: getRole._id,
          status: true,
          module: findModules[0],
          canCreate: true,
          canUpdate: true,
          canRead: true,
          canDelete: true,
        }).save(),
      ]);
    } catch (e) {
      throw new Error(`Error en ModuleService.onModuleInit ${e}`);
    }
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find({ status: true }).populate({
      path: 'menu',
    });
  }

  async findModuleByMenu(menu: string): Promise<Module> {
    const findMenu = await this.menuService.findOneByName(menu);

    return this.moduleModel
      .findOne({ status: true, menu: findMenu._id })
      .populate({
        path: 'menu',
      });
  }

  async findAllDeleted(): Promise<Module[]> {
    return this.moduleModel.find({ status: false }).populate({
      path: 'menu',
    });
  }

  //Find modules by names
  async findbyNames(name: any[]): Promise<ModuleDocument[]> {
    return await this.moduleModel.find({ name: { $in: name } });
  }

  //Find modules by names
  async findbyName(name: string): Promise<ModuleDocument> {
    return await this.moduleModel.findOne({ name });
  }

  //Add a single module
  async create(createMenu: Module): Promise<Module> {
    const { menu, name } = createMenu;

    const findModule = await this.moduleModel.findOne({ name });

    if (findModule) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'Item cannot be created',
        },
        HttpStatus.CONFLICT,
      );
    }

    const getMenus = await this.menuService.findbyName(menu);
    const findMenus = getMenus.map((men) => men._id);

    const modifyData: Module = {
      ...createMenu,
      status: true,
      menu: findMenus,
    };

    const createdModule = new this.moduleModel(modifyData);
    return createdModule.save();
  }

  //Delete a single module
  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.moduleModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  //Put a single module
  async update(id: string, bodyModule: Module): Promise<Module> {
    const { status, menu } = bodyModule;

    if (status) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          type: 'UNAUTHORIZED',
          message: 'Unauthorized Exception',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const getMenus = await this.menuService.findbyName(menu);
    const findMenus = getMenus.map((men) => men._id);

    const modifyData: Module = {
      ...bodyModule,
      menu: findMenus,
    };

    return await this.moduleModel.findByIdAndUpdate(id, modifyData, {
      new: true,
    });
  }

  //Restore a single module
  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.moduleModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }
}
