import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { Model } from 'mongoose';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async onModuleInit() {
    const count = await this.menuModel.estimatedDocumentCount();
    if (count > 0) return;

    try {
      //await this.menuModel.updateMany({ status: null }, { status: true });

      await Promise.all([
        new this.menuModel({
          name: 'Usuarios',
          status: true,
          link: 'usuarios',
        }).save(),
        new this.menuModel({
          name: 'Roles',
          status: true,
          link: 'roles',
        }).save(),
        new this.menuModel({
          name: 'Modulos',
          status: true,
          link: 'modulos',
        }).save(),
        new this.menuModel({
          name: 'Permisos',
          status: true,
          link: 'permisos',
        }).save(),
        new this.menuModel({
          name: 'Productos',
          status: true,
          link: 'productos',
        }).save(),
        new this.menuModel({
          name: 'Marcas',
          status: true,
          link: 'marcas',
        }).save(),
        new this.menuModel({
          name: 'Modelos',
          status: true,
          link: 'modelos',
        }).save(),
        new this.menuModel({
          name: 'Unidad de medida',
          status: true,
          link: 'unidad-medida',
        }).save(),
        new this.menuModel({
          name: 'Gestion de clientes',
          status: true,
          link: 'clientes',
        }).save(),
        new this.menuModel({
          name: 'Proveedores',
          status: true,
          link: 'proveedores',
        }).save(),
        new this.menuModel({
          name: 'Realizar ventas',
          status: true,
          link: 'ventas',
        }).save(),
        // 27/01/2022
        // new this.menuModel({
        //   name: 'Consultar ventas',
        //   status: true,
        //   link: 'consultar-ventas',
        // }).save(),
        new this.menuModel({
          name: 'Consultar productos',
          status: true,
          link: 'consultar-productos',
        }).save(),
      ]);
    } catch (e) {
      throw new Error(`Error en MenuService.onModuleInit ${e}`);
    }
  }

  async create(createMenu: Menu): Promise<Menu> {
    const { link } = createMenu;
    const modifyData = {
      ...createMenu,
      link: link.toLowerCase(),
      status: true,
    };

    const createdMenu = new this.menuModel(modifyData);
    return createdMenu.save();
  }

  //Put a single menu
  async update(id: string, bodyMenu: Menu): Promise<Menu> {
    const { status } = bodyMenu;

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

    return await this.menuModel.findByIdAndUpdate(id, bodyMenu, { new: true });
  }

  //Delete a single menu
  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.menuModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async findAll(): Promise<Menu[]> {
    return await this.menuModel.find({ status: true }).exec();
  }

  async findbyName(name: any[]): Promise<any[]> {
    return await this.menuModel.find({ name: { $in: name } });
  }

  async findOneByName(link: string): Promise<MenuDocument> {
    return await this.menuModel.findOne({ link });
  }

  //Restore a single module
  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.menuModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }
}
