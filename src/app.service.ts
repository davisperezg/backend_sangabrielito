import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const unidades = [
      { id: '1', codigo: '4A', unidad: 'BOBINAS', activo: '0' },
      { id: '2', codigo: 'BJ', unidad: 'BALDE', activo: '0' },
      { id: '3', codigo: 'BLL', unidad: 'BARRILES', activo: '0' },
      { id: '4', codigo: 'BG', unidad: 'BOLSA', activo: '0' },
      { id: '5', codigo: 'BO', unidad: 'BOTELLAS', activo: '0' },
      { id: '6', codigo: 'BX', unidad: 'CAJA', activo: '1' },
      { id: '7', codigo: 'CT', unidad: 'CARTONES', activo: '0' },
      { id: '8', codigo: 'CMK', unidad: 'CENTIMETRO CUADRADO', activo: '0' },
      { id: '9', codigo: 'CMQ', unidad: 'CENTIMETRO CUBICO', activo: '0' },
      { id: '10', codigo: 'CMT', unidad: 'CENTIMETRO LINEAL', activo: '0' },
      { id: '11', codigo: 'CEN', unidad: 'CIENTO DE UNIDADES', activo: '0' },
      { id: '12', codigo: 'CY', unidad: 'CILINDRO', activo: '1' },
      { id: '13', codigo: 'CJ', unidad: 'CONOS', activo: '0' },
      { id: '14', codigo: 'DZN', unidad: 'DOCENA', activo: '0' },
      { id: '15', codigo: 'DZP', unidad: 'DOCENA POR 10**6', activo: '0' },
      { id: '16', codigo: 'BE', unidad: 'FARDO', activo: '0' },
      {
        id: '17',
        codigo: 'GLI',
        unidad: 'GALON INGLES (4,545956L)',
        activo: '0',
      },
      { id: '18', codigo: 'GRM', unidad: 'GRAMO', activo: '0' },
      { id: '19', codigo: 'GRO', unidad: 'GRUESA', activo: '0' },
      { id: '20', codigo: 'HLT', unidad: 'HECTOLITRO', activo: '0' },
      { id: '21', codigo: 'LEF', unidad: 'HOJA', activo: '0' },
      { id: '22', codigo: 'SET', unidad: 'JUEGO', activo: '0' },
      { id: '23', codigo: 'KGM', unidad: 'KILOGRAMO', activo: '1' },
      { id: '24', codigo: 'KTM', unidad: 'KILOMETRO', activo: '0' },
      { id: '25', codigo: 'KWH', unidad: 'KILOVATIO HORA', activo: '0' },
      { id: '26', codigo: 'KT', unidad: 'KIT', activo: '0' },
      { id: '27', codigo: 'CA', unidad: 'LATAS', activo: '0' },
      { id: '28', codigo: 'LBR', unidad: 'LIBRAS', activo: '0' },
      { id: '29', codigo: 'LTR', unidad: 'LITRO', activo: '1' },
      { id: '30', codigo: 'MWH', unidad: 'MEGAWATT HORA', activo: '0' },
      { id: '31', codigo: 'MTR', unidad: 'METRO', activo: '1' },
      { id: '32', codigo: 'MTK', unidad: 'METRO CUADRADO', activo: '0' },
      { id: '33', codigo: 'MTQ', unidad: 'METRO CUBICO', activo: '0' },
      { id: '34', codigo: 'MGM', unidad: 'MILIGRAMOS', activo: '0' },
      { id: '35', codigo: 'MLT', unidad: 'MILILITRO', activo: '0' },
      { id: '36', codigo: 'MMT', unidad: 'MILIMETRO', activo: '0' },
      { id: '37', codigo: 'MMK', unidad: 'MILIMETRO CUADRADO', activo: '0' },
      { id: '38', codigo: 'MMQ', unidad: 'MILIMETRO CUBICO', activo: '0' },
      { id: '39', codigo: 'MLL', unidad: 'MILLARES', activo: '0' },
      { id: '40', codigo: 'UM', unidad: 'MILLON DE UNIDADES', activo: '0' },
      { id: '41', codigo: 'ONZ', unidad: 'ONZAS', activo: '0' },
      { id: '42', codigo: 'PF', unidad: 'PALETAS', activo: '0' },
      { id: '43', codigo: 'PK', unidad: 'PAQUETE', activo: '0' },
      { id: '44', codigo: 'PR', unidad: 'PAR', activo: '0' },
      { id: '45', codigo: 'FOT', unidad: 'PIES', activo: '0' },
      { id: '46', codigo: 'FTK', unidad: 'PIES CUADRADOS', activo: '0' },
      { id: '47', codigo: 'FTQ', unidad: 'PIES CUBICOS', activo: '0' },
      { id: '48', codigo: 'C62', unidad: 'PIEZAS', activo: '0' },
      { id: '49', codigo: 'PG', unidad: 'PLACAS', activo: '0' },
      { id: '50', codigo: 'ST', unidad: 'PLIEGO', activo: '0' },
      { id: '51', codigo: 'INH', unidad: 'PULGADAS', activo: '0' },
      { id: '52', codigo: 'RM', unidad: 'RESMA', activo: '0' },
      { id: '53', codigo: 'DR', unidad: 'TAMBOR', activo: '0' },
      { id: '54', codigo: 'STN', unidad: 'TONELADA CORTA', activo: '0' },
      { id: '55', codigo: 'LTN', unidad: 'TONELADA LARGA', activo: '0' },
      { id: '56', codigo: 'TNE', unidad: 'TONELADAS', activo: '0' },
      { id: '57', codigo: 'TU', unidad: 'TUBOS', activo: '0' },
      { id: '58', codigo: 'NIU', unidad: 'UNIDAD (BIENES)', activo: '1' },
      { id: '59', codigo: 'ZZ', unidad: 'UNIDAD (SERVICIOS)', activo: '1' },
      { id: '60', codigo: 'GLL', unidad: 'US GALON (3,7843 L)', activo: '0' },
      { id: '61', codigo: 'YRD', unidad: 'YARDA', activo: '0' },
      { id: '62', codigo: 'YDK', unidad: 'YARDA CUADRADA', activo: '0' },
      { id: '63', codigo: 'VA', unidad: 'VARIOS', activo: '0' },
    ];

    const reforemtes = unidades.map((a) => {
      return {
        name: a.unidad,
        status: true,
      };
    });

    return reforemtes;
  }
}
