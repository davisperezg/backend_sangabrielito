import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Client } from '../schemas/client.schema';
import { ClientService } from '../services/client.service';

@Controller('api/v1/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients() {
    return this.clientService.findAll();
  }

  @Get('/removes')
  getClientsRemoves() {
    return this.clientService.findAllDeleted();
  }

  @Post()
  async createClient(@Res() res, @Body() createBody: Client): Promise<Client> {
    const client = await this.clientService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Client Successfully Created',
      client,
    });
  }

  @Delete(':id')
  async deleteClient(@Res() res, @Param('id') id: string): Promise<boolean> {
    const clientDeleted = await this.clientService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Client Deleted Successfully',
      clientDeleted,
    });
  }

  @Put(':id')
  async updateClient(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Client,
  ): Promise<Client> {
    const clientUpdated = await this.clientService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Client Updated Successfully',
      clientUpdated,
    });
  }

  @Put('restore/:id')
  async restoreClient(@Res() res, @Param('id') id: string): Promise<Client> {
    const clientRestored = await this.clientService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Client Restored Successfully',
      clientRestored,
    });
  }
}
