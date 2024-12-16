import { Controller, Post, Body } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { io } from 'socket.io-client';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly httpService: HttpService,
  ) {}

  @Post('api-check')
  @HealthCheck()
  async checkApi(@Body() body: { url: string; method: string; data?: any }) {
    const { url, data, method } = body;

    try {
      let response;

      // Dựa trên method, gọi đúng phương thức HTTP
      if (method.toUpperCase() === 'GET') {
        response = await firstValueFrom(this.httpService.get(url));
      } else if (method.toUpperCase() === 'POST') {
        response = await firstValueFrom(this.httpService.post(url, data));
      } else if (method.toUpperCase() === 'PUT') {
        response = await firstValueFrom(this.httpService.put(url, data));
      } else if (method.toUpperCase() === 'DELETE') {
        response = await firstValueFrom(this.httpService.delete(url));
      } else {
        return {
          status: 'fail',
          url,
          error: `Unsupported method: ${method}`,
        };
      }

      return {
        status: 'ok',
        url,
        message: response.data.message,
      };
    } catch (error) {
      return {
        status: 'fail',
        url,
        error: error.message,
      };
    }
  }

  @Post('socket-check')
  async checkSocket(@Body() body: { socketUrl: string }) {
    const { socketUrl } = body;

    return new Promise((resolve) => {
      const socket = io(socketUrl);

      socket.on('connect', () => {
        resolve({
          status: 'ok',
          socketUrl,
        });
        socket.disconnect();
      });

      socket.on('connect_error', (error) => {
        resolve({
          status: 'fail',
          socketUrl,
          error: error.message,
        });
        socket.disconnect();
      });
    });
  }
}
