import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AreaService } from 'src/area/services/area.service';
import { comparePassword, hashPassword } from 'src/lib/helpers/auth.helper';
import { RoleService } from 'src/role/services/role.service';
import { User, UserDocument } from '../schemas/user.schema';
import axios from 'axios';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly roleService: RoleService,
    private readonly areaService: AreaService, //@InjectModel('Role') private readonly roleModel: Model<RoleDocument>, //@InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.userModel.estimatedDocumentCount();
    if (count > 0) return;
    try {
      const passwordHashed = await hashPassword('admin123');
      const getRole = await this.roleService.findRoleByName(
        String('SUPER ADMINISTRADOR'),
      );
      const getArea = await this.areaService.findAreaByName(
        String('SIN ASIGNAR'),
      );

      await this.userModel.insertMany([
        {
          name: 'Blas',
          lastname: 'Solorzano',
          tipDocument: 'DNI',
          nroDocument: '99999999',
          email: 'admin@dev.kematechnology.com',
          username: '99999999',
          password: passwordHashed,
          status: true,
          role: getRole._id,
          area: getArea._id,
        },
      ]);
    } catch (e) {
      throw new Error(`Error en ModuleService.onModuleInit ${e}`);
    }
  }

  async changePassword(id: string, newPassword: string): Promise<boolean> {
    let result = false;

    const findUser = await this.userModel.findById({ _id: id });

    const { _id } = findUser;

    if (newPassword) {
      const passwordHashed = await hashPassword(newPassword);

      await this.userModel.findByIdAndUpdate(
        _id,
        {
          password: passwordHashed,
        },
        { new: true },
      );

      result = true;
    }

    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ status: true }).populate([
      {
        path: 'role',
      },
      {
        path: 'area',
      },
    ]);
  }

  async findPerson(type: string, number: string) {
    console.log(process.env.TOKEN_APIS_NET);
    const { data } = await axios.get(
      `https://api.apis.net.pe/v1/${type}?numero=${number}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.TOKEN_APIS_NET}`,
        },
      },
    );
    return data;
  }

  async findAllDeleted(): Promise<User[]> {
    return this.userModel.find({ status: false }).populate({
      path: 'role',
    });
  }

  //Add a single user
  async create(createUser: User): Promise<User> {
    const { nroDocument, email, username, role, password, area } = createUser;

    //const findModule = await this.userModel.findOne({ name });
    const findNro = await this.userModel.findOne({ nroDocument });
    const findEmail = await this.userModel.findOne({ email });
    const findUsername = await this.userModel.findOne({ username });

    if (!area) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'Area is requerid',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (!role) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'Role is requerid',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (findNro) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El nro de documento ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (findEmail) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El correo ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (findUsername) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El usuario ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHashed = await hashPassword(password);

    const getRole = await this.roleService.findRoleByName(String(role));
    const getArea = await this.areaService.findAreaByName(String(area));

    const modifyData: User = {
      ...createUser,
      password: passwordHashed,
      area: getArea._id,
      role: getRole._id,
      status: true,
    };

    const createdUser = new this.userModel(modifyData);
    return createdUser.save();
  }

  //Delete a single user
  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.userModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  //Put a single user
  async update(id: string, bodyUser: User): Promise<User> {
    const { nroDocument, email, username, status, role, area } = bodyUser;

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

    const findNro = await this.userModel.findOne({ nroDocument });
    const findEmail = await this.userModel.findOne({ email });
    const findUsername = await this.userModel.findOne({ username });

    if (findNro && findNro._id.toString() !== id.toString()) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El nro de documento ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (findEmail && findEmail._id.toString() !== id.toString()) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El correo ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (findUsername && findUsername._id.toString() !== id.toString()) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El usuario ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const getRole = await this.roleService.findRoleByName(String(role));
    const getArea = await this.areaService.findAreaByName(String(area));

    const modifyData: User = {
      ...bodyUser,
      area: getArea._id,
      role: getRole._id,
    };

    return await this.userModel.findByIdAndUpdate(id, modifyData, {
      new: true,
    });
  }

  //Restore a single user
  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.userModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  //find user by username
  async findUserByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username });
  }

  //find user by id
  async findUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).populate([
      {
        path: 'role',
        populate: [
          {
            path: 'module',
            populate: [{ path: 'menu' }, { path: 'option' }],
          },
        ],
      },
      {
        path: 'area',
      },
    ]);
  }
}
